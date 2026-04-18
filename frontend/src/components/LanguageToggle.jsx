import React from "react";

const LanguageToggle = ({ lang, setLang }) => (
  <div className="flex gap-1 bg-white/10 backdrop-blur-md rounded-full p-1 border border-white/20 shadow-inner">
    {["en", "hi"].map(l => (
      <button
        key={l}
        onClick={() => setLang(l)}
        className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all duration-300 ${
          lang === l 
            ? "bg-emerald-500 text-white shadow-sm" 
            : "text-emerald-100 hover:text-white"
        }`}
      >
        {l === "en" ? "ENG" : "हिन्दी"}
      </button>
    ))}
  </div>
);

export default LanguageToggle;