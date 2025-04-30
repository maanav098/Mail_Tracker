import base64
import os
import pickle
import logging
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# If modifying these scopes, delete the file token.pickle.
SCOPES = ['https://www.googleapis.com/auth/gmail.send',
          'https://www.googleapis.com/auth/gmail.readonly']

def create_message(sender, to, subject, message_text):
    """Create a message for an email."""
    try:
        message = MIMEMultipart()
        message['to'] = to
        message['from'] = sender
        message['subject'] = subject
        
        msg = MIMEText(message_text)
        message.attach(msg)
        
        return {'raw': base64.urlsafe_b64encode(message.as_bytes()).decode()}
    except Exception as e:
        logger.error(f"Error creating message: {str(e)}")
        raise

def send_message(service, user_id, message):
    """Send an email message."""
    try:
        message = (service.users().messages().send(userId=user_id, body=message)
                  .execute())
        logger.info(f"Message sent successfully. Message ID: {message['id']}")
        return message
    except Exception as error:
        logger.error(f"An error occurred while sending message: {str(error)}")
        return None

def check_for_replies(service, user_id, thread_id):
    """Check for replies in a specific email thread."""
    try:
        thread = service.users().threads().get(userId=user_id, id=thread_id).execute()
        messages = thread.get('messages', [])
        
        if len(messages) > 1:  # If there are replies
            latest_reply = messages[-1]
            logger.info(f"Reply found in thread {thread_id}")
            return True, latest_reply['snippet']
        return False, None
    except Exception as error:
        logger.error(f"An error occurred while checking for replies: {str(error)}")
        return False, None

def get_gmail_service():
    """Get authenticated Gmail service."""
    try:
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
    except Exception as e:
        logger.error(f"Error getting Gmail service: {str(e)}")
        raise 