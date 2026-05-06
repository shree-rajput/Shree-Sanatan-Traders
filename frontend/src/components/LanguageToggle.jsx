import React from "react";
import { LuLanguages } from "react-icons/lu";
import { useLanguage } from "../context/LanguageContext";

const LanguageToggle = () => {
  const { lang, setLang } = useLanguage();
  
  return (
    <button 
      onClick={() => setLang(lang === "en" ? "hi" : "en")}
      className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 hover:bg-green-50 text-gray-600 hover:text-green-700 rounded-lg transition-all border border-gray-100"
    >
      <LuLanguages size={16} />
      <span className="text-xs font-bold uppercase tracking-widest">
        {lang === "en" ? "EN" : "HI"}
      </span>
    </button>
  );
};

export default LanguageToggle;