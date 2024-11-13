from flask import Flask
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
from config import Config
from models.database import db
from routes.auth_routes import auth_blueprint
from routes.bookmark_routes import bookmarks_blueprint
from routes.search_routes import search_blueprint
from routes.map_routes import map_blueprint
from routes.rp_routes import rp_routes
from routes.landlord_profile_routes import landlord_profile_blueprint
from routes.add_a_review_routes import add_a_review_blueprint
from routes.get_ratings import ratings_blueprint
from routes.delete_ratings import delete_ratings_blueprint
from routes.edit_myaccount import edit_account_bp
from routes.vote_routes import vote_blueprint  



# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})
CORS(app)
bcrypt = Bcrypt(app)

# Load configurations
app.config.from_object(Config)

# Initialize JWT
jwt = JWTManager(app)

# Register blueprints (modular routes)
app.register_blueprint(auth_blueprint)
app.register_blueprint(bookmarks_blueprint)
app.register_blueprint(search_blueprint)
app.register_blueprint(map_blueprint)
app.register_blueprint(rp_routes)
app.register_blueprint(landlord_profile_blueprint)
app.register_blueprint(add_a_review_blueprint)
app.register_blueprint(edit_account_bp)
app.register_blueprint(ratings_blueprint)
app.register_blueprint(delete_ratings_blueprint)
app.register_blueprint(vote_blueprint)


# Add global CORS headers for all responses
@app.after_request
def add_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "http://localhost:3000"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type,Authorization"
    response.headers["Access-Control-Allow-Methods"] = "GET,POST,OPTIONS,PUT,DELETE"
    return response

if __name__ == "__main__":
    app.run(debug=True)
