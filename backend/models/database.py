from pymongo import MongoClient
from config import Config

# Connect to MongoDB
client = MongoClient(Config.MONGO_URI)
db = client['RentersDB']

landlords_collection = db['landlords']
properties_collection = db['properties']
bookmarks_collection = db['bookmarks']
users_collection = db['users']

