import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime
from app.db.base import Base


class User(Base):
    """
    User Model
    Supported personas from PRD section 3:
    1. planner - Block/Corridor Planner (primary user)
    2. coordinator - Department Coordinator (Engineering / S&T / Electrical)
    3. controller - Operations Controller
    4. manager - Zone/Division Manager
    """
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=True)
    role = Column(String(30), nullable=False, default="planner")  # planner, coordinator, controller, manager
    department = Column(String(50), nullable=True)  # Engineering, S&T, Electrical, Traffic, or NULL
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    def __repr__(self):
        return f"<User id={self.id} name='{self.name}' role='{self.role}'>"
