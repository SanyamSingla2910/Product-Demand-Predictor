import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { BarChart, Bar, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

const History = () => {
  const [history, setHistory] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchHistory = async () => {
      const email = localStorage.getItem("email");
      if (!email) return;

      const res = await fetch(`http://localhost:5000/history/${email}`);
      const data = await res.json();
      if (res.ok) {
        setHistory(data); 
      }
    };
    fetchHistory();
  }, []);

  const chartData = [...history].reverse().map((item, index) => ({
    name: `Run ${index + 1}`,
    demand: item.prediction,
    price: item.price,
    marketing: item.marketing,
    comp_price: item.competitor_price
  }));

  const totalPredictions = history.length;
  const avgDemand = history.length > 0 ? (history.reduce((a, b) => a + b.prediction, 0) / history.length).toFixed(0) : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', gap: '2rem' }}>
        <motion.div 
          className="glass-panel" 
          style={{ padding: '1.5rem', flex: 1, textAlign: 'center' }}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <h3 style={{ color: 'var(--text-muted)' }}>{t('total_predictions')}</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--accent-secondary)' }}>{totalPredictions}</p>
        </motion.div>
        <motion.div 
          className="glass-panel" 
          style={{ padding: '1.5rem', flex: 1, textAlign: 'center' }}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <h3 style={{ color: 'var(--text-muted)' }}>{t('avg_demand')}</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--accent-primary)' }}>{avgDemand}</p>
        </motion.div>
      </div>

      {totalPredictions > 0 ? (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <motion.div 
              className="glass-panel" 
              style={{ padding: '2rem' }}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="panel-header">{t('predicted_demand')} vs {t('marketing')}</h2>
              <div style={{ height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorD" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorM" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="name" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
                    <Legend />
                    <Area type="monotone" dataKey="demand" name={t('predicted_demand')} stroke="#8b5cf6" fillOpacity={1} fill="url(#colorD)" />
                    <Area type="monotone" dataKey="marketing" name={t('marketing')} stroke="#0ea5e9" fillOpacity={1} fill="url(#colorM)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            <motion.div 
              className="glass-panel" 
              style={{ padding: '2rem' }}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="panel-header">{t('price')} vs {t('competitor_price')}</h2>
              <div style={{ height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="name" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} cursor={{fill: 'rgba(255,255,255,0.05)'}} />
                    <Legend />
                    <Bar dataKey="price" name={t('price')} fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="comp_price" name={t('competitor_price')} fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>

          <motion.div 
            className="glass-panel" 
            style={{ padding: '2rem' }}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="panel-header">{t('table_view')}</h2>
            <div style={{ overflowX: 'auto' }}>
              <table className="history-table">
                <thead>
                  <tr>
                    <th>{t('timestamp')}</th>
                    <th>{t('product_category')}</th>
                    <th>{t('price')}</th>
                    <th>{t('competitor_price')}</th>
                    <th>{t('marketing')}</th>
                    <th>{t('eco_index')}</th>
                    <th>{t('season')}</th>
                    <th>{t('predicted_demand')}</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((record, index) => (
                    <tr key={index}>
                      <td style={{ color: 'var(--text-muted)' }}>{new Date(record.timestamp).toLocaleString()}</td>
                      <td style={{ textTransform: 'capitalize' }}>{record.product_category || 'N/A'}</td>
                      <td>${record.price}</td>
                      <td>${record.competitor_price}</td>
                      <td>${record.marketing}</td>
                      <td>{record.economic_index}</td>
                      <td style={{ textTransform: 'capitalize' }}>{record.season}</td>
                      <td style={{ color: 'var(--accent-secondary)', fontWeight: 'bold' }}>{record.prediction}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </>
      ) : (
        <motion.div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>{t('no_history')}</p>
        </motion.div>
      )}
    </div>
  );
};

export default History;