from flask import Blueprint, request, jsonify
from models.database import ratings_collection
from bson.objectid import ObjectId

# Create Blueprint
delete_ratings_blueprint = Blueprint('delete_ratings', __name__)

@delete_ratings_blueprint.route('/api/delete_rating', methods=['DELETE'])
def delete_rating():
    rating_id = request.args.get('ratingId')
    print(f"Received ratingId: {rating_id}")  # Debugging statement

    if not rating_id or rating_id == 'undefined':
        print("Invalid or missing ratingId")
        return jsonify({'error': 'Valid Rating ID is required'}), 400

    try:
        obj_id = ObjectId(rating_id)
        print(f"Converted to ObjectId: {obj_id}")
        result = ratings_collection.delete_one({'_id': obj_id})
        print(f"Deleted Count: {result.deleted_count}")

        if result.deleted_count == 0:
            return jsonify({'error': 'Rating not found'}), 404

        return jsonify({'message': 'Rating deleted successfully'}), 200

    except Exception as e:
        print(f"Error deleting rating: {e}")
        return jsonify({'error': 'Failed to delete rating'}), 500