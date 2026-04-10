import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FiLogOut, FiGlobe, FiActivity } from "react-icons/fi";
import { motion } from "framer-motion";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();

  const token = localStorage.getItem("token");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    navigate("/login");
  };

  const toggleLanguage = () => {
    const langs = ['en', 'hi'];
    const currentIndex = langs.indexOf(i18n.language);
    const nextIndex = (currentIndex + 1) % langs.length;
    i18n.changeLanguage(langs[nextIndex]);
  };

  return (
    <motion.nav 
      className="navbar glass-panel"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Link to="/" className="nav-brand gradient-text">
        <FiActivity size={28} />
        {t('app_title')}
      </Link>
      <div className="nav-actions">
        <div className="nav-links">
          {token ? (
            <>
              <Link to="/predict" className={`nav-link ${location.pathname === '/predict' ? 'active' : ''}`}>{t('home')}</Link>
              <Link to="/history" className={`nav-link ${location.pathname === '/history' ? 'active' : ''}`}>{t('history')}</Link>
              <button className="icon-btn" onClick={toggleLanguage} title={t('language')} style={{ textTransform: 'uppercase', fontSize: '0.9rem', fontWeight: 'bold' }}>
                <FiGlobe style={{ marginRight: '4px' }} /> {i18n.language}
              </button>
              <button className="icon-btn" onClick={logout} title={t('logout')}><FiLogOut /></button>
            </>
          ) : (
            <>
              <Link to="/login" className={`nav-link ${location.pathname === '/login' ? 'active' : ''}`}>{t('login')}</Link>
              <Link to="/register" className={`nav-link ${location.pathname === '/register' ? 'active' : ''}`}>{t('register')}</Link>
              <button className="icon-btn" onClick={toggleLanguage} title={t('language')} style={{ textTransform: 'uppercase', fontSize: '0.9rem', fontWeight: 'bold' }}>
                <FiGlobe style={{ marginRight: '4px' }} /> {i18n.language}
              </button>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;