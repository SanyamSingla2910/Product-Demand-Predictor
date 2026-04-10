import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler, OneHotEncoder
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor, VotingRegressor
from sklearn.neural_network import MLPRegressor
from xgboost import XGBRegressor
from sklearn.metrics import r2_score, mean_absolute_error
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer

df = pd.read_csv("dataset.csv")

df["season"] = df["season"].str.lower()
df["product_category"] = df["product_category"].str.lower()

X = df[["product_category", "price", "marketing", "competitor_price", "economic_index", "season"]]
y = df["demand"]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

numeric_features = ["price", "marketing", "competitor_price", "economic_index"]
categorical_features = ["product_category", "season"]

preprocessor = ColumnTransformer(
    transformers=[
        ('num', StandardScaler(), numeric_features),
        ('cat', OneHotEncoder(handle_unknown='ignore'), categorical_features)
    ],
    remainder='passthrough'
)

rf = RandomForestRegressor(n_estimators=100, random_state=42, max_depth=10, n_jobs=-1)
gb = GradientBoostingRegressor(n_estimators=100, random_state=42, learning_rate=0.1)
xgb = XGBRegressor(n_estimators=100, random_state=42, learning_rate=0.1, n_jobs=-1)
mlp = MLPRegressor(hidden_layer_sizes=(128, 64), activation='relu', solver='adam', max_iter=500, random_state=42)

voting_reg = VotingRegressor([
    ("rf", rf),
    ("gb", gb),
    ("xgb", xgb),
    ("nn", mlp)
])

model_pipeline = Pipeline(steps=[
    ('preprocessor', preprocessor),
    ('regressor', voting_reg)
])

model_pipeline.fit(X_train, y_train)

y_pred = model_pipeline.predict(X_test)

joblib.dump(model_pipeline, "model.pkl")