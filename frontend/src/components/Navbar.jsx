import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import LanguageToggle from "./LanguageToggle";
import { translations } from "../utils/translations";

const Navbar = ({ lang, setLang }) => {
  const t  = translations[lang];
  const { user, logout } = useAuth();
  const { totalItems }   = useCart();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate("/login"); };

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.brand}>
        <span style={styles.om}>🌾</span>
        <span>{t.appName}</span>
      </Link>

      <div style={styles.links}>
        <Link to="/"       style={styles.link}>{t.home}</Link>
        <Link to="/cart"   style={styles.link}>
          {t.cart} {totalItems > 0 && <span style={styles.badge}>{totalItems}</span>}
        </Link>
        {user ? (
          <>
            <Link to="/orders" style={styles.link}>{t.orders}</Link>
            <button onClick={handleLogout} style={styles.logoutBtn}>{t.logout}</button>
          </>
        ) : (
          <Link to="/login" style={styles.link}>{t.login}</Link>
        )}
        <LanguageToggle lang={lang} setLang={setLang} />
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "12px 24px",
    background: "#2E7D32",
    color: "#fff",
    position: "sticky", top: 0, zIndex: 100,
    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
  },
  brand: {
    display: "flex", alignItems: "center", gap: 8,
    color: "#fff", textDecoration: "none",
    fontSize: 18, fontWeight: 600,
  },
  om:    { fontSize: 22 },
  links: { display: "flex", alignItems: "center", gap: 20 },
  link:  { color: "#fff", textDecoration: "none", fontSize: 15 },
  badge: {
    background: "#E87722", color: "#fff",
    borderRadius: "50%", padding: "2px 7px",
    fontSize: 12, marginLeft: 4,
  },
  logoutBtn: {
    background: "transparent", border: "1px solid #fff",
    color: "#fff", padding: "6px 14px", borderRadius: 6, fontSize: 14,
  },
};

export default Navbar;