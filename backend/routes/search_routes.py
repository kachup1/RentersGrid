from flask import Blueprint, request, jsonify
from models.database import landlords_collection
import logging

search_blueprint = Blueprint('search', __name__)

@search_blueprint.route('/api/search', methods=['GET'])
def search():
    search_by = request.args.get('searchBy')
    query = request.args.get('query')
    sort_by = request.args.get('sortBy', 'name')  # Default to sorting by 'name'

    logging.info(f"Received search query: search_by={search_by}, query={query}, sort_by={sort_by}")

    if not query:
        logging.error("Query parameter is missing")
        return jsonify({'error': 'Query parameter is required'}), 400

    # Default search criteria
    search_criteria = {}

    # Build search criteria based on searchBy parameter
    if search_by == 'landlord':
        # Search for landlords by name
        search_criteria = {'name': {'$regex': query, '$options': 'i'}}
    elif search_by == 'property':
        search_criteria = {'properties.propertyname': {'$regex': query, '$options': 'i'}}
    elif search_by == 'address':
        search_criteria = {'properties.address': {'$regex': query, '$options': 'i'}}
    elif search_by == 'city':
        search_criteria = {'properties.city': {'$regex': query, '$options': 'i'}}
    elif search_by == 'zipcode':
        search_criteria = {'properties.zipcode': query}
        
    sort_criteria = {}
    logging.info(f"Sort criteria: {sort_criteria}")

    if not sort_criteria:
        sort_criteria = {'name': 1}  # Default to sorting by landlord name

    sort_criteria = {'name': 1}  # Default to sorting by landlord name (ascending)

    if sort_by == 'landlord-name':
        sort_criteria = {'name': 1}  # Sort by landlord name (ascending)
    elif sort_by == 'highest-rating':
        sort_criteria = {'averageRating': -1}  # Highest Rating first (descending)
    elif sort_by == 'lowest-rating':
        sort_criteria = {'averageRating': 1}  # Lowest Rating first (ascending)
    elif sort_by == 'property-name':
        sort_criteria = {'properties.propertyname': 1}  # Sort by property name (ascending)
    elif sort_by == 'most-reviews':
       sort_criteria = {'reviewCount': -1}  # Sort by most reviews first (descending)

    # MongoDB aggregation pipeline
    pipeline = [
        {
            '$lookup': {
                'from': 'properties',  # Join with the Properties collection
                'localField': 'propertyId',  # Field in Landlord collection
                'foreignField': 'propertyId',  # Field in Properties collection
                'as': 'properties'  # Resulting array field
            }
        },
        {
            '$lookup': {
                'from': 'ratings',  # Join with the Ratings collection
                'localField': 'landlordId',  # Field in Landlord collection
                'foreignField': 'landlordId',  # Field in Ratings collection
                'as': 'ratings'  # Resulting array field containing all ratings for the landlord
            }
        },
        {
            '$addFields': {
                'averageRating': { '$avg': '$ratings.score' },  # Calculate the average score
                'reviewCount': { '$size': '$ratings' }  # Count the number of reviews (ratings array)

            }
            },
        {
            '$match': search_criteria  # Apply search criteria after lookup
        },
        
        {
              '$sort': sort_criteria   # Sort by the chosen criteria
        },
        {
            '$project': {  # Select the fields to return
                '_id': 0,
                'name': 1,
                'type': 1,
                'landlordId': 1,  # Ensure this is included in the response
                'averageRating': 1,  # Include the average rating in the results
                'reviewCount': 1,  # Include the review count
                'properties.propertyname': 1,
                'properties.address': 1,
                'properties.city': 1,
                'properties.zipcode': 1
            }
        }
    ]

    results = list(landlords_collection.aggregate(pipeline))  # Perform aggregation
    logging.info(f"Found {len(results)} results for search criteria: {search_criteria}")

    return jsonify(results)
