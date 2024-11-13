from flask import Blueprint, request, jsonify
from pymongo import MongoClient
from bson import ObjectId
import os

# Set up MongoDB connection
client = MongoClient(os.getenv("MONGODB_URI"))  # Replace with your MongoDB connection URI if needed
db = client["RentersDB"]  # Replace with your database name
ratings_collection = db["ratings"]

# Create a blueprint
vote_blueprint = Blueprint('vote', __name__)

@vote_blueprint.route("/api/review/<review_id>/vote", methods=["POST"])
def vote_review(review_id):
    data = request.json
    vote_type = data.get("type")  # "helpful" or "notHelpful"
    increment = 1 if data.get("action") == "add" else -1  # "add" or "remove"

    if vote_type not in ["helpful", "notHelpful"]:
        return jsonify({"error": "Invalid vote type"}), 400

    update_field = "helpful" if vote_type == "helpful" else "notHelpful"

    result = ratings_collection.update_one(
        {"_id": ObjectId(review_id)},
        {"$inc": {update_field: increment}}
    )

    if result.modified_count == 1:
        updated_review = ratings_collection.find_one({"_id": ObjectId(review_id)})
        return jsonify({
            "success": True,
            "new_helpful_count": updated_review["helpful"],
            "new_notHelpful_count": updated_review["notHelpful"]
        })
    else:
        return jsonify({"error": "Review not found"}), 404
