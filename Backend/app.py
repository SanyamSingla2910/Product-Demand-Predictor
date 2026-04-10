from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
from flask_bcrypt import Bcrypt
import jwt
import datetime
import pandas as pd
from pymongo import MongoClient

app = Flask(__name__)
CORS(app)
bcrypt = Bcrypt(app)

SECRET = "secret123"

try:
    client = MongoClient("mongodb://localhost:27017/", serverSelectionTimeoutMS=5000)
    db = client["demandDB"]
    users = db["users"]
    history = db["history"]
    feedback = db["feedback"]
    client.server_info()
except Exception as e:
    pass

try:
    model = joblib.load("model.pkl")
except:
    model = None

@app.route("/")
def home():
    return "Backend running"

@app.route("/register", methods=["POST"])
def register():
    try:
        data = request.json
        if users.find_one({"email": data["email"]}):
            return jsonify({"error": "User already exists"}), 400

        hashed = bcrypt.generate_password_hash(data["password"]).decode("utf-8")
        
        users.insert_one({
            "email": data["email"],
            "password": hashed
        })

        return jsonify({"message": "User registered"})
    except Exception as e:
        return jsonify({"error": "Registration failed"}), 400

@app.route("/login", methods=["POST"])
def login():
    try:
        data = request.json
        user = users.find_one({"email": data["email"]})

        if not user or not bcrypt.check_password_hash(user["password"], data["password"]):
            return jsonify({"error": "Invalid credentials"}), 401

        token = jwt.encode({
            "email": data["email"],
            "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=2)
        }, SECRET, algorithm="HS256")

        return jsonify({"token": token})
    except Exception as e:
        return jsonify({"error": "Login failed"}), 400

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.json
        price = float(data["price"])
        marketing = float(data["marketing"])
        competitor_price = float(data.get("competitor_price", price + 5))
        economic_index = float(data.get("economic_index", 1.0))
        season_raw = data.get("season", "winter").lower()
        product_category_raw = data.get("product_category", "shoes").lower()
        email = data.get("email") or "demo@gmail.com"

        if not model:
            return jsonify({"error": "Model not loaded"}), 500

        input_df = pd.DataFrame([{
            "product_category": product_category_raw,
            "price": price,
            "marketing": marketing,
            "competitor_price": competitor_price,
            "economic_index": economic_index,
            "season": season_raw
        }])

        prediction = model.predict(input_df)[0]
        rounded_prediction = round(float(prediction), 2)

        record = {
            "email": email,
            "product_category": product_category_raw,
            "price": price,
            "marketing": marketing,
            "competitor_price": competitor_price,
            "economic_index": economic_index,
            "season": season_raw,
            "prediction": rounded_prediction,
            "timestamp": datetime.datetime.utcnow().isoformat()
        }
        
        history.insert_one(record)

        return jsonify({"prediction": rounded_prediction})
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route("/history/<email>", methods=["GET"])
def get_history(email):
    try:
        records_cursor = history.find({"email": email}).sort("_id", -1)
        data = []
        for r in records_cursor:
            r.pop("_id", None) 
            data.append(r)
            
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": "Failed to fetch history"}), 400

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)