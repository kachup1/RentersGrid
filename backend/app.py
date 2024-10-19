from flask import Flask, jsonify, request
from flask_pymongo import PyMongo
from flask_bcrypt import Bcrypt
from pymongo.errors import DuplicateKeyError
import jwt
from pymongo import MongoClient
from flask_cors import CORS #added this since we had issues with port 3000 & 5000
from dotenv import load_dotenv
from flask_jwt_extended import JWTManager, create_access_token, jwt_required  # JWT handling
import logging
import os
from flask_jwt_extended import get_jwt_identity
import re
logging.basicConfig(level=logging.INFO)

# Load environment variables from the .env file
load_dotenv()


# Retrieve the MongoDB URI from the environment variables
mongo_uri = os.getenv("MONGO_URI")

# Connect to MongoDB
client = MongoClient(mongo_uri)
db = client['RentersDB']  # Use or create the 'rentersDB' database
landlords_collection = db['landlords']  # Assuming 'landlords' is the collection name
properties_collection = db['properties']
bookmarks_collection = db['bookmarks']
users_collection = db['users']

# Flask Application Setup
app = Flask(__name__)
CORS(app)
bcrypt = Bcrypt(app) #initializes Bcrypt for password hashing

# JWT setup
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")  # Set the JWT secret key from environment variables
jwt = JWTManager(app)  # Initialize JWT Manager

def get_next_user_id():
    #check the total number of users in the collection
    total_users = db.users.count_documents({})

    if total_users > 0:
        #get the last user by sorting by userid in descending order
        last_user = db.users.find().sort("userId",-1).limit(1)
        return last_user[0]["userId"]+1

    else:
        return 1


@app.route('/SignUp',
 methods = ['POST'])
def signup():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"error: Email and Password are required"}),400

    #hashing the password that a user inputs:
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

    #check if the email already exists:
    existing_user = db.users.find_one({"email":email})
    if existing_user:
        return jsonify({"error":"Email already exists"}),400


    try:
        #get the next userId
        user_id = get_next_user_id()

        #Insert the new user into the 'users' collection
        db.users.insert_one({
            'email': email,
            'password': hashed_password,
            'userId': user_id #Add userId field


        })
        return jsonify({"message": "User created successfully!"}),201
    except DuplicateKeyError:
        return jsonify({"error": "Email already exists"}), 400


@app.route('/api/search', methods=['GET'])
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
@app.route('/Login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    # Find user by email
    user = users_collection.find_one({"email": email})
    
    # Check user and password
    if user and bcrypt.check_password_hash(user['password'], password):
        # Create JWT token with userId in the payload
        access_token = create_access_token(identity={"userId": str(user['_id'])})
        return jsonify({'access_token': access_token}), 200
    else:
        return jsonify({"error": "Invalid email or password"}), 401

# Route to add a bookmark (requires JWT)
@app.route('/api/bookmark', methods=['POST'])
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
@app.route('/api/bookmark', methods=['DELETE'])
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
@app.route('/api/bookmarks', methods=['GET'])
@jwt_required()
def get_bookmarks():
    user_id = get_jwt_identity().get("userId")  # Extract userId from JWT

    # Find all bookmarks for this user
    user_bookmarks = bookmarks_collection.find({"userId": user_id}, {"_id": 0, "landlordId": 1})
    
    # Create a list of landlord IDs that are bookmarked
    bookmarked_landlords = [bookmark['landlordId'] for bookmark in user_bookmarks]

    return jsonify(bookmarked_landlords), 200
@app.route('/VerifyEmail', methods=['POST'])
def verify_email():
    data = request.json
    email = data.get('email')

    if not email:
        return jsonify({"error": "Email is required"}), 400
    
    user = db.users.find_one({"email": email})

    if user:
        # If the email exists
        return jsonify({"message": "Email exists."}), 200
    else:
        # If the email doesn't exist
        return jsonify({"error": "Email not found"}), 404

@app.route('/ChangePassword', methods=['POST'])
def change_password():
    # Get the email and new password from the request
    data = request.get_json()
    email = data.get('email')
    new_password = data.get('new_password')

    # Check if email or new_password is missing in the request
    if not email or not new_password:
        return jsonify({"error": "Missing required fields"}), 422
    if len(new_password) < 6 or not re.search(r'\d', new_password):
        return jsonify({"error": "Password must be 6+ characters and include a number."}), 400
    # Check if a user with the provided email exists
    user = users_collection.find_one({"email": email})

    if not user:
        return jsonify({"error": "User not found"}), 404  # Return 404 if the user is not found

    # Hash the new password
    hashed_password = bcrypt.generate_password_hash(new_password).decode("utf-8")

    # Update the user's password
    result = users_collection.update_one(
        {"email": email},  # Find the user by email
        {"$set": {"password": hashed_password}}  # Update the password field with the hashed password
    )

    if result.modified_count == 0:
        return jsonify({"error": "Failed to update the password"}), 500  # If the update fails for any reason

    return jsonify({"message": "Password changed successfully"}), 200  # Return success if everything works

if __name__ == '__main__':
    app.run(debug=True)
