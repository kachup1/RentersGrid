from flask import Blueprint, request, jsonify
from models.database import landlords_collection
import logging

search_blueprint = Blueprint('search', __name__)

@search_blueprint.route('/api/search', methods=['GET'])
def search():
    search_by = request.args.get('searchBy')
    query = request.args.get('query')
    sort_by = request.args.get('sortBy', 'name')

    logging.info(f"Received search query: search_by={search_by}, query={query}, sort_by={sort_by}")

    if not query:
        logging.error("Query parameter is missing")
        return jsonify({'error': 'Query parameter is required'}), 400

    # Search by names that start with the query (first or last name)
    search_letter = query.strip().lower()
    search_criteria = {}

    if search_by == 'landlord':
        # Match only if the first or last name starts with the search query
        search_criteria = {
            '$or': [
                {'name': {'$regex': f'^{search_letter}', '$options': 'i'}},  # Matches first name starting with query
                {'name': {'$regex': f'^.*\\s{search_letter}', '$options': 'i'}}  # Matches last name starting with query
            ]
        }
    elif search_by == 'property':
        search_criteria = {'properties.propertyname': {'$regex': query, '$options': 'i'}}
    elif search_by == 'address':
        search_criteria = {'properties.address': {'$regex': query, '$options': 'i'}}
    elif search_by == 'city':
        search_criteria = {'properties.city': {'$regex': query, '$options': 'i'}}
    elif search_by == 'zipcode':
        search_criteria = {'properties.zipcode': query}

    # Sort criteria based on selected sort option
    sort_criteria = {}
    if sort_by == 'highest-rating':
        sort_criteria = {'averageRating': -1}
    elif sort_by == 'lowest-rating':
        sort_criteria = {'averageRating': 1}
    elif sort_by == 'property-name':
        sort_criteria = {'properties.propertyname': 1}
    elif sort_by == 'most-reviews':
        sort_criteria = {'reviewCount': -1}
    else:
        sort_criteria = {'name': 1}

    # MongoDB aggregation pipeline
    pipeline = [
        {
            '$lookup': {
                'from': 'properties',
                'localField': 'propertyId',
                'foreignField': 'propertyId',
                'as': 'properties'
            }
        },
        {
            '$lookup': {
                'from': 'ratings',
                'localField': 'landlordId',
                'foreignField': 'landlordId',
                'as': 'ratings'
            }
        },
        {
            '$addFields': {
                'averageRating': {'$avg': '$ratings.score'},
                'reviewCount': {'$size': '$ratings'}
            }
        },
        {
            '$match': search_criteria
        },
        {
            '$sort': sort_criteria
        },
        {
            '$project': {
                '_id': 0,
                'name': 1,
                'type': 1,
                'landlordId': 1,
                'averageRating': 1,
                'reviewCount': 1,
                'properties.propertyname': 1,
                'properties.address': 1,
                'properties.city': 1,
                'properties.zipcode': 1,
                'properties.latitude': 1,
                'properties.longitude': 1
            }
        }
    ]

    results = list(landlords_collection.aggregate(pipeline))
    logging.info(f"Found {len(results)} results for search criteria: {search_criteria}")

    return jsonify(results)
