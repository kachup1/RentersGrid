from flask import Blueprint, request, jsonify
from models.database import ratings_collection, landlords_collection
from flask_jwt_extended import jwt_required, get_jwt_identity
import traceback

ratings_blueprint = Blueprint('ratings', __name__)

@ratings_blueprint.route('/api/get_ratings', methods=['GET'])
@jwt_required()
def get_user_ratings():
    """
    Get ratings associated with the logged-in user.
    """
    try:
        current_user = get_jwt_identity()
        print(f"Decoded user from token: {current_user}")

        if not current_user or 'userId' not in current_user:
            return jsonify({"error": "User not authenticated"}), 401

        user_id = current_user['userId']
        print(f"Fetching ratings for user_id: {user_id}")

        ratings = ratings_collection.find({"userId": int(user_id)})
        ratings_list = []

        for rating in ratings:
            landlord = landlords_collection.find_one({"landlordId": rating["landlordId"]})
            ratings_list.append({
                "object_id": str(rating["_id"]),
                "rating_id": rating.get("ratingId"),
                "user_id": rating.get("userId"),
                "landlord_name": landlord["name"] if landlord else "Unknown",
                "comment": rating.get("comment", ""),
                "timestamp": rating.get("timestamp", ""),
                "score": rating.get("score", 0)
            })

        return jsonify(ratings_list), 200

    except Exception as e:
        print("Error fetching ratings:", traceback.format_exc())
        return jsonify({"error": "Failed to fetch ratings"}), 500
