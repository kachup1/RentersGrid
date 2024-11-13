from flask import Blueprint, request, jsonify
from models.database import ratings_collection, landlords_collection

ratings_blueprint = Blueprint('ratings', __name__)

@ratings_blueprint.route('/api/get_ratings', methods=['GET'])
def get_ratings():
    user_id = request.args.get('userId')
    if not user_id:
        return jsonify({"error": "User ID is required"}), 400

    try:
        # Fetch ratings for the given userId
        ratings = ratings_collection.find({"userId": int(user_id)})
        ratings_list = []

        # Loop through each rating and fetch landlord details
        for rating in ratings:
            landlord = landlords_collection.find_one({"landlordId": rating["landlordId"]})
            ratings_list.append({
                "_id": str(rating["_id"]),  # Include the ObjectId in the response
                "name": landlord["name"] if landlord else "Unknown",
                "comment": rating.get("comment", ""),
                "timestamp": rating.get("timestamp", ""),
                "score": rating.get("score", 0)
            })

        return jsonify(ratings_list), 200
    except Exception as e:
        print(f"Error fetching ratings: {e}")
        return jsonify({"error": "Failed to fetch ratings"}), 500