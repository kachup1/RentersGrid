from flask import Blueprint, request, jsonify, url_for
import os
import requests
from itsdangerous import URLSafeTimedSerializer
from flask_bcrypt import Bcrypt
from datetime import datetime, timedelta
from models.database import users_collection
import hashlib

# Set up Flask Blueprint
rp_routes = Blueprint('rp_routes', __name__)
bcrypt = Bcrypt()

# Environment variables
BREVO_API_KEY = os.getenv("BREVO_API_KEY")
FROM_EMAIL = os.getenv("FROM_EMAIL", "support@rentergrid.com")
serializer = URLSafeTimedSerializer("your_secret_key")  # Use a strong secret key here

# Send password reset email function
def send_password_reset_email(to_email, reset_link):
    url = "https://api.brevo.com/v3/smtp/email"
    headers = {
        "api-key": BREVO_API_KEY,
        "Content-Type": "application/json",
    }
    payload = {
        "sender": {"email": FROM_EMAIL, "name": "RentersGrid"},
        "to": [{"email": to_email}],
        "subject": "Password Reset Request",
        "htmlContent": f"""
            <div style="font-family: Arial, sans-serif; color: #333;">
                <p>Hello,</p>
                <p>Click <a href="{reset_link}" style="color: #1a73e8;">here</a> to reset your password.</p>
                <p>If you did not request a password reset, please ignore this email.</p>
                <p>Thank you,<br>RentersGrid Team</p>
            </div>
        """,
    }
    response = requests.post(url, json=payload, headers=headers)
    return response.status_code == 201

# Helper function to hash passwords
def hash_password(password):
    return bcrypt.generate_password_hash(password).decode('utf-8')

# Route to request password reset and send email
@rp_routes.route('/api/password-reset', methods=['POST'])
def password_reset():
    data = request.json
    email = data.get('email')

    user = users_collection.find_one({"email": email})
    if not user:
        return jsonify({"message": "If the email exists, a reset link will be sent."}), 200

    # Generate a token and hash it
    token = serializer.dumps(email, salt="password-reset-salt")
    hashed_token = hashlib.sha256(token.encode()).hexdigest()
    expiry_time = datetime.utcnow() + timedelta(hours=1)  # Token valid for 1 hour

    # Store the hashed token and expiration time in the user's document
    users_collection.update_one(
        {"email": email},
        {"$set": {
            "reset_token": hashed_token,
            "reset_token_expiry": expiry_time,
            "reset_token_used": False
        }}
    )

    reset_link = f"http://localhost:3000/reset-password/{token}"  # Original token sent in the reset link

    # Send the email
    if send_password_reset_email(email, reset_link):
        return jsonify({"message": "If the email exists, a reset link will be sent."}), 200
    else:
        return jsonify({"error": "Failed to send reset email."}), 500

# Route to verify the reset token
@rp_routes.route('/api/verify-token/<token>', methods=['GET'])
def verify_token(token):
    try:
        # Decode the token to get the email
        email = serializer.loads(token, salt="password-reset-salt")
        user = users_collection.find_one({"email": email})

        if not user:
            return jsonify({"error": "Invalid token."}), 400

        # Hash the provided token and compare it with the stored hashed token
        hashed_token = hashlib.sha256(token.encode()).hexdigest()
        if hashed_token != user["reset_token"]:
            return jsonify({"error": "Invalid token."}), 400

        # Check if the token has expired
        if datetime.utcnow() > user.get("reset_token_expiry", datetime.utcnow()):
            return jsonify({"error": "This token has expired."}), 400

        # Check if the token has already been used
        if user.get("reset_token_used", False):
            return jsonify({"error": "This token has already been used."}), 400

        return jsonify({"email": email}), 200
    except Exception as e:
        return jsonify({"error": "Invalid or expired token."}), 400

# Route to reset the user's password using a valid reset token
@rp_routes.route('/api/reset-password/<token>', methods=['POST'])
def reset_password(token):
    data = request.json
    new_password = data.get('password')

    try:
        # Decode the token to get the email
        email = serializer.loads(token, salt="password-reset-salt")
        user = users_collection.find_one({"email": email})

        if not user:
            return jsonify({"error": "Invalid token."}), 400

        # Hash the provided token and compare it with the stored hashed token
        hashed_token = hashlib.sha256(token.encode()).hexdigest()
        if hashed_token != user["reset_token"]:
            return jsonify({"error": "Invalid token."}), 400

        # Check if the token has expired
        if datetime.utcnow() > user.get("reset_token_expiry", datetime.utcnow()):
            return jsonify({"error": "This token has expired."}), 400

        # Check if the token has already been used
        if user.get("reset_token_used", False):
            return jsonify({"error": "This token has already been used."}), 400

        # Update the user's password
        hashed_password = hash_password(new_password)
        users_collection.update_one(
            {"email": email},
            {"$set": {
                "password": hashed_password,
                "reset_token_used": True  # Mark token as used
            }}
        )

        return jsonify({"message": "Password has been reset successfully."}), 200
    except Exception as e:
        return jsonify({"error": "Invalid or expired token."}), 400

