"use client";

import i18n from "i18next";

export default function LanguageSwitcher() {
  const changeLang = (lang: string) => {
    i18n.changeLanguage(lang);

    if (typeof window !== "undefined") {
      localStorage.setItem("lang", lang);
    }
  };

  return (
    <div className="flex gap-2 bg-white p-2 rounded-xl shadow">
      <button onClick={() => changeLang("pt")}>🇧🇷</button>
      <button onClick={() => changeLang("en")}>🇺🇸</button>
      <button onClick={() => changeLang("es")}>🇪🇸</button>
    </div>
  );
}