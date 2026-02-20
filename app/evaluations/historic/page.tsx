"use client";

import { useEffect, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import BackToHomeButton from "../../components/BackToHomeButton";
import EvaluationFilters from "../../components/EvaluationFilters";
import { API_URL } from "../../config/api";

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

interface PageResponse {
  content: Evaluation[];
  totalPages: number;
  totalElements: number;
  number: number;
}

export default function EvaluationsPage() {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
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

  const fetchEvaluations = async () => {
  try {
    setLoading(true);

    const params = new URLSearchParams();
    params.append("page", String(page));
    params.append("size", "6");

    if (filterName) params.append("projectName", filterName);
    if (filterLanguage) params.append("language", filterLanguage);
    if (filterClassification)
      params.append("classification", filterClassification);

    if (filterMinScore !== "") params.append("minScore", String(filterMinScore));
    if (filterMaxScore !== "") params.append("maxScore", String(filterMaxScore));
    if (filterStartDate) params.append("startDate", filterStartDate);
    if (filterEndDate) params.append("endDate", filterEndDate);

    const res = await fetch(
      `${API_URL}/api/evaluations/filter?${params.toString()}`
    );

    if (!res.ok) {
      console.error("Erro na API:", res.status);
      setEvaluations([]);
      setTotalPages(0);
      return;
    }

    const data = await res.json();

    setEvaluations(Array.isArray(data?.content) ? data.content : []);
    setTotalPages(typeof data?.totalPages === "number" ? data.totalPages : 0);

  } catch (error) {
    console.error("Erro ao buscar avaliações:", error);
    setEvaluations([]);
    setTotalPages(0);
  } finally {
    setLoading(false);
  }
};
useEffect(() => {
  fetchEvaluations();
}, [page]);
  const handleFilter = () => {
    setPage(0);
    fetchEvaluations();
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

          <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-sky-500/10 text-sky-400 border border-sky-500/20">
            Analytics & Monitoramento
          </div>

          <h1 className="text-4xl font-bold leading-tight">
            Histórico de{" "}
            <span className="bg-gradient-to-r from-sky-400 to-violet-400 bg-clip-text text-transparent">
              Avaliações Técnicas
            </span>
          </h1>

          <p className="text-slate-400 max-w-xl leading-relaxed">
            Explore avaliações realizadas, analise métricas de qualidade
            e acompanhe a evolução técnica dos projetos avaliados.
          </p>

          <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />

        </div>

        {/* FILTROS */}
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
          onApply={handleFilter}
        />

        {/* LISTAGEM + PAGINAÇÃO (mantém exatamente como já está) */}

        {loading ? (
          <div className="text-center text-slate-400">
            Carregando avaliações...
          </div>
        ) : (
          <div className="cards-grid">
            {Array.isArray(evaluations) &&
              evaluations.map((ev) => (
                <div key={ev.id} className="card">
                  {/* conteúdo do card igual */}
                </div>
              ))}
          </div>
        )}

        <div className="flex justify-center gap-4 items-center mt-10">
          <button
            disabled={page === 0}
            onClick={() => setPage((prev) => prev - 1)}
            className="secondary-cta disabled:opacity-40"
          >
            ← Anterior
          </button>

          <span className="text-slate-400 text-sm">
            Página {page + 1} de {totalPages}
          </span>

          <button
            disabled={page + 1 >= totalPages}
            onClick={() => setPage((prev) => prev + 1)}
            className="secondary-cta disabled:opacity-40"
          >
            Próxima →
          </button>
        </div>

      </div>
    </main>

    <Footer />

  </div>
);
}
