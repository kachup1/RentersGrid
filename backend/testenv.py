from dotenv import load_dotenv
import os

# Load the .env file
load_dotenv(dotenv_path='/Users/veenx/Desktop/RentersGrid/.env')

# Correctly reference the environment variable
print(os.getenv('MONGO_URI'))
