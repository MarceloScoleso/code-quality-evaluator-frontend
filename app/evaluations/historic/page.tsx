"use client";
 
import { useEffect, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import BackToHomeButton from "../../components/BackToHomeButton";
import EvaluationFilters from "../../components/EvaluationFilters";
import { apiFetch } from "@/app/lib/api";
import Link from "next/link";
import { ChevronLeft, ChevronRight, GitBranch, FlaskConical } from "lucide-react";
 
type Language =
  | "JAVA" | "CSHARP" | "JAVASCRIPT" | "TYPESCRIPT" | "PYTHON"
  | "KOTLIN" | "GO" | "PHP" | "RUBY" | "SWIFT" | "C" | "CPP"
  | "RUST" | "DART" | "OTHER";
 
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
 
const classConfig: Record<Classification, { label: string; chip: string; bar: string; score: string }> = {
  EXCELENTE: {
    label: "Excelente",
    chip:  "text-green-400 bg-green-500/10 border-green-500/30",
    bar:   "bg-green-400",
    score: "text-green-400",
  },
  BOM: {
    label: "Bom",
    chip:  "text-sky-400 bg-sky-500/10 border-sky-500/30",
    bar:   "bg-sky-400",
    score: "text-sky-400",
  },
  REGULAR: {
    label: "Regular",
    chip:  "text-yellow-400 bg-yellow-500/10 border-yellow-500/30",
    bar:   "bg-yellow-400",
    score: "text-yellow-400",
  },
  RUIM: {
    label: "Ruim",
    chip:  "text-red-400 bg-red-500/10 border-red-500/30",
    bar:   "bg-red-400",
    score: "text-red-400",
  },
};
 
export default function EvaluationsPage() {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [page, setPage]               = useState(0);
  const [totalPages, setTotalPages]   = useState(0);
  const [loading, setLoading]         = useState(false);
 
  const [filterName, setFilterName]                     = useState("");
  const [filterLanguage, setFilterLanguage]             = useState<Language | "">("");
  const [filterClassification, setFilterClassification] = useState<Classification | "">("");
  const [filterMinScore, setFilterMinScore]             = useState<number | "">("");
  const [filterMaxScore, setFilterMaxScore]             = useState<number | "">("");
  const [filterStartDate, setFilterStartDate]           = useState("");
  const [filterEndDate, setFilterEndDate]               = useState("");
 
  const fetchEvaluations = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append("page", String(page));
      params.append("size", "6");
      if (filterName)           params.append("projectName",    filterName);
      if (filterLanguage)       params.append("language",       filterLanguage);
      if (filterClassification) params.append("classification", filterClassification);
      if (filterMinScore !== "") params.append("minScore",      String(filterMinScore));
      if (filterMaxScore !== "") params.append("maxScore",      String(filterMaxScore));
      if (filterStartDate)      params.append("startDate",      filterStartDate);
      if (filterEndDate)        params.append("endDate",        filterEndDate);
 
      const res = await apiFetch(`/api/evaluations/filter?${params.toString()}`);
      if (!res.ok) { setEvaluations([]); setTotalPages(0); return; }
 
      const data = await res.json();
      setEvaluations(Array.isArray(data?.content) ? data.content : []);
      setTotalPages(typeof data?.totalPages === "number" ? data.totalPages : 0);
    } catch {
      setEvaluations([]); setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };
 
  useEffect(() => { fetchEvaluations(); }, [page]);
 
  const handleFilter = () => { setPage(0); fetchEvaluations(); };
 
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Header />
 
      <main className="flex-1 pt-8 pb-20">
        <div className="max-w-6xl mx-auto px-6 space-y-8">
 
          {/* ── back ── */}
          <div className="flex justify-start">
            <BackToHomeButton />
          </div>
 
          {/* ── cabeçalho ── */}
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-sky-500/25 bg-sky-500/[0.08] text-[0.68rem] font-semibold tracking-[0.12em] uppercase text-sky-400 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
              Analytics & Monitoramento
            </div>
 
            <h1 className="font-extrabold text-[clamp(1.9rem,4vw,2.8rem)] leading-[1.1] tracking-[-0.025em] text-white mb-4">
              Histórico de{" "}
              <span className="bg-gradient-to-r from-sky-400 to-violet-400 bg-clip-text text-transparent">
                Avaliações Técnicas
              </span>
            </h1>
 
            <p className="text-[0.88rem] text-slate-400 leading-relaxed max-w-lg font-light">
              Explore avaliações realizadas, analise métricas de qualidade
              e acompanhe a evolução técnica dos projetos avaliados.
            </p>
 
            <div className="mt-6 h-px bg-gradient-to-r from-sky-500/20 via-slate-700/60 to-transparent" />
          </div>
 
          {/* ── filtros ── */}
          <EvaluationFilters
            filterName={filterName}             setFilterName={setFilterName}
            filterLanguage={filterLanguage}     setFilterLanguage={setFilterLanguage}
            filterClassification={filterClassification} setFilterClassification={setFilterClassification}
            filterMinScore={filterMinScore}     setFilterMinScore={setFilterMinScore}
            filterMaxScore={filterMaxScore}     setFilterMaxScore={setFilterMaxScore}
            filterStartDate={filterStartDate}   setFilterStartDate={setFilterStartDate}
            filterEndDate={filterEndDate}       setFilterEndDate={setFilterEndDate}
            onApply={handleFilter}
          />
 
          {/* ── cards ── */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 animate-pulse">
                  <div className="h-4 w-2/3 rounded bg-slate-800 mb-3" />
                  <div className="h-3 w-1/3 rounded bg-slate-800 mb-6" />
                  <div className="h-2 w-full rounded bg-slate-800 mb-2" />
                  <div className="h-2 w-4/5 rounded bg-slate-800" />
                </div>
              ))}
            </div>
          ) : evaluations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-4 text-2xl">
                🔍
              </div>
              <p className="text-slate-400 text-sm">Nenhuma avaliação encontrada.</p>
              <p className="text-slate-600 text-xs mt-1">Tente ajustar os filtros.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {evaluations.map((ev) => {
                const cfg = classConfig[ev.classification];
                return (
                  <Link key={ev.id} href={`/evaluations/historic/${ev.id}`} className="block group">
                    <div className="relative flex flex-col h-full rounded-2xl border border-slate-800 bg-slate-900/50 p-5 transition-all duration-300 group-hover:border-sky-500/35 group-hover:-translate-y-1 group-hover:shadow-[0_16px_40px_rgba(56,189,248,0.1)] overflow-hidden">
 
                      {/* glow no hover */}
                      <div className="absolute inset-0 bg-sky-500/[0.03] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none" />
 
                      {/* ── topo: nome + badge ── */}
                      <div className="flex items-start justify-between gap-3 mb-4 relative z-10">
                        <h2 className="font-bold text-[0.95rem] text-white leading-snug line-clamp-2 group-hover:text-sky-100 transition-colors duration-200">
                          {ev.projectName}
                        </h2>
                        <span className={`flex-shrink-0 text-[0.65rem] px-2.5 py-1 rounded-full font-bold border uppercase tracking-wide ${cfg.chip}`}>
                          {cfg.label}
                        </span>
                      </div>
 
                      {/* ── score bar ── */}
                      <div className="relative z-10 mb-4">
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="text-[0.68rem] text-slate-500 uppercase tracking-wider">Score</span>
                          <span className={`font-extrabold text-lg leading-none ${cfg.score}`}>
                            {ev.score}
                            <span className="text-slate-600 font-normal text-xs">/100</span>
                          </span>
                        </div>
                        <div className="h-1.5 rounded-full bg-white/[0.05] overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-700 ${cfg.bar}`}
                            style={{ width: `${ev.score}%` }}
                          />
                        </div>
                      </div>
 
                      {/* ── detalhes ── */}
                      <div className="relative z-10 flex items-center justify-between text-[0.78rem] text-slate-400 mb-4">
                        <span className="font-medium text-slate-300">{ev.language}</span>
                        <div className="flex gap-1.5">
                          {ev.hasTests && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[0.65rem] font-semibold bg-green-500/10 text-green-400 border border-green-500/20">
                              <FlaskConical size={10} />
                              Testes
                            </span>
                          )}
                          {ev.usesGit && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[0.65rem] font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20">
                              <GitBranch size={10} />
                              Git
                            </span>
                          )}
                        </div>
                      </div>
 
                      {/* ── rodapé ── */}
                      <div className="relative z-10 mt-auto pt-3 border-t border-slate-800 flex justify-between items-center text-[0.7rem] text-slate-600">
                        <span>{ev.analyzedBy}</span>
                        <span>{new Date(ev.createdAt).toLocaleDateString("pt-BR")}</span>
                      </div>
 
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
 
          {/* ── paginação ── */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 pt-4">
              <button
                disabled={page === 0}
                onClick={() => setPage((p) => p - 1)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border border-slate-800 text-slate-400 transition-all duration-200 hover:border-sky-500/40 hover:text-sky-300 hover:bg-sky-500/[0.06] disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={15} />
                Anterior
              </button>
 
              <span className="text-[0.78rem] text-slate-500 tabular-nums">
                <span className="text-slate-300 font-semibold">{page + 1}</span>
                {" "}/{" "}
                {totalPages}
              </span>
 
              <button
                disabled={page + 1 >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border border-slate-800 text-slate-400 transition-all duration-200 hover:border-sky-500/40 hover:text-sky-300 hover:bg-sky-500/[0.06] disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Próxima
                <ChevronRight size={15} />
              </button>
            </div>
          )}
 
        </div>
      </main>
 
      <Footer />
    </div>
  );
}