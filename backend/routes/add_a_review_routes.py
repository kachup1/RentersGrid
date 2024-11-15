import uuid
from flask import Blueprint, request, jsonify
from models.database import ratings_collection, landlords_collection, properties_collection
from datetime import datetime

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
        
        # Generate a unique ratingId and limit its size by taking a portion
        ratingId = int(str(uuid.uuid4().int)[:12])  # Limit to the first 12 digits

        new_review = {
            "ratingId": ratingId,  # Use the generated ratingId here
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
            "userId": data.get("userId"),
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
def update_review(rating_id):
    try:
        data = request.get_json()
        update_data = {
            "score": data.get("score", 0),
            "comment": data.get("comment", ""),
            "maintenance": data.get("maintenance", "N/A"),
            "pets": data.get("pets", "N/A"),
            "safety": data.get("safety", "N/A"),
            "raisemoney": data.get("raisemoney", "N/A"),
            "reachable": data.get("reachable", "N/A"),
            "clearcontract": data.get("clearcontract", "N/A"),
            "recommend": data.get("recommend", "N/A"),
            "propertyId": data.get("propertyId"),
        }
        result = ratings_collection.update_one({"ratingId": int(rating_id)}, {"$set": update_data})
        
        if result.modified_count == 1:
            return jsonify({"message": "Review updated successfully"}), 200
        else:
            return jsonify({"error": "Review not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

