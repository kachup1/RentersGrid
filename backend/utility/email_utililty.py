from models.database import users_collection
import re
import requests
import os

MAILGUN_API_KEY = os.getenv("MAILGUN_API_KEY")
MAILGUN_DOMAIN = os.getenv("MAILGUN_DOMAIN")
FROM_EMAIL = os.getenv("FROM_EMAIL", "noreply@yourdomain.com")

def get_next_user_id():
    total_users = users_collection.count_documents({})
    if total_users > 0:
        last_user = users_collection.find().sort("userId", -1).limit(1)
        return last_user[0]["userId"] + 1
    return 1

def is_valid_email(email):
    regex = r'^[^\s@]+@[^\s@]+\.[^\s@]+$'
    return re.match(regex, email)

def send_email(to_email, subject, text):
    if not MAILGUN_API_KEY or not MAILGUN_DOMAIN:
        raise EnvironmentError("Mailgun API key and domain must be set in environment variables.")
    
    response = requests.post(
        f"https://api.mailgun.net/v3/{MAILGUN_DOMAIN}/messages",
        auth=("api", MAILGUN_API_KEY),
        data={
            "from": FROM_EMAIL,
            "to": to_email,
            "subject": subject,
            "text": text
        }
    )
    return response