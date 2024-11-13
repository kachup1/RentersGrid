from flask import Blueprint, request, jsonify
from models.database import ratings_collection, landlords_collection, properties_collection

vote_blueprint = Blueprint('vote', __name__)

@vote_blueprint.route("/api/review/<int:ratingId>/vote", methods=["POST"])
def vote_review(ratingId):
    print(f"Received ratingId: {ratingId}")  # Debugging print to confirm ID received
    data = request.json
    vote_type = data.get("type")
    increment = 1 if data.get("action") == "add" else -1

    # Select field to update
    update_field = "helpful" if vote_type == "helpful" else "notHelpful"

    # Debug query attempt to ensure MongoDB document exists
    document = ratings_collection.find_one({"ratingId": ratingId})
    print("Document found in MongoDB:", document)  # Should print the document if found

    if document:
        # Perform the update operation if document exists
        result = ratings_collection.update_one(
            {"ratingId": ratingId},
            {"$inc": {update_field: increment}}
        )
        print("Update result:", result.modified_count)

        # Return updated counts if update is successful
        if result.modified_count == 1:
            updated_review = ratings_collection.find_one({"ratingId": ratingId})
            return jsonify({
                "success": True,
                "new_helpful_count": updated_review.get("helpful", 0),
                "new_notHelpful_count": updated_review.get("notHelpful", 0)
            })
    print("Review not found")  # Debugging if the document is not found
    return jsonify({"error": "Review not found"}), 404

@vote_blueprint.route("/api/review/<int:ratingId>/test", methods=["GET"])
def test_find_review(ratingId):
    document = ratings_collection.find_one({"ratingId": ratingId})
    if document:
        return jsonify(document), 200
    return jsonify({"error": "Review not found"}), 404
