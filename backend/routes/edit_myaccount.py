from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.database import users_collection
from flask_bcrypt import Bcrypt
from dotenv import load_dotenv
import os

# Initialize bcrypt for password hashing
bcrypt = Bcrypt()

# Load environment variables
load_dotenv()

edit_account_bp = Blueprint('edit_account', __name__)

@edit_account_bp.route('/api/get_user', methods=['GET'])
@jwt_required()
def get_user():
    """
    Fetch user information for the logged-in user.
    """
    try:
        user_identity = get_jwt_identity()
        user_id = user_identity.get('userId') if isinstance(user_identity, dict) else user_identity

        if not user_id:
            return jsonify({"error": "User ID not found in token"}), 400

        # Fetch the user from the database (excluding password)
        user = users_collection.find_one({'userId': int(user_id)}, {'_id': 0, 'email': 1})
        if not user:
            return jsonify({"error": "User not found"}), 404

        return jsonify(user), 200

    except Exception as e:
        print(f"Error fetching user data: {e}")
        return jsonify({"error": "Failed to fetch user data"}), 500

@edit_account_bp.route('/api/edit_user', methods=['POST'])
@jwt_required()
def edit_user():
    data = request.json
    new_email = data.get('email')
    current_password = data.get('currentPassword')
    new_password = data.get('newPassword')

    print("Received data:", data)  # Debugging line

    # Get user ID from token
    user_identity = get_jwt_identity()
    user_id = user_identity.get('userId') if isinstance(user_identity, dict) else user_identity

    if not new_email or not current_password:
        print("Missing required fields")
        return jsonify({'error': 'Missing required fields'}), 400

    # Fetch the user from the database
    user = users_collection.find_one({'userId': int(user_id)})
    if not user:
        print("User not found")
        return jsonify({'error': 'User not found'}), 404

    print("User found in database:", user)

    # Verify the current password using bcrypt
    if not bcrypt.check_password_hash(user['password'], current_password):
        print("Incorrect current password")
        return jsonify({'error': 'Incorrect current password'}), 401

    print("Current password verified successfully")

    # Check if the new email and new password are the same as the current ones
    email_changed = new_email != user['email']
    password_changed = new_password and bcrypt.check_password_hash(user['password'], new_password) is False

    # If no changes were made, return a "no changes" response
    if not email_changed and not password_changed:
        print("No changes made")
        return jsonify({'message': 'No changes made'}), 200

    # Prepare update data if changes were detected
    update_data = {}
    if email_changed:
        update_data['email'] = new_email
    if password_changed:
        hashed_password = bcrypt.generate_password_hash(new_password).decode('utf-8')
        update_data['password'] = hashed_password

    # Perform the update only if there are changes
    if update_data:
        result = users_collection.update_one({'userId': int(user_id)}, {'$set': update_data})
        if result.modified_count > 0:
            print("User updated successfully")
            return jsonify({'message': 'User updated successfully'}), 200

    print("No changes made")
    return jsonify({'message': 'No changes made'}), 200

@edit_account_bp.route('/api/verify_password', methods=['POST'])
@jwt_required()
def verify_password():
    """
    Verify the current password for the logged-in user.
    """
    data = request.json
    current_password = data.get('currentPassword')

    # Get user ID from token
    user_identity = get_jwt_identity()
    user_id = user_identity.get('userId') if isinstance(user_identity, dict) else user_identity

    if not current_password:
        print("Missing current password")
        return jsonify({'error': 'Missing current password'}), 400

    # Fetch the user from the database
    user = users_collection.find_one({'userId': int(user_id)}, {'password': 1})
    if not user:
        print("User not found")
        return jsonify({'error': 'User not found'}), 404

    # Verify the current password using bcrypt
    if not bcrypt.check_password_hash(user['password'], current_password):
        print("Incorrect current password")
        return jsonify({'error': 'Incorrect current password'}), 401

    return jsonify({'message': 'Password verified successfully'}), 200
