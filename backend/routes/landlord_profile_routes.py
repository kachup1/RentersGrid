# landlord_profile_routes.py
from flask import Blueprint, request, jsonify
from models.database import landlords_collection, ratings_collection,properties_collection
from bson import ObjectId  # Import ObjectId for type checking

landlord_profile_blueprint = Blueprint('landlord_profile', __name__)

def serialize_mongo_document(document):
    """ Helper function to convert ObjectId fields in MongoDB documents to strings. """
    for key, value in document.items():
        if isinstance(value, ObjectId):
            document[key] = str(value)
    return document

@landlord_profile_blueprint.route('/api/landlord/<landlord_id>', methods=['GET'])
def get_landlord_profile(landlord_id):
    landlord = landlords_collection.find_one({"landlordId": int(landlord_id)})
    if not landlord:
        return jsonify({"error": "Landlord not found"}), 404

    # Convert ObjectId in landlord document
    landlord = serialize_mongo_document(landlord)

    #getting properties associated with the landlord
    properties = list(properties_collection.find({"landlordId": int(landlord_id)}))
    properties = [serialize_mongo_document(prop)for prop in properties]

    # Fetch all reviews for this landlord and convert ObjectId fields
    reviews = [serialize_mongo_document(review) for review in ratings_collection.find({"landlordId": int(landlord_id)})]

    avg_rating = sum(r['score'] for r in reviews) / len(reviews) if reviews else None

    landlord_data = {
        "landlordId": landlord.get("landlordId"),
        "name": landlord.get("name"),
        "type": landlord.get("type"),
        "properties": properties,
        "averageRating": avg_rating,
        "reviewCount": len(reviews),
        "reviews": reviews
    }
    return jsonify(landlord_data), 200
