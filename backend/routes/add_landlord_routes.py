import os
import requests
from flask import Blueprint, jsonify, current_app, request
from models.database import landlords_collection, properties_collection
from pymongo import DESCENDING

landlord_blueprint = Blueprint('landlord', __name__)

# Geocode function that returns latitude and longitude directly
def geocode_address(address):
    api_key = os.getenv("GEOCODING_API_KEY")
    base_url = "https://us1.locationiq.com/v1/search.php"

    params = {
        "key": api_key,
        "q": address,
        "format": "json"
    }

    try:
        response = requests.get(base_url, params=params)
        if response.status_code == 200:
            data = response.json()[0]
            return float(data["lat"]), float(data["lon"])  # Return latitude and longitude directly
        else:
            current_app.logger.error(f"Geocoding error {response.status_code}: {response.text}")
            return None, None
    except Exception as e:
        current_app.logger.error(f"Exception during geocoding: {str(e)}")
        return None, None
    
def get_next_landlord_id():
    last_landlord = landlords_collection.find_one(sort=[("landlordId", DESCENDING)])
    if last_landlord:
        return last_landlord["landlordId"] + 1
    else:
        return 1  # Start from 1 if no landlordId exists

# Function to get the next propertyId
def get_next_property_id():
    last_property = properties_collection.find_one(sort=[("propertyId", DESCENDING)])
    if last_property:
        return last_property["propertyId"] + 1
    else:
        return 1  # Start from 1 if no propertyId exists

@landlord_blueprint.route('/add_landlord', methods=['POST'])
def add_landlord():
    try:
        data = request.get_json()

        # Main landlord information
        name = data.get('name')
        type_of_landlord = data.get('type')
        property_name = data.get('propertyName')
        property_address = data.get('propertyAddress')
        city = data.get('city')
        state = data.get('state')
        zip_code = data.get('zipCode')

        # Check for required fields
        if not all([name, type_of_landlord, property_name, property_address, city, state, zip_code]):
            return jsonify({"message": "Missing required fields"}), 400

        # Geocode the main property address
        address = f"{property_address}, {city}, {state}, {zip_code}"
        latitude, longitude = geocode_address(address)
        if latitude is None or longitude is None:
            return jsonify({"message": "Failed to geocode address"}), 500

        # Check if the landlord already exists
        existing_landlord = landlords_collection.find_one({"name": name, "type": type_of_landlord})
        
        # Generate a unique landlordId if the landlord doesn't exist
        if not existing_landlord:
            landlord_id = get_next_landlord_id()
            landlord_data = {
                "landlordId": landlord_id,
                "name": name,
                "type": type_of_landlord,
                "propertyId": []  # Start with an empty list of properties
            }
            landlords_collection.insert_one(landlord_data)
        else:
            landlord_id = existing_landlord["landlordId"]

        # Add main property
        main_property_id = add_property(
            landlord_id, property_name, property_address, city, state, zip_code, latitude, longitude
        )

        # Add the main property ID to the landlord's properties list
        landlords_collection.update_one(
            {"landlordId": landlord_id},
            {"$addToSet": {"propertyId": main_property_id}}  # Use $addToSet to avoid duplicates
        )

        # Handle additional properties if they exist
        additional_properties = data.get("additionalProperties", [])
        for additional_property in additional_properties:
            add_property_from_data(additional_property, landlord_id)

        return jsonify({"message": "Landlord and properties added successfully!"}), 201

    except Exception as e:
        current_app.logger.error(f"Error adding landlord: {str(e)}")
        return jsonify({"message": "An error occurred while adding the landlord"}), 500

def add_property(landlord_id, property_name, property_address, city, state, zip_code, latitude, longitude):
    """Helper function to add a single property to the database."""
    # Check if the property already exists
    existing_property = properties_collection.find_one({
        "propertyname": property_name,
        "address": property_address,
        "city": city,
        "state": state,
        "zipcode": zip_code
    })

    if existing_property:
        return existing_property["propertyId"]

    # If property does not exist, add it to the properties collection with a custom propertyId
    property_id = get_next_property_id()
    property_data = {
        "propertyId": property_id,
        "propertyname": property_name,
        "address": property_address,
        "city": city,
        "state": state,
        "zipcode": zip_code,
        "latitude": latitude,
        "longitude": longitude,
        "landlordId": landlord_id
    }
    properties_collection.insert_one(property_data)
    return property_id

def add_property_from_data(property_data, landlord_id):
    """Helper function to add an additional property to the database."""
    # Extract data from the additional property
    property_name = property_data.get('propertyName')
    property_address = property_data.get('propertyAddress')
    city = property_data.get('city')
    state = property_data.get('state')
    zip_code = property_data.get('zipCode')
    
    # Geocode the additional property address
    address = f"{property_address}, {city}, {state}, {zip_code}"
    latitude, longitude = geocode_address(address)
    if latitude is None or longitude is None:
        raise ValueError("Failed to geocode additional property address")

    # Add the property and get the property ID
    property_id = add_property(landlord_id, property_name, property_address, city, state, zip_code, latitude, longitude)

    # Add the property ID to the landlord's property list
    landlords_collection.update_one(
        {"landlordId": landlord_id},
        {"$addToSet": {"propertyId": property_id}}  # Avoid duplicates
    )
