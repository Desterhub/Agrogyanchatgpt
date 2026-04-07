from __future__ import annotations

import hashlib
import io
import json
import os
import random
from collections import Counter
from datetime import datetime, timedelta
from pathlib import Path
from typing import Optional

from deep_translator import GoogleTranslator
from fastapi import FastAPI, File, HTTPException, Query, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from PIL import Image
from pydantic import BaseModel
from sqlalchemy import func
from sqlalchemy.orm import Session
from starlette.staticfiles import StaticFiles

from backend.data_loader import load_documents
from backend.database import Base, SessionLocal, engine
from backend.intelligence import (
    analyze_document_text,
    analyze_leaf_image,
    build_dashboard_payload,
    community_insights,
    daily_briefing,
    generate_farm_plan,
    loan_insurance_assistant,
    map_context,
    market_prediction,
    merge_profile,
    pest_outbreak_risk,
    scheme_eligibility,
    simplify_text,
    weather_alerts,
)
from backend.models import AlertRecord, FarmProfile, MandiPrice, OtpSession, Post, QueryMemory, User, WeatherSnapshot
from backend.retriever import Retriever

try:
    import pytesseract
except Exception:  # pragma: no cover
    pytesseract = None


app = FastAPI()
Base.metadata.create_all(bind=engine)
BASE_DIR = Path(__file__).resolve().parent.parent
FRONTEND_DIR = BASE_DIR / "frontend"

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


documents = load_documents("backend/uploads/data.csv")
retriever = Retriever(documents)
comments_db: dict[int, list[dict[str, str]]] = {}
OTP_EXPIRY_MINUTES = 10
OTP_RESEND_SECONDS = 45
PHASE_TWO_MODULES = [
    {"id": "pest-outbreak", "label": "District pest outbreak engine", "status": "foundation-ready"},
    {"id": "scheme-ai", "label": "State and central scheme matching AI", "status": "foundation-ready"},
    {"id": "doc-ai", "label": "Document insights for soil, subsidy, and insurance files", "status": "live"},
    {"id": "voice-ai", "label": "Voice-first assistant in regional languages", "status": "live"},
]
PHASE_THREE_MODULES = [
    {"id": "subscriptions", "label": "Premium advisory subscriptions", "status": "scaffolded"},
    {"id": "offline-lite", "label": "Low-network sync and offline-lite experience", "status": "scaffolded"},
    {"id": "call-assistant", "label": "Voice call assistant for low-literacy users", "status": "scaffolded"},
    {"id": "commerce", "label": "Inputs marketplace and partner ecosystem", "status": "scaffolded"},
]
ADMIN_EMAIL = "harsh@07gmail.com"
ADMIN_PASSWORD = "harsh@07"
ADMIN_NAME = "Harsh Admin"
TRACKED_CROPS = [
    "tomato",
    "capsicum",
    "paddy",
    "wheat",
    "cotton",
    "soybean",
    "sugarcane",
    "mustard",
    "onion",
    "maize",
    "potato",
    "chilli",
]


def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return hashlib.sha256(plain_password.encode()).hexdigest() == hashed_password


def is_admin_credentials(email: str, password: str) -> bool:
    return (email or "").strip().lower() == ADMIN_EMAIL and password == ADMIN_PASSWORD


def is_admin_email(email: str) -> bool:
    return (email or "").strip().lower() == ADMIN_EMAIL


def hash_otp(code: str) -> str:
    return hashlib.sha256(code.encode()).hexdigest()


def now_utc() -> datetime:
    return datetime.utcnow()


def generate_otp() -> str:
    return f"{random.randint(100000, 999999)}"


def translate_text(text: str, language: str) -> str:
    if language == "English":
        return text

    lang_map = {"Hindi": "hi", "Marathi": "mr"}
    return GoogleTranslator(source="auto", target=lang_map.get(language, "en")).translate(text)


def get_db() -> Session:
    return SessionLocal()


def get_user_by_id(db: Session, user_id: Optional[int]) -> Optional[User]:
    if not user_id:
        return None
    return db.query(User).filter(User.id == user_id).first()


def save_memory(db: Session, user_id: Optional[int], question: str, answer: str, language: str, context_tag: str = "assistant") -> None:
    if not user_id:
        return
    memory = QueryMemory(
        user_id=user_id,
        question=question,
        answer=answer,
        language=language,
        context_tag=context_tag,
    )
    db.add(memory)
    db.commit()


def extract_crop_mentions(text: str) -> list[str]:
    normalized = (text or "").lower()
    return [crop.title() for crop in TRACKED_CROPS if crop in normalized]


def get_timeframe_start(timeframe: str) -> Optional[datetime]:
    normalized = (timeframe or "all").strip().lower()
    if normalized == "today":
        now = now_utc()
        return datetime(now.year, now.month, now.day)
    if normalized == "week":
        return now_utc() - timedelta(days=7)
    return None


