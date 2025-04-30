from flask import Flask, request, jsonify
from flask_cors import CORS
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from googleapiclient.discovery import build
import os
import pickle
from datetime import datetime
from dotenv import load_dotenv
from sqlalchemy.orm import sessionmaker
from models import Base, Company, Email, engine
from email_utils import create_message, send_message, check_for_replies, SCOPES

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Create database session
Session = sessionmaker(bind=engine)
session = Session()

def get_gmail_service():
    """Gets the Gmail service with proper authentication."""
    creds = None
    if os.path.exists('token.pickle'):
        with open('token.pickle', 'rb') as token:
            creds = pickle.load(token)
    
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                'credentials.json', SCOPES)
            creds = flow.run_local_server(port=0)
        with open('token.pickle', 'wb') as token:
            pickle.dump(creds, token)

    return build('gmail', 'v1', credentials=creds)

@app.route('/api/companies', methods=['POST'])
def add_company():
    """Add a new company to track."""
    data = request.json
    try:
        company = Company(
            name=data['name'],
            description=data['description'],
            website=data.get('website', '')
        )
        session.add(company)
        session.commit()
        return jsonify({"message": "Company added successfully", "id": company.id})
    except Exception as e:
        session.rollback()
        return jsonify({"error": str(e)}), 500

@app.route('/api/companies', methods=['GET'])
def get_companies():
    """Get all companies."""
    try:
        companies = session.query(Company).all()
        return jsonify([{
            "id": c.id,
            "name": c.name,
            "description": c.description,
            "website": c.website
        } for c in companies])
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/emails', methods=['POST'])
def send_email():
    """Send a cold email to a company."""
    data = request.json
    try:
        company = session.query(Company).get(data['company_id'])
        if not company:
            return jsonify({"error": "Company not found"}), 404

        service = get_gmail_service()
        message = create_message(
            sender='me',
            to=data['to'],
            subject=data['subject'],
            message_text=data['content']
        )
        
        sent_message = send_message(service, 'me', message)
        
        if sent_message:
            email = Email(
                company_id=company.id,
                subject=data['subject'],
                content=data['content'],
                thread_id=sent_message['threadId']
            )
            session.add(email)
            session.commit()
            return jsonify({
                "message": "Email sent successfully",
                "id": email.id,
                "thread_id": email.thread_id
            })
        else:
            return jsonify({"error": "Failed to send email"}), 500
    except Exception as e:
        session.rollback()
        return jsonify({"error": str(e)}), 500

@app.route('/api/emails/track', methods=['GET'])
def track_emails():
    """Track responses to sent emails."""
    try:
        service = get_gmail_service()
        emails = session.query(Email).all()
        
        tracked_emails = []
        for email in emails:
            has_reply, reply_content = check_for_replies(service, 'me', email.thread_id)
            
            if has_reply and not email.has_reply:
                email.has_reply = True
                email.reply_received_at = datetime.utcnow()
                session.commit()
            
            tracked_emails.append({
                "id": email.id,
                "company_name": email.company.name,
                "subject": email.subject,
                "sent_at": email.sent_at.isoformat(),
                "has_reply": email.has_reply,
                "reply_received_at": email.reply_received_at.isoformat() if email.reply_received_at else None
            })
        
        return jsonify({"emails": tracked_emails})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/stats', methods=['GET'])
def get_stats():
    """Get application statistics."""
    try:
        total_companies = session.query(Company).count()
        total_emails = session.query(Email).count()
        replied_emails = session.query(Email).filter(Email.has_reply == True).count()
        
        return jsonify({
            "totalCompanies": total_companies,
            "totalEmails": total_emails,
            "repliedEmails": replied_emails
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True) 