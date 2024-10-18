from flask import Flask, jsonify, request
from flask_pymongo import PyMongo
from flask_bcrypt import Bcrypt
from pymongo.errors import DuplicateKeyError
import jwt
from pymongo import MongoClient
from flask_cors import CORS #added this since we had issues with port 3000 & 5000
from dotenv import load_dotenv
from flask_jwt_extended import JWTManager, create_access_token, jwt_required  # JWT handling

import os

# Load environment variables from the .env file
load_dotenv()

# Retrieve the MongoDB URI from the environment variables
mongo_uri = os.getenv("MONGO_URI")

# Connect to MongoDB
client = MongoClient(mongo_uri)
db = client['RentersDB']  # Use or create the 'rentersDB' database

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

#Route to request a password reset
@app.route('/request_reset_password', methods=['POST'])
def request_reset_password():
    """
    Request password reset and send reset token.
    The user provides their email, and if the email exists in the database, 
    a reset token (JWT) is generated and sent (in this case, returned for testing).
    """
    data = request.json  #Get the JSON data from the request body
    email = data.get('email')  #Get the email field from the request

    if not email:  #If the email is not provided, return an error response
        return jsonify({"error": "Email is required"}), 400

    #Look up the user in the database by their email address
    user = db.users.find_one({"email": email})
    if not user:  #If no user is found with that email, return a 404 error
        return jsonify({"error": "User not found"}), 404

    #if the user exists, create a JWT token for password reset, valid for 15 minutes
    reset_token = create_access_token(identity=user['userId'], expires_delta=timedelta(minutes=15))

    
    #For testing purposes, just return the token in the response.
    return jsonify({"reset_token": reset_token}), 200

#Route to reset the password using the reset token
@app.route('/reset_password', methods=['POST'])
def reset_password():
    """
    Reset password after validating the reset token.
    The user provides the reset token and a new password. The token is verified,
    and if valid, the new password is hashed and updated in the database.
    """
    data = request.json  #Get the JSON data from the request body
    reset_token = data.get('reset_token')  #Extract the reset token from the request
    new_password = data.get('new_password')  #Extract the new password from the request

    #If either the reset token or new password is missing, return an error response
    if not reset_token or not new_password:
        return jsonify({"error": "Token and new password are required"}), 400

    try:
        #Decode the reset token to extract the user ID
        decoded_token = decode_token(reset_token)
        user_id = decoded_token['sub']  #The user ID is stored in the 'sub' field of the token
    except jwt.ExpiredSignatureError:  #Handle the case where the token has expired
        return jsonify({"error": "Token expired"}), 400
    except jwt.InvalidTokenError:  #Handle the case where the token is invalid
        return jsonify({"error": "Invalid token"}), 400

    #Hash the new password using Bcrypt
    hashed_password = bcrypt.generate_password_hash(new_password).decode('utf-8')

    #Update the user's password in the database using the extracted user ID
    db.users.update_one({"userId": user_id}, {"$set": {"password": hashed_password}})

    #Return a success message once the password is reset
    return jsonify({"message": "Password reset successful!"}), 200



@app.route('/')
def home():
    return "Hello, Flask and MongoDB!"


if __name__=="__main__":
    app.run(debug=True)