from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.sql import func
from backend.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    mobile_number = Column(String, nullable=True)
    date_of_birth = Column(String, nullable=True)
    state = Column(String, nullable=True)
    district = Column(String, nullable=True)
    crop_name = Column(String, nullable=True)
    land_size = Column(String, nullable=True)
    soil_type = Column(String, nullable=True)
    season = Column(String, nullable=True)
    village = Column(String, nullable=True)
    preferred_language = Column(String, nullable=True)
    simple_mode = Column(String, nullable=True)
    role = Column(String, nullable=True, default="farmer")
    phone_verified = Column(Boolean, nullable=False, default=False)
    otp_channel = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Post(Base):
    __tablename__ = "posts"

    id = Column(Integer, primary_key=True, index=True)
    content = Column(String, nullable=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    user_id = Column(Integer, ForeignKey("users.id"))
    likes = Column(Integer, default=0)
    dislikes = Column(Integer, default=0)
    reactions = Column(String, default='{}')


class QueryMemory(Base):
    __tablename__ = "query_memory"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    question = Column(String, nullable=False)
    answer = Column(String, nullable=False)
    language = Column(String, nullable=True)
    context_tag = Column(String, nullable=True)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())


class OtpSession(Base):
    __tablename__ = "otp_sessions"

    id = Column(Integer, primary_key=True, index=True)
    phone_number = Column(String, nullable=False, index=True)
    email = Column(String, nullable=True, index=True)
    purpose = Column(String, nullable=False, default="register")
    channel = Column(String, nullable=False, default="sms")
    otp_hash = Column(String, nullable=False)
    pending_payload = Column(Text, nullable=True)
    status = Column(String, nullable=False, default="sent")
    attempt_count = Column(Integer, nullable=False, default=0)
    resend_count = Column(Integer, nullable=False, default=0)
    provider_reference = Column(String, nullable=True)
    provider_message = Column(String, nullable=True)
    expires_at = Column(DateTime(timezone=True), nullable=False)
    verified_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class FarmProfile(Base):
    __tablename__ = "farm_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    farm_name = Column(String, nullable=True)
    primary_crop = Column(String, nullable=True)
    irrigation_type = Column(String, nullable=True)
    livestock = Column(String, nullable=True)
    taluka = Column(String, nullable=True)
    pin_code = Column(String, nullable=True)
    lat = Column(String, nullable=True)
    lng = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


class WeatherSnapshot(Base):
    __tablename__ = "weather_snapshots"

    id = Column(Integer, primary_key=True, index=True)
    state = Column(String, nullable=False, index=True)
    district = Column(String, nullable=False, index=True)
    condition = Column(String, nullable=False)
    temperature = Column(String, nullable=False)
    humidity = Column(String, nullable=True)
    wind = Column(String, nullable=True)
    rain_probability = Column(String, nullable=True)
    advisory = Column(Text, nullable=True)
    source = Column(String, nullable=True, default="seed")
    captured_at = Column(DateTime(timezone=True), server_default=func.now())


class MandiPrice(Base):
    __tablename__ = "mandi_prices"

    id = Column(Integer, primary_key=True, index=True)
    state = Column(String, nullable=False, index=True)
    district = Column(String, nullable=False, index=True)
    mandi_name = Column(String, nullable=False)
    crop = Column(String, nullable=False, index=True)
    variety = Column(String, nullable=True)
    price = Column(String, nullable=False)
    trend = Column(String, nullable=True)
    source = Column(String, nullable=True, default="seed")
    captured_at = Column(DateTime(timezone=True), server_default=func.now())


class AlertRecord(Base):
    __tablename__ = "alert_records"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    state = Column(String, nullable=True, index=True)
    district = Column(String, nullable=True, index=True)
    crop = Column(String, nullable=True, index=True)
    severity = Column(String, nullable=False, default="info")
    title = Column(String, nullable=False)
    body = Column(Text, nullable=False)
    category = Column(String, nullable=False, default="general")
    source = Column(String, nullable=True, default="system")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
