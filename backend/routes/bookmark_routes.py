from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.database import bookmarks_collection, landlords_collection

# Create a blueprint for bookmarks
bookmarks_blueprint = Blueprint('bookmarks', __name__)
# Route to add a bookmark (requires JWT)
@bookmarks_blueprint.route('/api/bookmark', methods=['POST'])
@jwt_required()
def add_bookmark():
    data = request.json
    landlord_id = data.get('landlordId')
    user_id = get_jwt_identity().get("userId")
    if not landlord_id or not user_id:
        return jsonify({"error": "landlordId and userId are required"}), 400

    # Check if bookmark already exists
    existing_bookmark = bookmarks_collection.find_one({"landlordId": landlord_id, "userId": user_id})
    if existing_bookmark:
        return jsonify({"error": "Bookmark already exists"}), 400

    # Add bookmark
    bookmarks_collection.insert_one({
        "landlordId": landlord_id,
        "userId": user_id
    })

    return jsonify({"success": True, "message": "Bookmark added successfully"}), 201
# Route to remove a bookmark (requires JWT)
@bookmarks_blueprint.route('/api/bookmark', methods=['DELETE'])
@jwt_required()
def remove_bookmark():
    data = request.json
    landlord_id = data.get('landlordId')
    user_id = get_jwt_identity().get("userId")  # Extract userId from JWT

    if not landlord_id or not user_id:
        return jsonify({"error": "landlordId and userId are required"}), 400

    # Check if bookmark exists
    existing_bookmark = bookmarks_collection.find_one({"landlordId": landlord_id, "userId": user_id})
    if not existing_bookmark:
        return jsonify({"error": "Bookmark does not exist"}), 404

    # Remove the bookmark
    bookmarks_collection.delete_one({"landlordId": landlord_id, "userId": user_id})

    return jsonify({"success": True, "message": "Bookmark removed successfully"}), 200
@bookmarks_blueprint.route('/api/bookmarks', methods=['GET'])
@jwt_required()
def get_bookmarks():
    user_id = get_jwt_identity().get("userId")  # Extract userId from JWT

    # Find all bookmarks for this user
    user_bookmarks = bookmarks_collection.find({"userId": user_id}, {"_id": 0, "landlordId": 1})
    
    # Create a list of landlord IDs that are bookmarked
    bookmarked_landlords = [bookmark['landlordId'] for bookmark in user_bookmarks]

    return jsonify(bookmarked_landlords), 200

@bookmarks_blueprint.route('/api/bookmarked-landlords', methods=['GET'])
@jwt_required()  # Ensure the user is authenticated
def get_bookmarked_landlords():
    user_id = get_jwt_identity().get("userId")  # Get the userId from the JWT token

    # Step 1: Retrieve all bookmarked landlords for this user
    user_bookmarks = bookmarks_collection.find({"userId": user_id}, {"_id": 0, "landlordId": 1})
    
    # Step 2: Extract the landlord IDs that are bookmarked
    landlord_ids = [bookmark['landlordId'] for bookmark in user_bookmarks]

    # If no landlords are bookmarked, return an empty list
    if not landlord_ids:
        return jsonify([]), 200
    
    # Step 3: Aggregation pipeline to fetch landlord details along with properties and ratings
    pipeline = [
        {
            '$match': {'landlordId': {'$in': landlord_ids}}  # Match only the bookmarked landlords
        },
        {
            '$lookup': {  # Join with the Properties collection
                'from': 'properties',
                'localField': 'landlordId',
                'foreignField': 'landlordId',
                'as': 'properties'
            }
        },
        {
            '$lookup': {  # Join with the Ratings collection
                'from': 'ratings',
                'localField': 'landlordId',
                'foreignField': 'landlordId',
                'as': 'ratings'
            }
        },
        {
            '$addFields': {  # Add calculated fields
                'averageRating': {'$avg': '$ratings.score'},  # Calculate the average rating
                'reviewCount': {'$size': '$ratings'}  # Count the number of reviews
            }
        },
        {
            '$project': {  # Specify the fields to return
                '_id': 0,
                'landlordId': 1,
                'name': 1,
                'properties.propertyname': 1,
                'properties.address': 1,
                'properties.city': 1,
                'properties.zipcode': 1,
                'averageRating': 1,
                'reviewCount': 1
            }
        }
    ]

    # Step 4: Execute the aggregation pipeline
    landlords = list(landlords_collection.aggregate(pipeline))

    # Step 5: Return the list of landlords in JSON format
    return jsonify(landlords), 200
