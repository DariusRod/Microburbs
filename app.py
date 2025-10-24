import os
import requests
import math  # <-- ADD THIS IMPORT
from flask import Flask, render_template, jsonify
from dotenv import load_dotenv

# Load environment variables from the .env file
load_dotenv()

app = Flask(__name__)

# Fetch API key and define the base URL
API_KEY = os.getenv("MICROBURBS_API_KEY", "test")
API_BASE_URL = "https://www.microburbs.com.au/report_generator/api/suburb/properties"


def clean_nan_values(obj):
    """
    Recursively walk a dictionary or list and replace float('nan') with None,
    as None will be correctly converted to JSON 'null'.
    """
    if isinstance(obj, dict):
        return {k: clean_nan_values(v) for k, v in obj.items()}
    if isinstance(obj, list):
        return [clean_nan_values(i) for i in obj]
    if isinstance(obj, float) and math.isnan(obj):
        return None  # Convert NaN to None
    return obj
# ------------------------------------

@app.route('/')
def index():
    """Serves the main index.html page."""
    return render_template('index.html')

@app.route('/api/properties/<suburb>')
def get_properties(suburb):
    """
    A proxy endpoint to fetch property data for a given suburb
    from the Microburbs API.
    """
    if not suburb:
        return jsonify({"error": "Suburb parameter is required."}), 400

    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }
    params = {
        "suburb": suburb
    }

    try:
        response = requests.get(API_BASE_URL, params=params, headers=headers)
        response.raise_for_status()
        
        data = response.json()
        
        
        cleaned_data = clean_nan_values(data) 
        
        if not cleaned_data.get("results"):
             return jsonify({"error": f"No properties found for '{suburb}' or the suburb is invalid."}), 404
             
        return jsonify(cleaned_data) 

    except requests.exceptions.HTTPError as err:
        return jsonify({"error": f"API request failed: {err}"}), err.response.status_code
    except requests.exceptions.RequestException as e:
        return jsonify({"error": f"A network error occurred: {e}"}), 500

if __name__ == '__main__':
    app.run(debug=True)