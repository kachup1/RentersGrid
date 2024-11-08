from flask import Blueprint, request, jsonify, url_for
import os
import requests
from itsdangerous import URLSafeTimedSerializer
from flask_bcrypt import Bcrypt  # Add bcrypt for password hashing
from models.database import users_collection  # Import your users collection
import jwt  # Ensure JWT is installed for generating tokens

# Set up Flask Blueprint
rp_routes = Blueprint('rp_routes', __name__)
bcrypt = Bcrypt()

# Environment variables
BREVO_API_KEY = os.getenv("BREVO_API_KEY")
FROM_EMAIL = os.getenv("FROM_EMAIL", "support@rentergrid.com")
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")  # Secret for hashing the JWT token
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

# Route to request password reset and send email
@rp_routes.route('/api/password-reset', methods=['POST'])
def password_reset():
    data = request.json
    email = data.get('email')
    
    # Generate a token with a unique identifier (like email)
    token = serializer.dumps(email, salt="password-reset-salt")
    reset_link = f"http://localhost:3000/reset-password/{token}"  # Link to your React reset page

    if send_password_reset_email(email, reset_link):
        return jsonify({"message": "Password reset email sent successfully"}), 200
    else:
        return jsonify({"error": "Failed to send reset email"}), 500

# Route to verify the reset token
@rp_routes.route('/api/verify-token/<token>', methods=['GET'])
def verify_token(token):
    try:
        email = serializer.loads(token, salt="password-reset-salt", max_age=3600)
        return jsonify({"email": email}), 200
    except Exception as e:
        return jsonify({"error": "Invalid or expired token"}), 400

# Helper function to hash passwords
def hash_password(password):
    return bcrypt.generate_password_hash(password).decode('utf-8')

# Route to reset the user's password using a valid reset token
@rp_routes.route('/api/reset-password/<token>', methods=['POST'])
def reset_password(token):
    data = request.json
    new_password = data.get('password')

    # Decode the token to get the email
    try:
        email = serializer.loads(token, salt="password-reset-salt", max_age=3600)
    except Exception as e:
        return jsonify({"error": "Invalid or expired token"}), 400

    # Find the user and update the password
    user = users_collection.find_one({"email": email})
    if not user:
        return jsonify({"error": "User not found"}), 404

    # Hash the new password and update the user's password in the database
    hashed_password = hash_password(new_password)
    users_collection.update_one({"email": email}, {"$set": {"password": hashed_password}})

    return jsonify({"message": "Password has been reset successfully"}), 200
