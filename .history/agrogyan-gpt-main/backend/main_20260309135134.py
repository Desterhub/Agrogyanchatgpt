# from fastapi import FastAPI
from datetime import datetime
from zoneinfo import ZoneInfo

from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session
from backend.database import SessionLocal, engine, Base
from backend.models import User, Post
from backend.data_loader import load_documents
from backend.retriever import Retriever
from deep_translator import GoogleTranslator
import hashlib
from fastapi import File, UploadFile, FastAPI
from PIL import Image
import pytesseract
import io
import requests

# =====================================
# APP INITIALIZATION
# =====================================

app = FastAPI()

Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # allow all for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =====================================
# SIMPLE PASSWORD HASHING (Stable)
# =====================================

def hash_password(password: str):
    return hashlib.sha256(password.encode()).hexdigest()

def verify_password(plain_password, hashed_password):
    return hashlib.sha256(plain_password.encode()).hexdigest() == hashed_password


# =====================================
# LOAD DOCUMENTS
# =====================================

documents = load_documents("backend/uploads/data.csv")
retriever = Retriever(documents)

# =====================================
# REQUEST MODELS
# =====================================

class QuestionRequest(BaseModel):
    question: str
    language: str

class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

class PostCreate(BaseModel):
    content: str
    user_id: int


# =====================================
# TRANSLATION FUNCTION
# =====================================

def translate_text(text: str, language: str):
    if language == "English":
        return text

    lang_map = {
        "Hindi": "hi",
        "Marathi": "mr"
    }

    return GoogleTranslator(
        source="auto",
        target=lang_map.get(language, "en")
    ).translate(text)


def _format_ts_ist(ts):
    if ts is None:
        return None

    # Ensure tz-aware datetime
    if ts.tzinfo is None:
        ts = ts.replace(tzinfo=ZoneInfo("UTC"))

    return ts.astimezone(ZoneInfo("Asia/Kolkata")).isoformat()


# =====================================
# REGISTER USER
# =====================================

@app.post("/register")
def register_user(req: RegisterRequest):
    db: Session = SessionLocal()

    existing_user = db.query(User).filter(User.email == req.email).first()

    if existing_user:
        db.close()
        return {"message": "User already registered with this email."}

    new_user = User(
        name=req.name,
        email=req.email,
        password=hash_password(req.password)
    )

    db.add(new_user)
    db.commit()
    db.close()

    return {"message": "Registration successful!"}


# =====================================
# LOGIN USER
# =====================================

@app.post("/login")
def login_user(req: LoginRequest):
    db: Session = SessionLocal()

    user = db.query(User).filter(User.email == req.email).first()

    if not user:
        db.close()
        return {"message": "Invalid email or password."}

    if not verify_password(req.password, user.password):
        db.close()
        return {"message": "Invalid email or password."}

    db.close()

    return {
        "message": "Login successful!",
        "user": user.name
    }

# =====================================
# COMMUNITY ROUTES
# =====================================

comments_db = {}


@app.post("/community/create-post")
def create_post(post: PostCreate):

    db = SessionLocal()

    new_post = Post(
        content=post.content,
        user_id=post.user_id
    )

    db.add(new_post)
    db.commit()
    db.refresh(new_post)

    db.close()

    return {
        "message": "Post created successfully",
        "timestamp": _format_ts_ist(new_post.timestamp)
    }



@app.get("/community/posts")
def get_posts():

    db = SessionLocal()

    posts = db.query(Post).order_by(Post.timestamp.desc()).all()

    result = []

    for p in posts:

        result.append({
            "id": p.id,
            "content": p.content,
            "user_id": p.user_id,
            "timestamp": _format_ts_ist(p.timestamp),
            "likes": p.likes if hasattr(p, "likes") else 0,
            "dislikes": p.dislikes if hasattr(p, "dislikes") else 0
        })

    db.close()

    return result



@app.post("/community/like/{post_id}")
def like_post(post_id: int):

    db = SessionLocal()

    post = db.query(Post).filter(Post.id == post_id).first()

    if post:

        if not hasattr(post, "likes"):
            post.likes = 0

        post.likes += 1

        db.commit()

    db.close()

    return {"message": "liked"}



@app.post("/community/dislike/{post_id}")
def dislike_post(post_id: int):

    db = SessionLocal()

    post = db.query(Post).filter(Post.id == post_id).first()

    if post:

        if not hasattr(post, "dislikes"):
            post.dislikes = 0

        post.dislikes += 1

        db.commit()

    db.close()

    return {"message": "disliked"}



class CommentCreate(BaseModel):
    post_id: int
    text: str



@app.post("/community/comment")
def add_comment(comment: CommentCreate):

    if comment.post_id not in comments_db:
        comments_db[comment.post_id] = []

    comments_db[comment.post_id].append({
        "text": comment.text
    })

    return {"message": "comment added"}



@app.get("/community/comments/{post_id}")
def get_comments(post_id: int):

    return comments_db.get(post_id, [])


# =====================================
# ASK QUESTION
# =====================================

@app.post("/ask")
def ask_question(req: QuestionRequest):

    result = retriever.answer(req.question)
    translated_answer = translate_text(result["answer"], req.language)

    return {
        "answer": translated_answer,
        "confidence": result["confidence"]
    }


# =====================================
# IMAGE OCR + LOCAL LLM
# =====================================

@app.post("/upload-image/")
async def upload_image(file: UploadFile = File(...)):

    contents = await file.read()
    image = Image.open(io.BytesIO(contents))

    pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

    extracted_text = pytesseract.image_to_string(image).strip()

    if not extracted_text:
        return {
            "extracted_text": "",
            "llm_response": "No answer found",
            "confidence": 0.0
        }

    # Use SAME retriever logic as /ask
    result = retriever.answer(extracted_text)

    return {
        "extracted_text": extracted_text,
        "llm_response": result["answer"],
        "confidence": result["confidence"]
    }
    if len(extracted_text.strip()) < 5:
        return {
            "extracted_text": extracted_text,
            "llm_response": "No answer found",
            "confidence": 0.0
        }