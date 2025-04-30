# Email Tracker for Internship Applications

A web application to help track cold emails sent for internship applications. This tool allows you to:
- Store company information
- Compose and send cold emails
- Track email responses
- Monitor your internship application progress

## Features
- Company information management
- Email composition and sending
- Email tracking and response monitoring
- User-friendly dashboard
- Response analytics

## Setup Instructions

1. Clone the repository
2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Set up Google OAuth credentials:
   - Go to Google Cloud Console
   - Create a new project
   - Enable Gmail API
   - Create OAuth 2.0 credentials
   - Download the credentials and save as `credentials.json`

4. Create a `.env` file with the following variables:
   ```
   FLASK_APP=app.py
   FLASK_ENV=development
   SECRET_KEY=your_secret_key
   ```

5. Run the application:
   ```bash
   flask run
   ```

## Project Structure
- `backend/` - Flask application
- `frontend/` - React application
- `database/` - Database models and migrations
- `utils/` - Utility functions and helpers

## Technologies Used
- Backend: Python Flask
- Frontend: React
- Database: SQLite
- Email: Gmail API
- Authentication: Google OAuth 