def build_admin_analytics(db: Session, timeframe: str = "all") -> dict:
    start_time = get_timeframe_start(timeframe)

    user_query = db.query(User)
    memory_query = db.query(QueryMemory)
    post_query = db.query(Post)

    if start_time:
        user_query = user_query.filter(User.created_at >= start_time)
        memory_query = memory_query.filter(QueryMemory.timestamp >= start_time)
        post_query = post_query.filter(Post.timestamp >= start_time)

    total_users = user_query.count()
    total_questions = memory_query.count()
    total_posts = post_query.count()
    verified_users = user_query.filter(User.phone_verified.is_(True)).count()

    top_regions_query = (
        db.query(
            User.state,
            User.district,
            func.count(User.id).label("user_count"),
        )
        .filter(User.state.isnot(None), User.state != "", User.district.isnot(None), User.district != "")
    )
    if start_time:
        top_regions_query = top_regions_query.filter(User.created_at >= start_time)
    top_regions = (
        top_regions_query
        .group_by(User.state, User.district)
        .order_by(func.count(User.id).desc(), User.state.asc(), User.district.asc())
        .limit(6)
        .all()
    )

    question_regions_query = (
        db.query(
            User.state,
            User.district,
            func.count(QueryMemory.id).label("question_count"),
        )
        .join(QueryMemory, QueryMemory.user_id == User.id)
        .filter(User.state.isnot(None), User.state != "", User.district.isnot(None), User.district != "")
    )
    if start_time:
        question_regions_query = question_regions_query.filter(QueryMemory.timestamp >= start_time)
    question_regions = (
        question_regions_query
        .group_by(User.state, User.district)
        .order_by(func.count(QueryMemory.id).desc(), User.state.asc(), User.district.asc())
        .limit(6)
        .all()
    )

    crop_counter: Counter[str] = Counter()
    for row in memory_query.with_entities(QueryMemory.question).all():
        crop_counter.update(extract_crop_mentions(row.question))
    for row in user_query.with_entities(User.crop_name).filter(User.crop_name.isnot(None), User.crop_name != "").all():
        crop_counter.update([row.crop_name.strip().title()])

    recent_users = (
        user_query
        .order_by(User.created_at.desc(), User.id.desc())
        .limit(5)
        .all()
    )

    top_crop_rows = [
        {"crop": crop, "count": count}
        for crop, count in crop_counter.most_common(6)
    ] or [{"crop": "Tomato", "count": 0}]

    active_region_rows = [
        {
            "region": f"{row.district}, {row.state}",
            "users": row.user_count,
        }
        for row in top_regions
    ] or [{"region": "Pune, Maharashtra", "users": 0}]

    region_activity_rows = [
        {
            "region": f"{row.district}, {row.state}",
            "questions": row.question_count,
        }
        for row in question_regions
    ] or [{"region": "Pune, Maharashtra", "questions": 0}]

    recent_user_rows = [
        {
            "name": user.name,
            "email": user.email,
            "region": ", ".join(part for part in [user.district, user.state] if part) or "Unknown region",
            "role": user.role or "farmer",
        }
        for user in recent_users
    ]

    return {
        "metrics": {
            "users": total_users,
            "questions": total_questions,
            "posts": total_posts,
            "verified_users": verified_users,
        },
        "timeframe": timeframe,
        "generated_at": now_utc().isoformat(),
        "top_crops": top_crop_rows,
        "active_regions": active_region_rows,
        "region_activity": region_activity_rows,
        "recent_users": recent_user_rows,
        "platform_health": [
            {"label": "Phone verified users", "value": verified_users},
            {"label": "Community posts", "value": total_posts},
            {"label": "AI questions asked", "value": total_questions},
        ],
    }


def get_or_create_farm_profile(db: Session, user_id: int) -> FarmProfile:
    profile = db.query(FarmProfile).filter(FarmProfile.user_id == user_id).first()
    if profile:
        return profile

    profile = FarmProfile(user_id=user_id)
    db.add(profile)
    db.commit()
    db.refresh(profile)
    return profile


def serialize_farm_profile(profile: FarmProfile | None) -> dict:
    if not profile:
        return {}
    return {
        "farm_name": profile.farm_name or "",
        "primary_crop": profile.primary_crop or "",
        "irrigation_type": profile.irrigation_type or "",
        "livestock": profile.livestock or "",
        "taluka": profile.taluka or "",
        "pin_code": profile.pin_code or "",
        "lat": profile.lat or "",
        "lng": profile.lng or "",
    }


def build_seed_weather(state: str, district: str, crop: str) -> dict[str, str]:
    crop_name = crop or "Wheat"
    return {
        "state": state or "Maharashtra",
        "district": district or "Pune",
        "condition": "Partly cloudy with good field windows",
        "temperature": "29C",
        "humidity": "66%",
        "wind": "12 km/h",
        "rain_probability": "24%",
        "advisory": f"Good spray window for {crop_name.lower()} before late afternoon humidity increases.",
    }


