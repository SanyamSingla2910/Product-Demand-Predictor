import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor, VotingRegressor
from xgboost import XGBRegressor
from sklearn.metrics import r2_score

df = pd.read_csv("backend/dataset.csv")

le = LabelEncoder()
df["season"] = le.fit_transform(df["season"])

X = df[["price", "marketing", "season"]]
y = df["demand"]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3)

rf = RandomForestRegressor(n_estimators=200)
gb = GradientBoostingRegressor(n_estimators=200)
xgb = XGBRegressor(n_estimators=200)

model = VotingRegressor([
    ("rf", rf),
    ("gb", gb),
    ("xgb", xgb)
])

model.fit(X_train, y_train)

y_pred = model.predict(X_test)

print("Accuracy (R2 Score):", r2_score(y_test, y_pred))

joblib.dump(model, "model.pkl")

print("Initial model trained successfully")