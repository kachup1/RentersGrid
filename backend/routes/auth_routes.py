from flask import Blueprint, request, jsonify
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token
from models.database import users_collection
from utility.utililty import get_next_user_id
import re

auth_blueprint = Blueprint('auth', __name__)
bcrypt = Bcrypt()

def validate_password(password):
    if len(password) < 6:
        return "Password must be at least 6 characters long."
    if not re.search(r'\d', password) and not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
        return "Password must include at least one number and one special character."
    if not re.search(r'\d', password):
        return "Password must include at least one number."
    if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
        return "Password must include at least one special character."
    return None  # No errors


@auth_blueprint.route('/SignUp', methods=['POST'])
def signup():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"error": "Email and Password are required"}), 400
    
    # Validate password and get specific error message
    password_error = validate_password(password)
    if password_error:
        return jsonify({"error": password_error}), 400

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

    existing_user = users_collection.find_one({"email": email})
    if existing_user:
        return jsonify({"error": "Email already exists"}), 400

    try:
        user_id = get_next_user_id()
        users_collection.insert_one({
            'email': email,
            'password': hashed_password,
            'userId': user_id,
            "reset_token": None,  # Reset token is initially None
            "reset_token_expiry": None,  # Expiry is initially None
            "reset_token_used": False,  # Token is initially unused
        })
        return jsonify({"message": "User created successfully!"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@auth_blueprint.route('/Login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    user = users_collection.find_one({"email": {"$regex": f"^{email}$", "$options": "i"}})

    if user and bcrypt.check_password_hash(user['password'], password):
        access_token = create_access_token(identity={
            "mongoId": str(user['_id']),
            "userId": user.get('userId')
            })
        return jsonify({'access_token': access_token}), 200
    else:
        return jsonify({"error": "Invalid email or password"}), 401

@auth_blueprint.route('/VerifyEmail', methods=['POST'])
def verify_email():
    data = request.json
    email = data.get('email')

    if not email:
        return jsonify({"error": "Email is required"}), 400

    user = users_collection.find_one({"email": email})

    if user:
        return jsonify({"message": "Email exists."}), 200
    else:
        return jsonify({"error": "Email not found"}), 404

@auth_blueprint.route('/ChangePassword', methods=['POST'])
def change_password():
    data = request.get_json()
    email = data.get('email')
    new_password = data.get('new_password')

    if not email or not new_password:
        return jsonify({"error": "Missing required fields"}), 422

    # Validate new password
    password_error = validate_password(new_password)
    if password_error:
        return jsonify({"error": password_error}), 400

    user = users_collection.find_one({"email": email})

    if not user:
        return jsonify({"error": "User not found"}), 404

    hashed_password = bcrypt.generate_password_hash(new_password).decode("utf-8")

    result = users_collection.update_one(
        {"email": email},
        {"$set": {"password": hashed_password}}
    )

    if result.modified_count == 0:
        return jsonify({"error": "Failed to update the password"}), 500

    return jsonify({"message": "Password changed successfully"}), 200