def build_seed_markets(state: str, district: str, crop: str) -> list[dict[str, str]]:
    primary_crop = crop or "Wheat"
    crops = [primary_crop, "Paddy", "Cotton", "Soybean"]
    base_prices = {
        "Wheat": "2425",
        "Paddy": "2180",
        "Cotton": "6940",
        "Soybean": "4860",
        "Sugarcane": "340",
    }
    return [
        {
            "state": state or "Maharashtra",
            "district": district or "Pune",
            "mandi_name": f"{district or 'Pune'} Agri Market",
            "crop": item,
            "variety": "Local",
            "price": base_prices.get(item, "2500"),
            "trend": f"Healthy arrivals and buyer interest for {item.lower()} in nearby mandis.",
        }
        for item in crops
    ]


def build_seed_alerts(user: User | None) -> list[dict[str, str]]:
    district = getattr(user, "district", None) or "Pune"
    crop = getattr(user, "crop_name", None) or "Wheat"
    return [
        {
            "severity": "medium",
            "title": "Spray window watch",
            "body": f"{district} is showing a cleaner spray window in the next 4 to 6 hours for {crop.lower()}.",
            "category": "weather",
        },
        {
            "severity": "low",
            "title": "Market movement",
            "body": f"Nearby mandi prices for {crop.lower()} are stable with slight upside support.",
            "category": "market",
        },
    ]


def ensure_seed_operating_data(db: Session, user: User | None) -> None:
    if not user:
        return

    state = user.state or "Maharashtra"
    district = user.district or "Pune"
    crop = user.crop_name or "Wheat"

    weather_exists = (
        db.query(WeatherSnapshot)
        .filter(WeatherSnapshot.state == state, WeatherSnapshot.district == district)
        .first()
    )
    if not weather_exists:
        weather = build_seed_weather(state, district, crop)
        db.add(
            WeatherSnapshot(
                state=weather["state"],
                district=weather["district"],
                condition=weather["condition"],
                temperature=weather["temperature"],
                humidity=weather["humidity"],
                wind=weather["wind"],
                rain_probability=weather["rain_probability"],
                advisory=weather["advisory"],
                source="seed",
            )
        )

    mandi_exists = (
        db.query(MandiPrice)
        .filter(MandiPrice.state == state, MandiPrice.district == district)
        .first()
    )
    if not mandi_exists:
        for item in build_seed_markets(state, district, crop):
            db.add(
                MandiPrice(
                    state=item["state"],
                    district=item["district"],
                    mandi_name=item["mandi_name"],
                    crop=item["crop"],
                    variety=item["variety"],
                    price=item["price"],
                    trend=item["trend"],
                    source="seed",
                )
            )

    alert_exists = (
        db.query(AlertRecord)
        .filter(AlertRecord.user_id == user.id)
        .first()
    )
    if not alert_exists:
        for item in build_seed_alerts(user):
            db.add(
                AlertRecord(
                    user_id=user.id,
                    state=state,
                    district=district,
                    crop=crop,
                    severity=item["severity"],
                    title=item["title"],
                    body=item["body"],
                    category=item["category"],
                    source="seed",
                )
            )

    get_or_create_farm_profile(db, user.id)
    db.commit()


def send_otp_via_provider(phone_number: str, otp_code: str, channel: str) -> dict[str, str]:
    provider = (os.getenv("OTP_PROVIDER") or "mock").lower()
    if provider == "mock":
        return {
            "status": "mocked",
            "provider_reference": f"mock-{phone_number[-4:]}",
            "provider_message": f"Demo mode OTP for {channel}: {otp_code}",
            "debug_otp": otp_code,
        }

    return {
        "status": "queued",
        "provider_reference": f"{provider}-{phone_number[-4:]}",
        "provider_message": f"OTP queued through {provider} over {channel}.",
    }


