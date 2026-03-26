from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
from pymongo import MongoClient
from flask_bcrypt import Bcrypt
import jwt
import datetime
import pandas as pd

from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor, VotingRegressor
from xgboost import XGBRegressor
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split

app = Flask(__name__)
CORS(app)
bcrypt = Bcrypt(app)

SECRET = "secret123"

# 🔌 MongoDB Connection
client = MongoClient("mongodb://localhost:27017/")
db = client["demandDB"]

users = db["users"]
history = db["history"]
feedback = db["feedback"]

print("Connected to MongoDB:", client.list_database_names())

# 📦 Load Model
model = joblib.load("backend/model.pkl")

# 🔄 Encode season
def encode_season(season):
    mapping = {"winter": 0, "summer": 1, "monsoon": 2}
    return mapping.get(season.lower(), 0)

# 🏠 Home
@app.route("/")
def home():
    return "Backend running"

# 📝 Register
@app.route("/register", methods=["POST"])
def register():
    try:
        data = request.json
        print("Register data:", data)

        # check if user exists
        if users.find_one({"email": data["email"]}):
            return jsonify({"error": "User already exists"}), 400

        hashed = bcrypt.generate_password_hash(data["password"]).decode("utf-8")

        users.insert_one({
            "email": data["email"],
            "password": hashed
        })

        print("User saved!")
        return jsonify({"message": "User registered"})
    
    except Exception as e:
        print("REGISTER ERROR:", e)
        return jsonify({"error": "Registration failed"}), 400

# 🔐 Login
@app.route("/login", methods=["POST"])
def login():
    try:
        data = request.json
        print("Login data:", data)

        user = users.find_one({"email": data["email"]})

        if not user or not bcrypt.check_password_hash(user["password"], data["password"]):
            return jsonify({"error": "Invalid credentials"}), 401

        token = jwt.encode({
            "email": data["email"],
            "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=2)
        }, SECRET, algorithm="HS256")

        return jsonify({"token": token})
    
    except Exception as e:
        print("LOGIN ERROR:", e)
        return jsonify({"error": "Login failed"}), 400

# 📊 Predict
@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.json
        print("Incoming data:", data)

        price = float(data["price"])
        marketing = float(data["marketing"])
        season = encode_season(data["season"])
        email = data.get("email") or "demo@gmail.com"

        prediction = model.predict([[price, marketing, season]])[0]

        record = {
            "email": email,
            "price": price,
            "marketing": marketing,
            "season": data["season"],
            "prediction": float(prediction)
        }

        print("Saving:", record)

        history.insert_one(record)

        return jsonify({"prediction": round(prediction, 2)})

    except Exception as e:
        print("PREDICT ERROR:", e)
        return jsonify({"error": "Prediction failed"}), 400

# 📜 Get History
@app.route("/history/<email>", methods=["GET"])
def get_history(email):
    try:
        print("Fetching history for:", email)

        data = list(history.find({"email": email}, {"_id": 0}))

        return jsonify(data)
    
    except Exception as e:
        print("HISTORY ERROR:", e)
        return jsonify({"error": "Failed to fetch history"}), 400

# 🧠 Feedback API
@app.route("/feedback", methods=["POST"])
def add_feedback():
    try:
        data = request.json
        print("Feedback received:", data)

        feedback.insert_one(data)

        return jsonify({"message": "Feedback saved"})
    
    except Exception as e:
        print("FEEDBACK ERROR:", e)
        return jsonify({"error": "Feedback failed"}), 400

# 🔁 Retrain Model
@app.route("/retrain", methods=["POST"])
def retrain():
    try:
        print("Retraining model...")

        data = list(history.find({}, {"_id": 0}))

        if len(data) == 0:
            return jsonify({"error": "No data available"}), 400

        df = pd.DataFrame(data)

        le = LabelEncoder()
        df["season"] = le.fit_transform(df["season"])

        X = df[["price", "marketing", "season"]]
        y = df["prediction"]

        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3)

        rf = RandomForestRegressor(n_estimators=200)
        gb = GradientBoostingRegressor(n_estimators=200)
        xgb = XGBRegressor(n_estimators=200)

        model_new = VotingRegressor([
            ("rf", rf),
            ("gb", gb),
            ("xgb", xgb)
        ])

        model_new.fit(X_train, y_train)

        joblib.dump(model_new, "model.pkl")

        print("Model retrained!")

        return jsonify({"message": "Model retrained successfully"})
    
    except Exception as e:
        print("RETRAIN ERROR:", e)
        return jsonify({"error": "Retrain failed"}), 400

# ▶️ Run app
if __name__ == "__main__":
    app.run(port=5000, debug=True)