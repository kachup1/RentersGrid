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

# Load environment variables
load_dotenv()

app = Flask(__name__)
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

if __name__ == "__main__":
    app.run(debug=True)
