-------------------------------------------------------
PULSE PREDICTOR - FINAL INSTRUCTIONS
-------------------------------------------------------

This project allows a seller to predict product demand based on an advanced AI model (Ensemble AI featuring Neural Networks).

PREREQUISITES:
1. Python installed.
2. Node.js installed.
3. MongoDB Community Server installed and running locally on port 27017.

HOW TO START THE BACKEND:
1. Open a terminal.
2. Navigate to the backend directory:
   cd Backend
3. Install required packages (if you haven't):
   pip install -r requirements.txt
4. Run the API:
   python app.py
   (Wait until it says "Connected to MongoDB successfully!")

HOW TO START THE FRONTEND:
1. Open a second, new terminal window.
2. Navigate to the frontend directory:
   cd Frontend
3. Install required packages:
   npm install
4. Run the React Web app:
   npm run dev
5. Hold CTRL and click the "http://localhost:5173" link.

HOW TO TRAIN A NEW MODEL OR RESET DATA:
If you ever want to reset your data to a new synthetic 10,000 mapping, do the following:
1. Navigate to the Backend folder in a terminal.
2. Run: python generate_dataset.py
3. Run: python train_model.py

FEATURES INCLUDED:
- Automatic Login / Registration Routing.
- Dynamic Prediction tracking with Visual Area Charts.
- Product Category awareness (Shoes, Books, Electronics, Clothing, Software).
- Advanced KPI Dashboard History view.
- Live English/Hindi Language toggling.
