from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017/")
db = client["demandDB"]

users = db["users"]
history = db["history"]
collection = db["feedback"]