import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "app_title": "Pulse Predictor",
      "home": "Predict",
      "history": "History",
      "login": "Login",
      "register": "Register",
      "logout": "Logout",
      "predict_demand": "Predict Product Demand",
      "product_category": "Product Category",
      "shoes": "Shoes",
      "books": "Books",
      "electronics": "Electronics",
      "clothing": "Clothing",
      "software": "Software",
      "price": "Price",
      "marketing": "Marketing Budget",
      "competitor_price": "Competitor Price",
      "eco_index": "Economic Index",
      "season": "Season",
      "winter": "Winter",
      "summer": "Summer",
      "monsoon": "Monsoon",
      "spring": "Spring",
      "autumn": "Autumn",
      "submit_predict": "Run Prediction",
      "predicted_demand": "Predicted Demand",
      "recent_history": "Recent Predictions",
      "timestamp": "Time",
      "email": "Email",
      "password": "Password",
      "auth_subtitle": "Enter your details to continue",
      "create_account": "Create an account",
      "language": "Language",
      "no_history": "No history available.",
      "units": "Units",
      "graph_view": "Graph View",
      "table_view": "Table View",
      "total_predictions": "Total Predictions",
      "avg_demand": "Average Demand"
    }
  },
  hi: {
    translation: {
      "app_title": "पल्स प्रेडिक्टर",
      "home": "भविष्यवाणी करें",
      "history": "इतिहास",
      "login": "लॉग इन",
      "register": "रजिस्टर करें",
      "logout": "लॉग आउट",
      "predict_demand": "उत्पाद की मांग का अनुमान",
      "product_category": "उत्पाद श्रेणी",
      "shoes": "जूते",
      "books": "किताबें",
      "electronics": "इलेक्ट्रॉनिक्स",
      "clothing": "कपड़े",
      "software": "सॉफ्टवेयर",
      "price": "मूल्य",
      "marketing": "मार्केटिंग बजट",
      "competitor_price": "प्रतियोगी मूल्य",
      "eco_index": "आर्थिक सूचकांक",
      "season": "मौसम",
      "winter": "सर्दी",
      "summer": "गर्मी",
      "monsoon": "मानसून",
      "spring": "वसंत",
      "autumn": "पतझड़",
      "submit_predict": "भविष्यवाणी चलाएं",
      "predicted_demand": "अनुमानित मांग",
      "recent_history": "हाल की भविष्यवाणियां",
      "timestamp": "समय",
      "email": "ईमेल",
      "password": "पासवर्ड",
      "auth_subtitle": "जारी रखने के लिए अपना विवरण दर्ज करें",
      "create_account": "अकाउंट बनाएं",
      "language": "भाषा",
      "no_history": "कोई इतिहास उपलब्ध नहीं है।",
      "units": "इकाइयां",
      "graph_view": "ग्राफ दृश्य",
      "table_view": "टेबल दृश्य",
      "total_predictions": "कुल भविष्यवाणियां",
      "avg_demand": "औसत मांग"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
