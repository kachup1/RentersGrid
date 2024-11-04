from flask import Blueprint, jsonify, request
from utility.fetchMarkers import fetch_all_markers, fetch_search_markers

# Initialize the Blueprint
map_blueprint = Blueprint("map_routes", __name__)

@map_blueprint.route('/api/map_markers', methods=['GET'])
def get_all_markers():
    """Endpoint to retrieve all markers with coordinates if available."""
    try:
        markers = fetch_all_markers()  # Returns markers with latitude and longitude
        return jsonify(markers), 200
    except Exception as e:
        print("Error in get_all_markers:", str(e))
        return jsonify({"error": str(e)}), 500

@map_blueprint.route('/api/map_markers/search', methods=['GET'])
def get_search_markers():
    """Endpoint to retrieve markers based on a search query with coordinates if available."""
    query = request.args.get("query", "")
    if not query:
        return jsonify([]), 200  # Return empty list if no query is provided
    try:
        markers = fetch_search_markers(query)  # Returns filtered markers with latitude and longitude
        return jsonify(markers), 200
    except Exception as e:
        print("Error in get_search_markers:", str(e))
        return jsonify({"error": str(e)}), 500
