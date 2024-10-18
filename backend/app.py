from flask import Flask, jsonify, request, redirect  # Add 'request' to handle query params
from pymongo import MongoClient
from dotenv import load_dotenv
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity  # JWT handling
from flask_bcrypt import Bcrypt
import jwt
import os
from flask_cors import CORS
import re


import logging

logging.basicConfig(level=logging.INFO)
# Load environment variables from the .env file
load_dotenv()

# Retrieve the MongoDB URI from the environment variables
mongo_uri = os.getenv("MONGO_URI")

# Connect to MongoDB
client = MongoClient(mongo_uri)
db = client['RentersDB']  # Use or create the 'rentersDB' database
landlords_collection = db['Landlords']
properties_collection = db['Properties']
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



#Endpoint for user login. Validates user credentials and generates a JWT token if successful.
@app.route('/Login', methods=['POST'])
def login():
    """Endpoint for user login."""
    data = request.json  # Get JSON data from the request
    email = data.get('email')  # Extract email from the request
    password = data.get('password')  # Extract password from the request

    if not email or not password:
        return jsonify({"error": "Email and Password are required"}), 400  # Return error if fields are missing

    # Find the user in the database
    user = db.users.find_one({"email": email})
    
    # Check if user exists and password matches
    if user and bcrypt.check_password_hash(user['password'], password):
        # Create JWT token with user ID as identity
        access_token = create_access_token(identity=user['userId'])
        return jsonify({'access_token': access_token}), 200  # Ensure you're returning a 200 status code on success
    else:
        return jsonify({"error": "Invalid email or password"}), 401  # Return error if credentials are invalid


@app.route('/VerifyEmail', methods=['POST'])
def verify_email():
    data = request.json
    email = data.get('email')

    if not email:
        return jsonify({"error": "Email is required"}), 400
    
    # normalized_email = email.lower()
    
    # Find the email in the database
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

@app.route('/')
def home():
    return "Hello, Flask and MongoDB!"


if __name__=="__main__":
    app.run(debug=True)