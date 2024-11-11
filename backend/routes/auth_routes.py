from flask import Blueprint, request, jsonify, current_app
from flask_mail import Message
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token
from models.database import users_collection
from utility.utililty import get_next_user_id
import re

auth_blueprint = Blueprint('auth', __name__)
bcrypt = Bcrypt()

@auth_blueprint.route('/SignUp', methods=['POST'])
def signup():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"error": "Email and Password are required"}), 400

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

    existing_user = users_collection.find_one({"email": email})
    if existing_user:
        return jsonify({"error": "Email already exists"}), 400

    try:
        user_id = get_next_user_id()
        users_collection.insert_one({
            'email': email,
            'password': hashed_password,
            'userId': user_id
        })
        return jsonify({"message": "User created successfully!"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@auth_blueprint.route('/Login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    user = users_collection.find_one({"email": email})

    if user and bcrypt.check_password_hash(user['password'], password):
        access_token = create_access_token(identity={"userId": str(user['_id'])})
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
    if len(new_password) < 6 or not re.search(r'\d', new_password):
        return jsonify({"error": "Password must be 6+ characters and include a number."}), 400

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

# Email sending route added to auth blueprint
@auth_blueprint.route('/SendEmail', methods=['POST'])
def send_email():
    data = request.get_json()
    recipient_email = data.get('email')

    if recipient_email:
        msg = Message(
            'do-not-reply',
            sender=current_app.config['MAIL_DEFAULT_SENDER'],  # Use default sender from config
            recipients=[recipient_email],
            body='Here is your link: http://localhost:3000/resetpasswordupdate'
        )
        mail = current_app.extensions.get('mail')  # Get the mail instance
        mail.send(msg)
        return jsonify({'message': 'Email Sent!'}), 200
    return jsonify({'message': 'Email not provided!'}), 400
