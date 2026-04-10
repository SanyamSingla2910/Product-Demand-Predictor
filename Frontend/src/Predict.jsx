import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const Predict = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    product_category: "Shoes",
    price: "",
    marketing: "",
    competitor_price: "",
    economic_index: "",
    season: "Winter",
  });
  const [prediction, setPrediction] = useState(null);
  const [visualData, setVisualData] = useState([]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const generateDummyContext = (predictedVal) => {
    const base = predictedVal;
    return [
      { name: 'Wk -3', demand: Math.max(0, base - base * 0.15) },
      { name: 'Wk -2', demand: Math.max(0, base - base * 0.08) },
      { name: 'Wk -1', demand: Math.max(0, base + base * 0.05) },
      { name: 'Current', demand: base, isPrediction: true },
    ];
  };

  const handlePredict = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");

    const res = await fetch("http://localhost:5000/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify({ ...formData, email }),
    });

    const data = await res.json();
    if (res.ok) {
      setPrediction(data.prediction);
      setVisualData(generateDummyContext(data.prediction));
    } else {
      alert("Error: " + data.error);
    }
  };

  return (
    <div className="dashboard-grid">
      <motion.div 
        className="glass-panel p-card" 
        style={{ padding: '2rem' }}
        initial={{ x: -30, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="panel-header gradient-text">{t('predict_demand')}</h2>
        <form onSubmit={handlePredict}>
          <div className="input-group">
            <label>{t('product_category')}</label>
            <select name="product_category" className="input-field" onChange={handleChange}>
              <option value="Shoes">{t('shoes')}</option>
              <option value="Books">{t('books')}</option>
              <option value="Electronics">{t('electronics')}</option>
              <option value="Clothing">{t('clothing')}</option>
              <option value="Software">{t('software')}</option>
            </select>
          </div>
          <div className="input-group" style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ flex: 1 }}>
              <label>{t('price')}</label>
              <input type="number" name="price" className="input-field" onChange={handleChange} required />
            </div>
            <div style={{ flex: 1 }}>
              <label>{t('competitor_price')}</label>
              <input type="number" name="competitor_price" className="input-field" onChange={handleChange} required />
            </div>
          </div>
          <div className="input-group">
            <label>{t('marketing')}</label>
            <input type="number" name="marketing" className="input-field" onChange={handleChange} required />
          </div>
          <div className="input-group">
            <label>{t('eco_index')}</label>
            <input type="number" step="0.1" name="economic_index" className="input-field" onChange={handleChange} required />
          </div>
          <div className="input-group">
            <label>{t('season')}</label>
            <select name="season" className="input-field" onChange={handleChange}>
              <option value="Winter">{t('winter')}</option>
              <option value="Summer">{t('summer')}</option>
              <option value="Monsoon">{t('monsoon')}</option>
              <option value="Spring">{t('spring')}</option>
              <option value="Autumn">{t('autumn')}</option>
            </select>
          </div>
          <button type="submit" className="btn-primary submit-btn">{t('submit_predict')}</button>
        </form>
      </motion.div>

      <motion.div 
        className="glass-panel" 
        style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}
        initial={{ x: 30, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="panel-header">{t('predicted_demand')}</h2>
        
        {prediction !== null ? (
          <>
            <motion.div 
              className="prediction-result"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <p>{t('predicted_demand')}:</p>
              <div className="prediction-value">{prediction} {t('units')}</div>
            </motion.div>
            
            <div className="chart-container" style={{ flexGrow: 1 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={visualData}>
                  <defs>
                    <linearGradient id="colorDemand" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(30,30,40,0.9)', border: 'none', borderRadius: '8px' }}
                    itemStyle={{ color: '#0ea5e9' }}
                  />
                  <Area type="monotone" dataKey="demand" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorDemand)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </>
        ) : (
          <div style={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
            Enter parameters and submit to see predictions.
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Predict;