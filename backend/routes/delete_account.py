from flask import Blueprint, jsonify
from models.database import users_collection
from flask_jwt_extended import jwt_required, get_jwt_identity
from bson import ObjectId
import traceback

# Define the blueprint for delete account
delete_account_blueprint = Blueprint('delete_account', __name__)

@delete_account_blueprint.route('/api/delete_account', methods=['DELETE'])
@jwt_required()
def delete_account():
    """
    Delete the account of the logged-in user.
    """
    try:
        # Extract userId from the JWT token
        current_user = get_jwt_identity()
        if not current_user or 'userId' not in current_user:
            return jsonify({"error": "User not authenticated"}), 401

        user_id = current_user['userId']

        # Find the user in the MongoDB collection
        user = users_collection.find_one({"userId": int(user_id)})
        if not user:
            return jsonify({"error": "User not found"}), 404

        # Delete the user using ObjectId
        result = users_collection.delete_one({"_id": ObjectId(user['_id'])})

        if result.deleted_count == 1:
            return jsonify({"message": "Account deleted successfully"}), 200
        else:
            return jsonify({"error": "Failed to delete account"}), 500

    except Exception as e:
        print("Error deleting account:", traceback.format_exc())
        return jsonify({"error": "An error occurred while deleting the account"}), 500
