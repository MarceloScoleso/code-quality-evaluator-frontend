import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const getLanguage = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("lang") || "pt";
  }
  return "pt"; 
};

i18n
  .use(initReactI18next)
  .init({
    resources: {
      pt: {
        translation: {
          home: "Home",
          dashboard: "Dashboard",
          newEvaluation: "Nova Avaliação",
          exportCsv: "Exportar CSV",
          history: "Histórico"
        }
      },
      en: {
        translation: {
          home: "Home",
          dashboard: "Dashboard",
          newEvaluation: "New Evaluation",
          exportCsv: "Export CSV",
          history: "History"
        }
      },
      es: {
        translation: {
          home: "Inicio",
          dashboard: "Panel",
          newEvaluation: "Nueva Evaluación",
          exportCsv: "Exportar CSV",
          history: "Historial"
        }
      }
    },
    lng: getLanguage(),
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;