import React from "react";
import { LuLanguages, LuChevronDown } from "react-icons/lu";

const LanguageToggle = ({ lang, setLang }) => (
  <button 
    onClick={() => setLang(lang === "en" ? "hi" : "en")}
    className="flex items-center gap-1.5 hover:text-green-200 transition-colors group"
  >
    <LuLanguages size={14} className="text-green-400 group-hover:text-green-200" />
    <span className="text-[13px] font-bold tracking-tight">
      {lang === "en" ? "English" : "हिन्दी"}
    </span>
    <LuChevronDown size={14} className="opacity-50" />
  </button>
);

export default LanguageToggle;