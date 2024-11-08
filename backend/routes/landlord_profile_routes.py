from flask import Blueprint,request,jsonify
from models.database import landlord_collection
from models.database import properties_collection
from models.database import ratings_collection

landlord_profile_blueprint = Blueprint('landlord_profile', __name__)

@landlord_profile_blueprint.route('/api/landlord/<landlord_id>', methods=['GET'])
def get_landlord_profile(landlord_id):
    landlord = landlords_collection.find_one({"landlordId": int(landlord_id)})
    if not landlord:
        return jsonify({"error": "Landlord not found"}), 404

    # Fetch all reviews for this landlord
    reviews = list(ratings_collection.find({"landlordId": int(landlord_id)}))
    avg_rating = sum(r['score'] for r in reviews) / len(reviews) if reviews else None

    # Include landlord details with ratings
    landlord_data = {
        "landlordId": landlord.get("landlordId"),
        "name": landlord.get("name"),
        "type": landlord.get("type"),
        "properties": landlord.get("propertyId", []),  # List of property IDs associated with the landlord
        "averageRating": avg_rating,
        "reviewCount": len(reviews),
        "reviews": reviews  # Include all review details
    }
    return jsonify(landlord_data), 200

@landlord_profile_blueprint.route('/api/landlord/<landlord_id>/add_review', methods=['POST'])
def add_review(landlord_id):
    data = request.json
    user_id = data.get("userId")  # User ID from the request
    score = data.get("score")
    comment = data.get("comment")

    # Optional review aspects
    maintenance = data.get("maintenance")
    pets = data.get("pets")
    safety = data.get("safety")
    raisemoney = data.get("raisemoney")
    reachable = data.get("reachable")
    clearcontract = data.get("clearcontract")
    recommend = data.get("recommend")

    if not score or not comment:
        return jsonify({"error": "Score and comment are required"}), 400

    new_review = {
        "ratingId": ratings_collection.count_documents({}) + 1,  # Auto-increment ratingId
        "landlordId": int(landlord_id),
        "userId": user_id,
        "score": score,
        "comment": comment,
        "maintenance": maintenance,
        "pets": pets,
        "safety": safety,
        "raisemoney": raisemoney,
        "reachable": reachable,
        "clearcontract": clearcontract,
        "recommend": recommend
    }
    ratings_collection.insert_one(new_review)

    # Recalculate average rating and review count for landlord
    landlord_ratings = ratings_collection.find({"landlordId": int(landlord_id)})
    total_score = sum(r['score'] for r in landlord_ratings)
    review_count = ratings_collection.count_documents({"landlordId": int(landlord_id)})
    avg_rating = total_score / review_count if review_count else None

    landlords_collection.update_one(
        {"landlordId": int(landlord_id)},
        {"$set": {"averageRating": avg_rating, "reviewCount": review_count}}
    )

    return jsonify({"message": "Review added successfully!"}), 201
