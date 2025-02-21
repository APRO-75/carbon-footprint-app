from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Connect to local MongoDB
client = MongoClient("mongodb://localhost:27017/")
db = client['carbon_footprint_db']  # Database
collection = db['footprint_data']   # Collection

# Default route
@app.route('/', methods=['GET'])
def home():
    return jsonify({"message": "Welcome to the Carbon Footprint API!"})

# Test route
@app.route('/api/hello', methods=['GET'])
def hello():
    return jsonify({"message": "Hello from Flask Backend!"})

# Calculate and store carbon footprint
@app.route('/api/calculate', methods=['POST'])
def calculate():
    data = request.json
    transport = data.get('transport', 0)
    food = data.get('food', 0)
    energy = data.get('energy', 0)

    # Simple calculation
    carbon_footprint = (transport * 0.21) + (food * 2.5) + (energy * 0.5)

    # Create a document to insert
    record = {
        "transport": transport,
        "food": food,
        "energy": energy,
        "carbon_footprint": round(carbon_footprint, 2),
        "timestamp": datetime.now()
    }

    # Insert into MongoDB
    collection.insert_one(record)

    return jsonify({"carbon_footprint": round(carbon_footprint, 2)})

# Fetch all carbon footprint records
@app.route('/api/history', methods=['GET'])
def history():
    records = list(collection.find({}, {'_id': 0}))  # Exclude MongoDB _id field
    return jsonify(records)

if __name__ == '__main__':
    app.run(debug=True)
