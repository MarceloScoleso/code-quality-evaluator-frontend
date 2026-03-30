"use client";

import { ReactNode, useEffect } from "react";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

interface Props {
  children: ReactNode;
}

export default function I18nProvider({ children }: Props) {
  useEffect(() => {
    const defaultLang = localStorage.getItem("lang") || "pt";

    i18n
      .use(initReactI18next)
      .init({
        resources: {
          pt: { translation: { home: "Home", dashboard: "Dashboard", newEvaluation: "Nova Avaliação", exportCsv: "Exportar CSV", history: "Histórico" } },
          en: { translation: { home: "Home", dashboard: "Dashboard", newEvaluation: "New Evaluation", exportCsv: "Export CSV", history: "History" } },
          es: { translation: { home: "Inicio", dashboard: "Panel", newEvaluation: "Nueva Evaluación", exportCsv: "Exportar CSV", history: "Historial" } }
        },
        lng: defaultLang,
        fallbackLng: "en",
        interpolation: { escapeValue: false }
      });
  }, []);

  return <>{children}</>;
}