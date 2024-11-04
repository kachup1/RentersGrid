from models.database import properties_collection

def fetch_all_markers():
    """Fetch all markers from the database, including pre-stored coordinates if available."""
    pipeline = [
        {
            "$lookup": {
                "from": "landlords",
                "localField": "landlordId",
                "foreignField": "landlordId",
                "as": "landlord_info"
            }
        },
        {
            "$unwind": {
                "path": "$landlord_info",
                "preserveNullAndEmptyArrays": True
            }
        },
        {
            "$project": {
                "_id": 0,
                "address": 1,
                "city": 1,
                "state": 1,
                "zipcode": 1,
                "propertyname": 1,
                "latitude": 1,   # Include latitude and longitude
                "longitude": 1,
                "landlord_name": "$landlord_info.name"
            }
        },
        {"$limit": 100}  # Limit results for performance
    ]

    properties = list(properties_collection.aggregate(pipeline))

    # Format data for the frontend, ensuring coordinates are included
    return [
        {
            "full_address": f"{property['address']}, {property['city']}, {property['state']} {property['zipcode']}",
            "property_name": property["propertyname"],
            "landlord_name": property.get("landlord_name", "Unknown"),
            "latitude": property.get("latitude"),   # Send pre-stored latitude and longitude
            "longitude": property.get("longitude")
        }
        for property in properties
    ]

def fetch_search_markers(query):
    """Fetch markers based on a search query, including pre-stored coordinates if available."""
    pipeline = [
        {
            "$match": {
                "$or": [
                    {"propertyname": {"$regex": query, "$options": "i"}},
                    {"address": {"$regex": query, "$options": "i"}}
                ]
            }
        },
        {
            "$lookup": {
                "from": "landlords",
                "localField": "landlordId",
                "foreignField": "landlordId",
                "as": "landlord_info"
            }
        },
        {
            "$unwind": {
                "path": "$landlord_info",
                "preserveNullAndEmptyArrays": True
            }
        },
        {
            "$project": {
                "_id": 0,
                "address": 1,
                "city": 1,
                "state": 1,
                "zipcode": 1,
                "propertyname": 1,
                "latitude": 1,   # Include latitude and longitude
                "longitude": 1,
                "landlord_name": "$landlord_info.name"
            }
        },
        {"$limit": 100}  # Limit results for performance
    ]

    properties = list(properties_collection.aggregate(pipeline))
    formatted_properties = [
        {
            "full_address": f"{property['address']}, {property['city']}, {property['state']} {property['zipcode']}",
            "property_name": property["propertyname"],
            "landlord_name": property.get("landlord_name", "Unknown"),
            "latitude": property.get("latitude"),
            "longitude": property.get("longitude")
        }
        for property in properties
    ]

    # Print to verify the structure of the data before sending it to the frontend
    print("Formatted Data for Frontend:", formatted_properties)
    return formatted_properties