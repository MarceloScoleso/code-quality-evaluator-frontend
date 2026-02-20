"use client";

import { useState } from "react";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import BackToHomeButton from "@/app/components/BackToHomeButton";
import EvaluationFilters from "@/app/components/EvaluationFilters";
import { apiFetch } from "@/app/lib/api";

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

interface Evaluation {
  id: number;
  projectName: string;
  language: Language;
  score: number;
  classification: Classification;
  analyzedBy: string;
  createdAt: string;
  hasTests: boolean;
  usesGit: boolean;
}

export default function ExportCsvPage() {
  const [loading, setLoading] = useState(false);

  // filtros
  const [filterName, setFilterName] = useState("");
  const [filterLanguage, setFilterLanguage] = useState<Language | "">("");
  const [filterClassification, setFilterClassification] =
    useState<Classification | "">("");
  const [filterMinScore, setFilterMinScore] = useState<number | "">("");
  const [filterMaxScore, setFilterMaxScore] = useState<number | "">("");
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");

  // função que busca as avaliações filtradas
  const fetchFilteredEvaluations = async () => {
    const params = new URLSearchParams();
    params.append("page", "0"); // primeira página
    params.append("size", "1000"); // limite grande para exportação

    if (filterName) params.append("projectName", filterName);
    if (filterLanguage) params.append("language", filterLanguage);
    if (filterClassification)
      params.append("classification", filterClassification);
    if (filterMinScore !== "") params.append("minScore", String(filterMinScore));
    if (filterMaxScore !== "") params.append("maxScore", String(filterMaxScore));
    if (filterStartDate) params.append("startDate", filterStartDate);
    if (filterEndDate) params.append("endDate", filterEndDate);

    const res = await apiFetch(`/api/evaluations/filter?${params.toString()}`);
    if (!res.ok) throw new Error("Erro ao buscar avaliações");
    const data = await res.json();
    return Array.isArray(data?.content) ? data.content : [];
  };

  const handleExport = async () => {
    try {
      setLoading(true);
      const evaluations = await fetchFilteredEvaluations();

      if (evaluations.length === 0) {
        alert("Não há avaliações para exportar com os filtros aplicados.");
        return;
      }

      // gerando CSV
      const headers = [
        "ID",
        "Projeto",
        "Linguagem",
        "Score",
        "Classificação",
        "Analisado Por",
        "Data",
        "Testes",
        "Git",
      ];

      const rows = evaluations.map((ev: { id: any; projectName: any; language: any; score: any; classification: any; analyzedBy: any; createdAt: string | number | Date; hasTests: any; usesGit: any; }) => [
        ev.id,
        ev.projectName,
        ev.language,
        ev.score,
        ev.classification,
        ev.analyzedBy,
        new Date(ev.createdAt).toLocaleDateString("pt-BR"),
        ev.hasTests ? "✔" : "",
        ev.usesGit ? "✔" : "",
      ]);

      const csvContent =
        [headers, ...rows].map((r) => r.join(",")).join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950">
      <Header />
      <main className="flex-1">
        <div className="container">
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
        </div>
      </main>
      <Footer />
    </div>
  );
}