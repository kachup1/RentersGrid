from flask import Blueprint, request, jsonify
from flask_bcrypt import Bcrypt
from models.database import users_collection  # Import the collection from database.py

# Create Blueprint and initialize Bcrypt
edit_account_bp = Blueprint('edit_account', __name__)
bcrypt = Bcrypt()

@edit_account_bp.route('/api/edit_user', methods=['POST'])
def edit_user():
    data = request.json
    user_id = data.get('userId')
    new_email = data.get('email')
    new_password = data.get('password')

    if not user_id or not new_email:
        return jsonify({'error': 'Missing required fields'}), 400

    # Hash the password if provided
    hashed_password = bcrypt.generate_password_hash(new_password).decode('utf-8') if new_password else None

    # Prepare update data
    update_data = {'email': new_email}
    if hashed_password:
        update_data['password'] = hashed_password

    # Update user info in MongoDB using the imported collection
    result = users_collection.update_one({'userId': int(user_id)}, {'$set': update_data})

    if result.modified_count == 0:
        return jsonify({'error': 'User not found or no changes made'}), 404

    return jsonify({'message': 'User updated successfully'}), 200


@edit_account_bp.route('/api/get_user', methods=['GET'])
def get_user():
    user_id = request.args.get('userId')
    if not user_id:
        return jsonify({'error': 'User ID is required'}), 400

    user = users_collection.find_one({'userId': int(user_id)}, {'_id': 0, 'email': 1, 'password': 1})
    if not user:
        return jsonify({'error': 'User not found'}), 404

    return jsonify(user), 200
