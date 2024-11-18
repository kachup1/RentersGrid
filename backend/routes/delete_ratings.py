from flask import Blueprint, request, jsonify
from models.database import ratings_collection
from bson.objectid import ObjectId

# Create Blueprint
delete_ratings_blueprint = Blueprint('delete_ratings', __name__)

@delete_ratings_blueprint.route('/api/delete_rating', methods=['DELETE'])
def delete_rating():
    # Get the 'object_id' from the request parameters
    object_id = request.args.get('object_id')
    print(f"Received object_id: {object_id}")  # Debugging statement

    # Check if 'object_id' is provided and valid
    if not object_id or object_id == 'undefined':
        print("Invalid or missing object_id")
        return jsonify({'error': 'Valid Object ID is required'}), 400

    try:
        # Convert the received 'object_id' to an ObjectId
        obj_id = ObjectId(object_id)
        print(f"Converted to ObjectId: {obj_id}")
        result = ratings_collection.delete_one({'_id': obj_id})
        print(f"Deleted Count: {result.deleted_count}")

        if result.deleted_count == 0:
            return jsonify({'error': 'Rating not found'}), 404

        return jsonify({'message': 'Rating deleted successfully'}), 200

    except Exception as e:
        print(f"Error deleting rating: {e}")
        return jsonify({'error': 'Failed to delete rating'}), 500
