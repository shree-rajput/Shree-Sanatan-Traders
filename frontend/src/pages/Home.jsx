import React, { useEffect, useState } from "react";
import API from "../services/api";
import ProductCard from "../components/ProductCard";
import { translations } from "../utils/translations";

const Home = ({ lang }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const t = translations[lang];

  useEffect(() => {
    API.get("/products")
      .then(res => setProducts(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ padding: "24px" }}>
      {/* Hero Banner */}
      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>{t.appName}</h1>
        <p style={styles.heroSub}>{t.tagline}</p>
      </div>

      <h2 style={styles.sectionTitle}>{t.products}</h2>

      {loading ? (
        <p style={{ textAlign: "center", color: "#757575" }}>{t.loading}</p>
      ) : products.length === 0 ? (
        <p style={{ textAlign: "center", color: "#757575" }}>{t.noProducts}</p>
      ) : (
        <div style={styles.grid}>
          {products.map(p => (
            <ProductCard key={p._id} product={p} lang={lang} />
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  hero: {
    background: "linear-gradient(135deg, #2E7D32, #4CAF50)",
    color: "#fff", borderRadius: 16,
    padding: "40px 32px", marginBottom: 32, textAlign: "center",
  },
  heroTitle:    { fontSize: 32, fontWeight: 700, marginBottom: 8 },
  heroSub:      { fontSize: 18, opacity: 0.9 },
  sectionTitle: { fontSize: 22, fontWeight: 600, color: "#2E7D32", marginBottom: 20 },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gap: 20,
  },
};

export default Home;