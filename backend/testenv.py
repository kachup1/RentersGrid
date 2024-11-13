from dotenv import load_dotenv, find_dotenv
import os

# Use find_dotenv to locate the .env file automatically
dotenv_path = find_dotenv()

if dotenv_path:
    print(f"Found .env file at: {dotenv_path}")
else:
    print("No .env file found")

load_dotenv(dotenv_path)

# Check if the environment variable is being read
print("MONGO_URI:", os.getenv('MONGO_URI'))
print("JWT_SECRET_KEY:", os.getenv('JWT_SECRET_KEY'))
