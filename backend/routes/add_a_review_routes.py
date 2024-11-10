from flask import Blueprint, request, jsonify
from models.database import ratings_collection

add_a_review_blueprint = Blueprint('add_a_review', __name__)

@add_a_review_blueprint.route('/api/landlord/addareview', methods=['POST'])
def add_review():
    try:
        data = request.get_json()
        print("Received request:", data)  # Log the received data

        # Check if landlordId and other required fields are present and valid
        landlord_id = data.get("landlordId")
        if landlord_id is None:
            return jsonify({"error": "landlordId is required"}), 400

        new_review = {
            "ratingId": data.get("ratingId"),
            "landlordId": int(landlord_id),  # Convert only if it's not None
            "score": data.get("score", 0),
            "comment": data.get("comment", ""),
            "maintenance": data.get("maintenance", "N/A"),
            "pets": data.get("pets", "N/A"),
            "safety": data.get("safety", "N/A"),
            "raisemoney": data.get("raisemoney", "N/A"),
            "reachable": data.get("reachable", "N/A"),
            "clearcontract": data.get("clearcontract", "N/A"),
            "recommend": data.get("recommend", "N/A"),
            "userId": data.get("userId")
        }

        # Insert the review into the ratings collection
        ratings_collection.insert_one(new_review)
        print("Review added to the database successfully.")
        return jsonify({"message": "Review added successfully"}), 201
    except Exception as e:
        print("Error:", e)
        return jsonify({"error": str(e)}), 500
