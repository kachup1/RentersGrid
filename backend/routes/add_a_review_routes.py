import uuid
from flask import Blueprint, request, jsonify
from models.database import ratings_collection, landlords_collection, properties_collection
from datetime import datetime
from bson import ObjectId
from flask_jwt_extended import jwt_required, get_jwt_identity



add_a_review_blueprint = Blueprint('add_a_review', __name__)

@add_a_review_blueprint.route('/api/landlord/addareview', methods=['POST'])
def add_review():
    try:
        data = request.get_json()
        print("Received request:", data)  # Log the received data

        # Check if landlordId and other required fields are present and valid
        landlord_id = int(data.get("landlordId"))
        if landlord_id is None:
            return jsonify({"error": "landlordId is required"}), 400
        
      # Generate a unique ratingId if not provided
        rating_id = int(str(uuid.uuid4().int)[:12])  # Generate unique 12-digit ID

        new_review = {
            "ratingId": rating_id,  # Use the generated ratingId here
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
            "userId": data.get("userId"),  # Ensure userId is an integer
            "timestamp": datetime.utcnow(),  # Add timestamp for review submission
            "propertyId": data.get("propertyId"),
            "helpful": 0,
            "notHelpful": 0

        }

        # Insert the review into the ratings collection
        ratings_collection.insert_one(new_review)
        print("Review added to the database successfully.")
        return jsonify({"message": "Review added successfully"}), 201
    except Exception as e:
        print("Error:", e)
        return jsonify({"error": str(e)}), 500


@add_a_review_blueprint.route('/api/landlord/details/<landlord_id>', methods=['GET'])
def get_landlord_details(landlord_id):
    """Fetch landlord's name and properties with names for the Add A Review page."""
    # Fetch landlord information
    landlord = landlords_collection.find_one({"landlordId": int(landlord_id)}, {"name": 1, "propertyId": 1})
    if not landlord:
        return jsonify({"error": "Landlord not found"}), 404

    # Fetch property details based on the property IDs
    property_ids = landlord.get("propertyId", [])
    properties = list(properties_collection.find({"propertyId": {"$in": property_ids}}, {"propertyId": 1, "propertyname": 1}))

    # Structure response with landlord name and properties including both propertyId and propertyname
    landlord_data = {
        "name": landlord.get("name"),
        "properties": [{"propertyId": prop["propertyId"], "propertyname": prop["propertyname"]} for prop in properties]
    }
    
    return jsonify(landlord_data), 200

@add_a_review_blueprint.route('/api/review/<rating_id>/update', methods=['PUT'])
@jwt_required()
def update_review(rating_id):
    try:
        # Extract userId from JWT
        current_user_data = get_jwt_identity()
        current_user_id = current_user_data.get("userId")  # Get userId from the JWT
        print("Current user ID from JWT:", current_user_id)  # Debugging

        # Fetch the review
        review = ratings_collection.find_one({"ratingId": int(rating_id)})
        if not review:
            print("Review not found for ratingId:", rating_id)  # Debugging
            return jsonify({"error": "Review not found"}), 404

        print("Review user ID from database:", review.get("userId"))  # Debugging

        # Verify ownership
        if review["userId"] != current_user_id:
            print("Unauthorized access: User does not own this review")  # Debugging
            return jsonify({"error": "Unauthorized access"}), 403

        # Process update
        update_data = request.get_json()
        print("Update data received:", update_data)  # Debugging

        # Ensure all numeric fields are converted to integers
        update_data["score"] = int(update_data.get("score", review["score"]))
        update_data["propertyId"] = int(update_data.get("propertyId", review["propertyId"]))

        ratings_collection.update_one({"ratingId": int(rating_id)}, {"$set": update_data})
        print("Review successfully updated")  # Debugging
        return jsonify({"message": "Review updated successfully"}), 200
    except Exception as e:
        print("Error updating review:", e)  # Debugging
        return jsonify({"error": str(e)}), 500


    

@add_a_review_blueprint.route('/api/review/<rating_id>', methods=['GET'])
@jwt_required()
def get_review(rating_id):
    try:
        # Extract userId from JWT
        current_user_data = get_jwt_identity()
        current_user_id = current_user_data.get("userId")  # Extract userId
        print("Current user ID from JWT:", current_user_id)  # Debugging

        # Fetch the review
        review = ratings_collection.find_one({"ratingId": int(rating_id)})
        if not review:
            print("Review not found for ratingId:", rating_id)
            return jsonify({"error": "Review not found"}), 404

        print("Review user ID:", review.get("userId"))  # Debugging

        # Check if the current user owns the review
        if review["userId"] != current_user_id:
            print("Unauthorized access: Current user does not own this review")
            return jsonify({"error": "Unauthorized access"}), 403
        
        # Convert numeric fields back to integers
        review["ratingId"] = int(review["ratingId"])
        review["landlordId"] = int(review["landlordId"])
        review["propertyId"] = int(review["propertyId"])

        # Convert ObjectId to string
        review["_id"] = str(review["_id"])
        return jsonify(review), 200
    except Exception as e:
        print("Error in get_review:", e)
        return jsonify({"error": str(e)}), 500






