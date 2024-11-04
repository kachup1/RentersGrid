# utils/geocode.py
import requests
import os

LOCATIONIQ_API_KEY = os.getenv("LOCATIONIQ_API_KEY")

def geocode_address(address):
    """Geocode an address using LocationIQ API."""
    url = f"https://us1.locationiq.com/v1/search.php?key={LOCATIONIQ_API_KEY}&q={address}&format=json"
    try:
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()
        
        if data and len(data) > 0:
            return {
                "latitude": float(data[0]["lat"]),
                "longitude": float(data[0]["lon"])
            }
    except (requests.RequestException, ValueError) as e:
        print(f"Geocoding error for address '{address}': {e}")
    
    return None  # Return None if geocoding fails
