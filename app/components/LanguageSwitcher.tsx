"use client";

import { useTranslation } from "react-i18next";

const langs = [
  { code: "pt", flag: "🇧🇷", label: "PT" },
  { code: "en", flag: "🇺🇸", label: "EN" },
  { code: "es", flag: "🇪🇸", label: "ES" },
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const changeLang = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);
  };

  return (
    <div className="flex items-center gap-1 p-1 rounded-xl border border-white/10 bg-white/5">
      {langs.map((l) => (
        <button
          key={l.code}
          onClick={() => changeLang(l.code)}
          className={`
            flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[0.72rem] font-semibold
            transition-all duration-200
            ${i18n.language === l.code
              ? "bg-violet-500/20 border border-violet-500/30 text-violet-300"
              : "text-slate-500 hover:text-slate-300 hover:bg-white/5 border border-transparent"}
          `}
        >
          <span>{l.flag}</span>
          <span>{l.label}</span>
        </button>
      ))}
    </div>
  );
}