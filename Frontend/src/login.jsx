import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:5000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (res.ok) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("email", email);
      navigate("/");
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
      <h2 className="form-title gradient-text">{t('login')}</h2>
      <p className="form-subtitle">{t('auth_subtitle')}</p>
      <form onSubmit={handleLogin}>
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
        <button type="submit" className="btn-primary submit-btn">{t('login')}</button>
      </form>
      <Link to="/register" className="switch-link">{t('create_account')}</Link>
    </motion.div>
  );
};

export default Login;