def register_verified_user(db: Session, payload: dict, channel: str) -> User:
    new_user = User(
        name=payload["name"],
        email=payload["email"],
        password=hash_password(payload["password"]),
        mobile_number=payload["mobile_number"],
        date_of_birth=payload["date_of_birth"],
        state=payload["state"],
        district=payload["district"],
        preferred_language=payload.get("preferred_language") or "English",
        simple_mode="off",
        role=payload.get("role") or "farmer",
        phone_verified=True,
        otp_channel=channel,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    ensure_seed_operating_data(db, new_user)
    return new_user


def update_user_profile(user: User, payload: "ProfileUpdateRequest") -> None:
    for field in [
        "crop_name",
        "land_size",
        "soil_type",
        "season",
        "state",
        "district",
        "village",
        "preferred_language",
        "simple_mode",
    ]:
        value = getattr(payload, field, None)
        if value is not None:
            setattr(user, field, value)


class QuestionRequest(BaseModel):
    question: str
    language: str
    user_id: Optional[int] = None
    explain_simply: bool = False


class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str
    mobile_number: str
    date_of_birth: str
    state: str
    district: str
    preferred_language: str = "English"
    otp_channel: str = "sms"
    role: str = "farmer"


class LoginRequest(BaseModel):
    email: str
    password: str


class PostCreate(BaseModel):
    content: str
    user_id: int


class ReactionRequest(BaseModel):
    post_id: int
    emoji: str


class PostUpdate(BaseModel):
    post_id: int
    user_id: int
    content: str


class PostDelete(BaseModel):
    post_id: int
    user_id: int


class CommentCreate(BaseModel):
    post_id: int
    user_id: int
    text: str


class ProfileUpdateRequest(BaseModel):
    user_id: int
    crop_name: Optional[str] = None
    land_size: Optional[str] = None
    soil_type: Optional[str] = None
    season: Optional[str] = None
    state: Optional[str] = None
    district: Optional[str] = None
    village: Optional[str] = None
    preferred_language: Optional[str] = None
    simple_mode: Optional[str] = None


class OtpSendRequest(RegisterRequest):
    pass


class OtpVerifyRequest(BaseModel):
    phone_number: str
    email: str
    otp: str
    otp_channel: str = "sms"


class FarmProfileRequest(BaseModel):
    user_id: int
    farm_name: Optional[str] = None
    primary_crop: Optional[str] = None
    irrigation_type: Optional[str] = None
    livestock: Optional[str] = None
    taluka: Optional[str] = None
    pin_code: Optional[str] = None
    lat: Optional[str] = None
    lng: Optional[str] = None


class ExplainRequest(BaseModel):
    text: str
    language: str = "English"


class IntelligenceRequest(BaseModel):
    user_id: Optional[int] = None
    crop_name: Optional[str] = None
    land_size: Optional[str] = None
    soil_type: Optional[str] = None
    season: Optional[str] = None
    state: Optional[str] = None
    district: Optional[str] = None
    village: Optional[str] = None
    preferred_language: Optional[str] = None
    horizon: Optional[str] = "weekly"


def merge_request_profile(db: Session, request: IntelligenceRequest) -> dict:
    user = get_user_by_id(db, request.user_id)
    profile = merge_profile(user)
    for field in ["crop_name", "land_size", "soil_type", "season", "state", "district", "village", "preferred_language"]:
        value = getattr(request, field, None)
        if value:
            profile[field] = value
    return profile


@app.post("/register")
def register_user(req: RegisterRequest):
    db = get_db()
    try:
        existing_user = db.query(User).filter(User.email == req.email).first()
        if existing_user:
            return {"message": "User already registered with this email."}
        return {"message": "Use OTP verification flow.", "requires_otp": True}
    finally:
        db.close()


@app.post("/auth/send-registration-otp")
def send_registration_otp(req: OtpSendRequest):
    db = get_db()
    try:
        existing_user = db.query(User).filter((User.email == req.email) | (User.mobile_number == req.mobile_number)).first()
        if existing_user:
            return {"message": "User already registered with this email or phone number."}

        latest_session = (
            db.query(OtpSession)
            .filter(
                OtpSession.phone_number == req.mobile_number,
                OtpSession.email == req.email,
                OtpSession.purpose == "register",
            )
            .order_by(OtpSession.created_at.desc())
            .first()
        )
        if latest_session and latest_session.created_at:
            retry_after = latest_session.created_at + timedelta(seconds=OTP_RESEND_SECONDS)
            if latest_session.status == "sent" and retry_after > now_utc():
                wait_seconds = int((retry_after - now_utc()).total_seconds())
                return {"message": f"Please wait {max(wait_seconds, 1)} seconds before requesting another OTP.", "cooldown_seconds": max(wait_seconds, 1)}

        otp_code = generate_otp()
        payload = req.model_dump()
        provider_status = send_otp_via_provider(req.mobile_number, otp_code, req.otp_channel)

        otp_session = OtpSession(
            phone_number=req.mobile_number,
            email=req.email,
            purpose="register",
            channel=req.otp_channel,
            otp_hash=hash_otp(otp_code),
            pending_payload=json.dumps(payload),
            status="sent",
            provider_reference=provider_status.get("provider_reference"),
            provider_message=provider_status.get("provider_message"),
            expires_at=now_utc() + timedelta(minutes=OTP_EXPIRY_MINUTES),
        )
        db.add(otp_session)
        db.commit()
        db.refresh(otp_session)

        response = {
            "message": f"OTP sent to {req.mobile_number} via {req.otp_channel}.",
            "otp_session_id": otp_session.id,
            "channel": req.otp_channel,
            "expires_in_seconds": OTP_EXPIRY_MINUTES * 60,
            "provider_status": provider_status.get("status"),
            "provider_message": provider_status.get("provider_message"),
        }
        if provider_status.get("debug_otp"):
            response["debug_otp"] = provider_status["debug_otp"]
        return response
    finally:
        db.close()


@app.post("/auth/verify-registration-otp")
def verify_registration_otp(req: OtpVerifyRequest):
    db = get_db()
    try:
        otp_session = (
            db.query(OtpSession)
            .filter(
                OtpSession.phone_number == req.phone_number,
                OtpSession.email == req.email,
                OtpSession.purpose == "register",
                OtpSession.channel == req.otp_channel,
            )
            .order_by(OtpSession.created_at.desc())
            .first()
        )
        if not otp_session:
            return {"message": "OTP session not found."}
        if otp_session.status == "verified":
            return {"message": "This OTP has already been used."}
        if otp_session.expires_at < now_utc():
            otp_session.status = "expired"
            db.commit()
            return {"message": "OTP expired. Please request a new OTP."}

        otp_session.attempt_count = (otp_session.attempt_count or 0) + 1
        if otp_session.otp_hash != hash_otp(req.otp):
            db.commit()
            return {"message": "Invalid OTP. Please try again."}

        pending_payload = json.loads(otp_session.pending_payload or "{}")
        existing_user = db.query(User).filter((User.email == req.email) | (User.mobile_number == req.phone_number)).first()
        if existing_user:
            return {"message": "User already registered with this email or phone number."}

        new_user = register_verified_user(db, pending_payload, req.otp_channel)
        otp_session.status = "verified"
        otp_session.verified_at = now_utc()
        db.commit()

        return {
            "message": "Registration successful!",
            "user_id": new_user.id,
            "user": new_user.name,
            "email": new_user.email,
            "mobile_number": new_user.mobile_number,
            "state": new_user.state,
            "district": new_user.district,
            "phone_verified": new_user.phone_verified,
            "role": new_user.role,
        }
    finally:
        db.close()


@app.post("/login")
def login_user(req: LoginRequest):
    if is_admin_credentials(req.email, req.password):
        return {
            "message": "Login successful!",
            "user": ADMIN_NAME,
            "user_id": 0,
            "email": ADMIN_EMAIL,
            "mobile_number": "",
            "date_of_birth": "",
            "state": "Maharashtra",
            "district": "Pune",
            "crop_name": "Tomato",
            "land_size": "",
            "soil_type": "",
            "season": "",
            "village": "",
            "preferred_language": "English",
            "simple_mode": "off",
            "phone_verified": True,
            "role": "admin",
        }

    db = get_db()
    try:
        user = db.query(User).filter(User.email == req.email).first()
        if not user or not verify_password(req.password, user.password):
            return {"message": "Invalid email or password."}

        return {
            "message": "Login successful!",
            "user": user.name,
            "user_id": user.id,
            "email": user.email,
            "mobile_number": user.mobile_number,
            "date_of_birth": user.date_of_birth,
            "state": user.state,
            "district": user.district,
            "crop_name": user.crop_name,
            "land_size": user.land_size,
            "soil_type": user.soil_type,
            "season": user.season,
            "village": user.village,
            "preferred_language": user.preferred_language,
            "simple_mode": user.simple_mode,
            "phone_verified": user.phone_verified,
            "role": user.role,
        }
    finally:
        db.close()


@app.get("/admin/analytics")
def get_admin_analytics(user_email: str = Query(...), timeframe: str = Query("all")):
    if not is_admin_email(user_email):
        raise HTTPException(status_code=403, detail="Admin access required")

    db = get_db()
    try:
        return build_admin_analytics(db, timeframe)
    finally:
        db.close()


@app.get("/profile/{user_id}")
def get_profile(user_id: int):
    db = get_db()
    try:
        user = get_user_by_id(db, user_id)
        if not user:
            return {"message": "User not found"}

        memory_rows = (
            db.query(QueryMemory)
            .filter(QueryMemory.user_id == user_id)
            .order_by(QueryMemory.timestamp.desc())
            .limit(10)
            .all()
        )

        return {
            "profile": merge_profile(user),
            "farm_profile": serialize_farm_profile(db.query(FarmProfile).filter(FarmProfile.user_id == user_id).first()),
            "memory": [
                {
                    "question": row.question,
                    "answer": row.answer,
                    "language": row.language,
                    "context_tag": row.context_tag,
                    "timestamp": str(row.timestamp),
                }
                for row in memory_rows
            ],
        }
    finally:
        db.close()


@app.post("/profile/preferences")
def update_profile_preferences(req: ProfileUpdateRequest):
    db = get_db()
    try:
        user = get_user_by_id(db, req.user_id)
        if not user:
            return {"message": "User not found"}
        update_user_profile(user, req)
        ensure_seed_operating_data(db, user)
        db.commit()
        return {"message": "Profile preferences updated", "profile": merge_profile(user)}
    finally:
        db.close()


@app.get("/farm-profile/{user_id}")
def get_farm_profile(user_id: int):
    db = get_db()
    try:
        user = get_user_by_id(db, user_id)
        if not user:
            return {"message": "User not found"}
        profile = get_or_create_farm_profile(db, user_id)
        return {"farm_profile": serialize_farm_profile(profile)}
    finally:
        db.close()


@app.post("/farm-profile")
def save_farm_profile(req: FarmProfileRequest):
    db = get_db()
    try:
        user = get_user_by_id(db, req.user_id)
        if not user:
            return {"message": "User not found"}
        profile = get_or_create_farm_profile(db, req.user_id)
        for field in ["farm_name", "primary_crop", "irrigation_type", "livestock", "taluka", "pin_code", "lat", "lng"]:
            value = getattr(req, field, None)
            if value is not None:
                setattr(profile, field, value)
        if req.primary_crop:
            user.crop_name = req.primary_crop
        db.commit()
        ensure_seed_operating_data(db, user)
        return {"message": "Farm profile saved", "farm_profile": serialize_farm_profile(profile)}
    finally:
        db.close()


@app.get("/dashboard-overview")
def dashboard_overview(user_id: Optional[int] = Query(default=None)):
    db = get_db()
    try:
        user = get_user_by_id(db, user_id)
        if user:
            ensure_seed_operating_data(db, user)
        memory_rows = []
        if user_id:
            memory_rows = (
                db.query(QueryMemory)
                .filter(QueryMemory.user_id == user_id)
                .order_by(QueryMemory.timestamp.desc())
                .limit(10)
                .all()
            )
        payload = build_dashboard_payload(merge_profile(user), memory_rows)

        state = getattr(user, "state", None) or "Maharashtra"
        district = getattr(user, "district", None) or "Pune"
        weather_row = (
            db.query(WeatherSnapshot)
            .filter(WeatherSnapshot.state == state, WeatherSnapshot.district == district)
            .order_by(WeatherSnapshot.captured_at.desc())
            .first()
        )
        mandi_rows = (
            db.query(MandiPrice)
            .filter(MandiPrice.state == state, MandiPrice.district == district)
            .order_by(MandiPrice.captured_at.desc())
            .limit(6)
            .all()
        )
        alert_rows = (
            db.query(AlertRecord)
            .filter((AlertRecord.user_id == user_id) | ((AlertRecord.user_id.is_(None)) & (AlertRecord.district == district)))
            .order_by(AlertRecord.created_at.desc())
            .limit(6)
            .all()
        )
        farm_profile = db.query(FarmProfile).filter(FarmProfile.user_id == user_id).first() if user_id else None

        if weather_row:
            payload["weather"] = {
                "temp": weather_row.temperature,
                "condition": weather_row.condition,
                "advice": weather_row.advisory or payload["weather"]["advice"],
                "humidity": f"Humidity {weather_row.humidity or '65%'}",
                "wind": f"Wind {weather_row.wind or '10 km/h'}",
                "rain_probability": weather_row.rain_probability or "20%",
            }

        if mandi_rows:
            payload["markets"] = [
                {
                    "crop": row.crop,
                    "price": f"Rs {row.price}",
                    "trend": row.trend or "Stable market movement",
                    "mandi_name": row.mandi_name,
                }
                for row in mandi_rows
            ]

        payload["live_alerts"] = [
            {
                "severity": row.severity,
                "title": row.title,
                "body": row.body,
                "category": row.category,
            }
            for row in alert_rows
        ]
        payload["farm_profile"] = serialize_farm_profile(farm_profile)
        payload["loan_insurance"] = loan_insurance_assistant(merge_profile(user))
        payload["platform_modules"] = {
            "phase1": [
                {"id": "otp-auth", "label": "OTP onboarding", "status": "live"},
                {"id": "farm-profile", "label": "Farm profile", "status": "live"},
                {"id": "live-weather", "label": "District weather board", "status": "live"},
                {"id": "mandi-feed", "label": "Mandi price board", "status": "live"},
            ],
            "phase2": PHASE_TWO_MODULES,
            "phase3": PHASE_THREE_MODULES,
        }
        return payload
    finally:
        db.close()


@app.post("/ai/loan-insurance-assistant")
def ai_loan_insurance_assistant(req: IntelligenceRequest):
    db = get_db()
    try:
        profile = merge_request_profile(db, req)
        return loan_insurance_assistant(profile)
    finally:
        db.close()


@app.get("/platform/modules")
def get_platform_modules():
    return {
        "phase1": [
            {"id": "otp-auth", "label": "OTP onboarding", "status": "live"},
            {"id": "farm-profile", "label": "Farm profile", "status": "live"},
            {"id": "live-weather", "label": "District weather board", "status": "live"},
            {"id": "mandi-feed", "label": "Mandi price board", "status": "live"},
        ],
        "phase2": PHASE_TWO_MODULES,
        "phase3": PHASE_THREE_MODULES,
    }


@app.post("/ask")
def ask_question(req: QuestionRequest):
    db = get_db()
    try:
        user = get_user_by_id(db, req.user_id)
        profile = merge_profile(user)

        enriched_question = req.question
        if user:
            enriched_question = f"{req.question} Crop: {profile.get('crop_name')}. District: {profile.get('district')}."

        result = retriever.answer(enriched_question)
        answer = result["answer"]

        if req.explain_simply or (user and (user.simple_mode or "").lower() == "on"):
            answer = simplify_text(answer)

        translated_answer = translate_text(answer, req.language)
        save_memory(db, req.user_id, req.question, translated_answer, req.language, "assistant")

        return {
            "answer": translated_answer,
            "confidence": result["confidence"],
            "memory_hint": f"Personalized for {profile.get('crop_name')} in {profile.get('district')}",
        }
    finally:
        db.close()


@app.post("/ai/explain-simply")
def explain_simply(req: ExplainRequest):
    return {"answer": translate_text(simplify_text(req.text), req.language)}


@app.post("/ai/daily-briefing")
def ai_daily_briefing(req: IntelligenceRequest):
    db = get_db()
    try:
        profile = merge_request_profile(db, req)
        return daily_briefing(profile)
    finally:
        db.close()


@app.post("/ai/farm-planner")
def ai_farm_planner(req: IntelligenceRequest):
    db = get_db()
    try:
        profile = merge_request_profile(db, req)
        return generate_farm_plan(profile, req.horizon or "weekly")
    finally:
        db.close()


@app.post("/ai/scheme-eligibility")
def ai_scheme_eligibility(req: IntelligenceRequest):
    db = get_db()
    try:
        profile = merge_request_profile(db, req)
        return {"matches": scheme_eligibility(profile)}
    finally:
        db.close()


@app.post("/ai/weather-alerts")
def ai_weather_alerts(req: IntelligenceRequest):
    db = get_db()
    try:
        profile = merge_request_profile(db, req)
        return {"alerts": weather_alerts(profile)}
    finally:
        db.close()


@app.post("/ai/market-prediction")
def ai_market_prediction(req: IntelligenceRequest):
    db = get_db()
    try:
        profile = merge_request_profile(db, req)
        return market_prediction(profile)
    finally:
        db.close()


@app.post("/ai/pest-risk")
def ai_pest_risk(req: IntelligenceRequest):
    db = get_db()
    try:
        profile = merge_request_profile(db, req)
        return pest_outbreak_risk(profile)
    finally:
        db.close()


@app.post("/ai/map-context")
def ai_map_context(req: IntelligenceRequest):
    db = get_db()
    try:
        profile = merge_request_profile(db, req)
        return map_context(profile)
    finally:
        db.close()


@app.get("/ai/chat-memory/{user_id}")
def ai_chat_memory(user_id: int):
    db = get_db()
    try:
        rows = (
            db.query(QueryMemory)
            .filter(QueryMemory.user_id == user_id)
            .order_by(QueryMemory.timestamp.desc())
            .limit(20)
            .all()
        )
        return {
            "items": [
                {
                    "question": row.question,
                    "answer": row.answer,
                    "language": row.language,
                    "context_tag": row.context_tag,
                    "timestamp": str(row.timestamp),
                }
                for row in rows
            ]
        }
    finally:
        db.close()


@app.get("/questions/feed")
def get_question_feed(limit: int = 20):
    db = get_db()
    try:
        rows = (
            db.query(QueryMemory, User.name)
            .outerjoin(User, User.id == QueryMemory.user_id)
            .order_by(QueryMemory.timestamp.desc())
            .limit(limit)
            .all()
        )
        return {
            "items": [
                {
                    "question": row.QueryMemory.question,
                    "answer": row.QueryMemory.answer,
                    "language": row.QueryMemory.language,
                    "timestamp": str(row.QueryMemory.timestamp),
                    "user_id": row.QueryMemory.user_id,
                    "user_name": row.name or "Farmer",
                }
                for row in rows
            ]
        }
    finally:
        db.close()


@app.post("/community/create-post")
def create_post(post: PostCreate):
    db = get_db()
    try:
        new_post = Post(content=post.content, user_id=post.user_id)
        db.add(new_post)
        db.commit()
        db.refresh(new_post)
        return {
            "message": "Post created successfully",
            "post": {
                "id": new_post.id,
                "content": new_post.content,
                "timestamp": new_post.timestamp,
                "user_id": new_post.user_id,
                "likes": new_post.likes,
                "dislikes": new_post.dislikes,
                "reactions": json.loads(new_post.reactions or "{}"),
            },
        }
    finally:
        db.close()


@app.get("/community/posts")
def get_posts(limit: int = 6, offset: int = 0, search: str = ""):
    db = get_db()
    try:
        query = db.query(Post)
        if search:
            query = query.filter(Post.content.contains(search))
        posts = query.order_by(Post.timestamp.desc()).offset(offset).limit(limit).all()

        result = []
        for post in posts:
            user = db.query(User).filter(User.id == post.user_id).first()
            try:
                reactions = json.loads(post.reactions or "{}")
            except Exception:
                reactions = {}
            result.append(
                {
                    "id": post.id,
                    "content": post.content,
                    "user_id": post.user_id,
                    "user_name": user.name if user else "Farmer",
                    "timestamp": post.timestamp,
                    "likes": post.likes or 0,
                    "dislikes": post.dislikes or 0,
                    "reactions": reactions,
                }
            )
        return result
    finally:
        db.close()


@app.get("/community/insights")
def get_community_insights():
    db = get_db()
    try:
        posts = db.query(Post).order_by(Post.timestamp.desc()).limit(25).all()
        return community_insights(posts)
    finally:
        db.close()


@app.post("/community/like/{post_id}")
def like_post(post_id: int):
    db = get_db()
    try:
        post = db.query(Post).filter(Post.id == post_id).first()
        if post:
            post.likes = (post.likes or 0) + 1
            db.commit()
            return {"message": "liked", "likes": post.likes}
        return {"message": "Post not found", "likes": 0}
    finally:
        db.close()


@app.post("/community/dislike/{post_id}")
def dislike_post(post_id: int):
    db = get_db()
    try:
        post = db.query(Post).filter(Post.id == post_id).first()
        if post:
            post.dislikes = (post.dislikes or 0) + 1
            db.commit()
            return {"message": "disliked", "dislikes": post.dislikes}
        return {"message": "Post not found", "dislikes": 0}
    finally:
        db.close()


@app.post("/community/react")
def react_to_post(req: ReactionRequest):
    db = get_db()
    try:
        post = db.query(Post).filter(Post.id == req.post_id).first()
        if not post:
            return {"message": "Post not found", "reactions": {}}

        try:
            reactions = json.loads(post.reactions or "{}")
        except Exception:
            reactions = {}

        reactions[req.emoji] = reactions.get(req.emoji, 0) + 1
        post.reactions = json.dumps(reactions)
        db.commit()
        return {"message": "reaction added", "reactions": reactions}
    finally:
        db.close()


@app.put("/community/post")
def edit_post(req: PostUpdate):
    db = get_db()
    try:
        post = db.query(Post).filter(Post.id == req.post_id).first()
        if not post:
            return {"message": "Post not found"}
        if post.user_id != req.user_id:
            return {"message": "Not authorized to edit this post"}

        post.content = req.content
        db.commit()
        return {"message": "Post updated"}
    finally:
        db.close()


@app.delete("/community/post")
def delete_post(req: PostDelete):
    db = get_db()
    try:
        post = db.query(Post).filter(Post.id == req.post_id).first()
        if not post:
            return {"message": "Post not found"}
        if post.user_id != req.user_id:
            return {"message": "Not authorized to delete"}

        db.delete(post)
        db.commit()
        return {"message": "Post deleted"}
    finally:
        db.close()


@app.post("/community/comment")
def add_comment(comment: CommentCreate):
    db = get_db()
    try:
        user = db.query(User).filter(User.id == comment.user_id).first()
        comments_db.setdefault(comment.post_id, [])
        comments_db[comment.post_id].append(
            {
                "text": comment.text,
                "user_id": comment.user_id,
                "user_name": user.name if user else "Guest",
            }
        )
        return {"message": "comment added"}
    finally:
        db.close()


@app.get("/community/comments/{post_id}")
def get_comments(post_id: int):
    return comments_db.get(post_id, [])


@app.post("/upload-image/")
async def upload_image(file: UploadFile = File(...)):
    contents = await file.read()
    image = Image.open(io.BytesIO(contents))

    extracted_text = ""
    if pytesseract:
        try:
            extracted_text = pytesseract.image_to_string(image).strip()
        except Exception:
            extracted_text = ""

    lookup_text = extracted_text or "leaf record image"
    result = retriever.answer(lookup_text)

    return {
        "extracted_text": extracted_text,
        "llm_response": result["answer"],
        "confidence": result["confidence"],
    }


@app.post("/ai/crop-doctor")
async def ai_crop_doctor(file: UploadFile = File(...)):
    contents = await file.read()
    diagnosis = analyze_leaf_image(contents)
    return diagnosis


@app.post("/ai/document-insights")
async def ai_document_insights(file: UploadFile = File(...)):
    contents = await file.read()
    extracted_text = ""

    if file.content_type and file.content_type.startswith("image/"):
        try:
            image = Image.open(io.BytesIO(contents))
            if pytesseract:
                extracted_text = pytesseract.image_to_string(image).strip()
        except Exception:
            extracted_text = ""
    else:
        try:
            extracted_text = contents.decode("utf-8", errors="ignore")
        except Exception:
            extracted_text = ""

    analysis = analyze_document_text(extracted_text)
    analysis["extracted_text"] = extracted_text[:1200]
    return analysis


@app.get("/", include_in_schema=False)
def serve_login_page():
    return FileResponse(FRONTEND_DIR / "login.html")


app.mount("/", StaticFiles(directory=FRONTEND_DIR, html=True), name="frontend")
