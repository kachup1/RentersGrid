#Add a property to a landlord 
from flask import Blueprint, request, jsonify
from models.database import landlords_collection, ratings_collection,properties_collection
from bson import ObjectId  # Import ObjectId for type checking
from geopy.geocoders import Nominatim
from pymongo import DESCENDING


add_property_blueprint = Blueprint('add_property',__name__)

@add_property_blueprint.route('/api/addproperty/<landlord_id>',methods=['POST'])
def add_property(landlord_id):
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}),400
    address = data.get('address')

    if not address:
        return jsonify({'error':'Address is required'}),400
    latitude,longitude = get_lat_long(address)
    
    #Checking for duplicate addresses:
    existing_property = properties_collection.find_one({'address':address})
    if existing_property:
        return jsonify({'error': 'A property with this address already exists.'}),409

    
    new_property_id = get_next_property_id()
    property_data = {
        'propertyId':new_property_id,
        'propertyname': data.get('name'),
        'address': data.get('address'),
        'city': data.get('city'),
        'state': data.get('state'),
        'zipcode': data.get('zipcode'),
        'latitude': latitude,
        'longitude': longitude,
        'landlordId': int(landlord_id)
    }

    properties_collection.insert_one(property_data)
    landlords_collection.update_one(
        {'landlordId':int(landlord_id)},
        {'$addToSet':{'propertyId':new_property_id}}
    )

    return jsonify({'message': 'Property added successfully'}),201

def get_lat_long(address):
    geolocator = Nominatim(user_agent="RentersGrid")
    location = geolocator.geocode(address)
    if location:
        return location.latitude, location.longitude
    return None, None

def get_next_property_id():
    last_property = properties_collection.find_one(sort=[("propertyId", DESCENDING)])
    if last_property:
        return last_property["propertyId"] + 1
    else:
        return 1  # Start from 1 if no propertyId exists

