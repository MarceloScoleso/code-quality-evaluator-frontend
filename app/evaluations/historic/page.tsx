"use client";

import { useEffect, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import BackToHomeButton from "../../components/BackToHomeButton";
import EvaluationFilters from "../../components/EvaluationFilters";
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

      if (filterMinScore !== "")
        params.append("minScore", String(filterMinScore));
      if (filterMaxScore !== "")
        params.append("maxScore", String(filterMaxScore));
      if (filterStartDate) params.append("startDate", filterStartDate);
      if (filterEndDate) params.append("endDate", filterEndDate);

      const res = await apiFetch(
        `/api/evaluations/filter?${params.toString()}`
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

          {/* LISTAGEM + PAGINAÇÃO */}
          {loading ? (
            <div className="text-center text-slate-400">
              Carregando avaliações...
            </div>
          ) : (
            <div className="cards-grid">
              {evaluations.map((ev) => (
                <div
                  key={ev.id}
                  className="rounded-2xl bg-slate-900/70 backdrop-blur-sm border border-slate-700/50 p-6 hover:border-sky-500/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-sky-500/10"
                >
                  {/* HEADER */}
                  <div className="flex items-start justify-between mb-4">
                    <h2 className="text-lg font-semibold text-white">
                      {ev.projectName}
                    </h2>

                    <span
                      className={`text-xs px-3 py-1 rounded-full font-medium border ${
                        ev.classification === "EXCELENTE"
                          ? "bg-green-500/15 text-green-400 border-green-500/30"
                          : ev.classification === "BOM"
                          ? "bg-blue-500/15 text-blue-400 border-blue-500/30"
                          : ev.classification === "REGULAR"
                          ? "bg-yellow-500/15 text-yellow-400 border-yellow-500/30"
                          : "bg-red-500/15 text-red-400 border-red-500/30"
                      }`}
                    >
                      {ev.classification}
                    </span>
                  </div>

                  {/* DIVIDER */}
                  <div className="h-px bg-slate-700/50 mb-4" />

                  {/* BODY */}
                  <div className="space-y-3 text-sm text-slate-300">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Linguagem</span>
                      <span className="font-medium text-white">{ev.language}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Score</span>
                      <span className="text-white font-semibold">
                        {ev.score}
                        <span className="text-slate-500 font-normal">/100</span>
                      </span>
                    </div>

                    <div className="flex gap-2 pt-2">
                      {ev.hasTests && (
                        <span className="text-xs px-2 py-1 bg-green-500/10 text-green-400 rounded-md border border-green-500/20">
                          ✔ Testes
                        </span>
                      )}
                      {ev.usesGit && (
                        <span className="text-xs px-2 py-1 bg-blue-500/10 text-blue-400 rounded-md border border-blue-500/20">
                          ✔ Git
                        </span>
                      )}
                    </div>

                    <div className="pt-3 border-t border-slate-800 text-xs text-slate-500 flex justify-between">
                      <span>{ev.analyzedBy}</span>
                      <span>{new Date(ev.createdAt).toLocaleDateString("pt-BR")}</span>
                    </div>
                  </div>
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