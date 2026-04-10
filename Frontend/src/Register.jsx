import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleRegister = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:5000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (res.ok) {
      alert("Registered successfully! Please login.");
      navigate("/login");
    } else {
      alert(data.error);
    }
  };

  return (
    <motion.div 
      className="form-card glass-panel"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="form-title gradient-text">{t('register')}</h2>
      <p className="form-subtitle">{t('auth_subtitle')}</p>
      <form onSubmit={handleRegister}>
        <div className="input-group">
          <label>{t('email')}</label>
          <input
            type="email"
            className="input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label>{t('password')}</label>
          <input
            type="password"
            className="input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn-primary submit-btn">{t('register')}</button>
      </form>
      <Link to="/login" className="switch-link">Already have an account? {t('login')}</Link>
    </motion.div>
  );
};

export default Register;