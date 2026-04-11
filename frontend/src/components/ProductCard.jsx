import React from "react";
import { useCart } from "../context/CartContext";
import { translations } from "../utils/translations";

const ProductCard = ({ product, lang }) => {
  const { addToCart } = useCart();
  const t = translations[lang];

  return (
    <div style={styles.card}>
      <img
        src={product.image?.[0] || "/box1.png"}
        alt={product.name}
        style={styles.img}
      />
      <div style={styles.body}>
        <h3 style={styles.name}>{product.name}</h3>
        <p style={styles.desc}>{product.description}</p>
        <div style={styles.footer}>
          <span style={styles.price}>₹{product.price}</span>
          <button className="btn-primary" style={styles.btn} onClick={() => addToCart(product)}>
            {t.addToCart}
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  card: {
    background: "#fff", borderRadius: 12,
    border: "1px solid #E0D5C5",
    overflow: "hidden",
    display: "flex", flexDirection: "column",
    transition: "transform 0.2s",
  },
  img:  { width: "100%", height: 160, objectFit: "cover" },
  body: { padding: 14, display: "flex", flexDirection: "column", gap: 8, flex: 1 },
  name: { fontSize: 16, fontWeight: 600, color: "#2E7D32" },
  desc: { fontSize: 13, color: "#757575", flexGrow: 1 },
  footer: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  price:  { fontSize: 18, fontWeight: 700, color: "#E87722" },
  btn:    { padding: "7px 14px", fontSize: 13 },
};

export default ProductCard;