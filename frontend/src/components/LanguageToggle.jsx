import React from "react";

const LanguageToggle = ({ lang, setLang }) => (
  <div style={{ display: "flex", gap: 4, background: "rgba(255,255,255,0.15)", borderRadius: 20, padding: "3px 6px" }}>
    {["en", "hi"].map(l => (
      <button
        key={l}
        onClick={() => setLang(l)}
        style={{
          background: lang === l ? "#E87722" : "transparent",
          color: "#fff", border: "none",
          borderRadius: 16, padding: "3px 10px",
          fontSize: 13, fontWeight: lang === l ? 600 : 400,
          cursor: "pointer",
        }}
      >
        {l === "en" ? "EN" : "हि"}
      </button>
    ))}
  </div>
);

export default LanguageToggle;