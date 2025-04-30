from datetime import datetime
from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime, Boolean, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, sessionmaker

Base = declarative_base()

class Company(Base):
    __tablename__ = 'companies'
    
    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    description = Column(Text)
    website = Column(String(200))
    created_at = Column(DateTime, default=datetime.utcnow)
    emails = relationship("Email", back_populates="company")

class Email(Base):
    __tablename__ = 'emails'
    
    id = Column(Integer, primary_key=True)
    company_id = Column(Integer, ForeignKey('companies.id'))
    subject = Column(String(200), nullable=False)
    content = Column(Text, nullable=False)
    sent_at = Column(DateTime, default=datetime.utcnow)
    has_reply = Column(Boolean, default=False)
    reply_received_at = Column(DateTime)
    thread_id = Column(String(100))  # Gmail thread ID for tracking
    company = relationship("Company", back_populates="emails")

# Create database engine
engine = create_engine('sqlite:///email_tracker.db')
Base.metadata.create_all(engine) 