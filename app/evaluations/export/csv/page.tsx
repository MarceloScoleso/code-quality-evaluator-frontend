"use client";

import { useState } from "react";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import BackToHomeButton from "@/app/components/BackToHomeButton";
import EvaluationFilters from "@/app/components/EvaluationFilters";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type Language =
  | "JAVA"
  | "CSHARP"
  | "JAVASCRIPT"
  | "TYPESCRIPT"
  | "PYTHON"
  | "KOTLIN"
  | "GO"
  | "PHP"
  | "RUBY"
  | "SWIFT"
  | "C"
  | "CPP"
  | "RUST"
  | "DART"
  | "OTHER";

type Classification = "EXCELENTE" | "BOM" | "REGULAR" | "RUIM";

export default function ExportCsvPage() {
  const [filterName, setFilterName] = useState("");
  const [filterLanguage, setFilterLanguage] = useState<Language | "">("");
  const [filterClassification, setFilterClassification] =
    useState<Classification | "">("");
  const [filterMinScore, setFilterMinScore] = useState<number | "">("");
  const [filterMaxScore, setFilterMaxScore] = useState<number | "">("");
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");

  const handleExport = async () => {
    try {
      const params = new URLSearchParams();

      if (filterName) params.append("projectName", filterName);
      if (filterLanguage) params.append("language", filterLanguage);
      if (filterClassification)
        params.append("classification", filterClassification);
      if (filterMinScore !== "")
        params.append("minScore", String(filterMinScore));
      if (filterMaxScore !== "")
        params.append("maxScore", String(filterMaxScore));
      if (filterStartDate) params.append("startDate", filterStartDate);
      if (filterEndDate) params.append("endDate", filterEndDate);

      const response = await fetch(
        `${API_URL}/api/evaluations/export/csv?${params.toString()}`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao exportar CSV");
      }

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "evaluations.csv";
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      alert("Erro ao exportar CSV");
    }
  };

  return (
    <>
      <Header evaluations={[]} averageScore={0} />

      <main className="container min-h-screen space-y-12">
        <div className="flex justify-end mb-6">
          <BackToHomeButton />
        </div>

        <div className="space-y-6">
          <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-violet-500/10 text-violet-400 border border-violet-500/20">
            Data Export & Relatórios
          </div>

          <h1 className="text-4xl font-bold leading-tight">
            Exportação de{" "}
            <span className="bg-gradient-to-r from-violet-400 to-sky-400 bg-clip-text text-transparent">
              Avaliações em CSV
            </span>
          </h1>

          <p className="text-slate-400 max-w-xl leading-relaxed">
            Gere relatórios personalizados aplicando filtros estratégicos.
          </p>

          <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
        </div>

        <EvaluationFilters
          filterName={filterName}
          setFilterName={setFilterName}
          filterLanguage={filterLanguage}
          setFilterLanguage={setFilterLanguage}
          filterClassification={filterClassification}
          setFilterClassification={setFilterClassification}
          filterMinScore={filterMinScore}
          setFilterMinScore={setFilterMinScore}
          filterMaxScore={filterMaxScore}
          setFilterMaxScore={setFilterMaxScore}
          filterStartDate={filterStartDate}
          setFilterStartDate={setFilterStartDate}
          filterEndDate={filterEndDate}
          setFilterEndDate={setFilterEndDate}
          onApply={handleExport}
          buttonLabel="Exportar CSV"
        />

        <Footer />
      </main>
    </>
  );
}
