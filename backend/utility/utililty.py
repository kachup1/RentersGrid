from models.database import users_collection
import re
def get_next_user_id():
    total_users = users_collection.count_documents({})
    if total_users > 0:
        last_user = users_collection.find().sort("userId", -1).limit(1)
        return last_user[0]["userId"] + 1
    return 1
def is_valid_email(email):
    regex = r'^[^\s@]+@[^\s@]+\.[^\s@]+$'   # string + @ + string + . , checks for whitespace
    return re.match(regex, email)

