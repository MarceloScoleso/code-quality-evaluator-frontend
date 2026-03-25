"use client";
 
import { useState } from "react";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import BackToHomeButton from "@/app/components/BackToHomeButton";
import EvaluationFilters from "@/app/components/EvaluationFilters";
import { apiFetch } from "@/app/lib/api";
import { Download, FileText, CheckCircle } from "lucide-react";
 
type Language =
  | "JAVA" | "CSHARP" | "JAVASCRIPT" | "TYPESCRIPT" | "PYTHON"
  | "KOTLIN" | "GO" | "PHP" | "RUBY" | "SWIFT" | "C" | "CPP"
  | "RUST" | "DART" | "OTHER";
 
type Classification = "EXCELENTE" | "BOM" | "REGULAR" | "RUIM";
 
interface Evaluation {
  id: number; projectName: string; language: Language;
  score: number; classification: Classification;
  analyzedBy: string; createdAt: string;
  hasTests: boolean; usesGit: boolean;
}
 
const csvColumns = [
  { label: "ID",            desc: "Identificador único" },
  { label: "Projeto",       desc: "Nome do projeto" },
  { label: "Linguagem",     desc: "Linguagem principal" },
  { label: "Score",         desc: "Pontuação de 0 a 100" },
  { label: "Classificação", desc: "EXCELENTE / BOM / REGULAR / RUIM" },
  { label: "Analisado Por", desc: "Responsável pela análise" },
  { label: "Data",          desc: "Data de criação" },
  { label: "Testes",        desc: "Possui testes automatizados" },
  { label: "Git",           desc: "Usa controle de versão" },
];
 
export default function ExportCsvPage() {
  const [loading, setLoading]       = useState(false);
  const [exported, setExported]     = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
 
  const [filterName, setFilterName]                     = useState("");
  const [filterLanguage, setFilterLanguage]             = useState<Language | "">("");
  const [filterClassification, setFilterClassification] = useState<Classification | "">("");
  const [filterMinScore, setFilterMinScore]             = useState<number | "">("");
  const [filterMaxScore, setFilterMaxScore]             = useState<number | "">("");
  const [filterStartDate, setFilterStartDate]           = useState("");
  const [filterEndDate, setFilterEndDate]               = useState("");
 
  const fetchFilteredEvaluations = async () => {
    const params = new URLSearchParams();
    params.append("page", "0");
    params.append("size", "1000");
    if (filterName)           params.append("projectName",    filterName);
    if (filterLanguage)       params.append("language",       filterLanguage);
    if (filterClassification) params.append("classification", filterClassification);
    if (filterMinScore !== "") params.append("minScore",      String(filterMinScore));
    if (filterMaxScore !== "") params.append("maxScore",      String(filterMaxScore));
    if (filterStartDate)      params.append("startDate",      filterStartDate);
    if (filterEndDate)        params.append("endDate",        filterEndDate);
 
    const res = await apiFetch(`/api/evaluations/filter?${params.toString()}`);
    if (!res.ok) throw new Error("Erro ao buscar avaliações");
    const data = await res.json();
    return Array.isArray(data?.content) ? data.content : [];
  };
 
  const handleExport = async () => {
    try {
      setLoading(true);
      setExported(false);
      setExportError(null);
 
      const evaluations: Evaluation[] = await fetchFilteredEvaluations();
 
      if (evaluations.length === 0) {
        setExportError("Nenhuma avaliação encontrada com os filtros aplicados.");
        return;
      }
 
      const headers = ["ID","Projeto","Linguagem","Score","Classificação","Analisado Por","Data","Testes","Git"];
      const rows = evaluations.map((ev) => [
        ev.id, ev.projectName, ev.language, ev.score, ev.classification,
        ev.analyzedBy,
        new Date(ev.createdAt).toLocaleDateString("pt-BR"),
        ev.hasTests ? "Sim" : "Não",
        ev.usesGit  ? "Sim" : "Não",
      ]);
 
      const csvContent = [headers, ...rows].map((r) => r.join(",")).join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url  = window.URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href = url; a.download = "evaluations.csv";
      document.body.appendChild(a); a.click(); a.remove();
      window.URL.revokeObjectURL(url);
      setExported(true);
      setTimeout(() => setExported(false), 4000);
    } catch {
      setExportError("Erro ao exportar CSV. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Header />
 
      <main className="flex-1 pt-8 pb-20">
        <div className="max-w-4xl mx-auto px-6 space-y-8">
 
          {/* ── back ── */}
          <BackToHomeButton />
 
          {/* ── cabeçalho ── */}
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-green-500/25 bg-green-500/[0.08] text-[0.68rem] font-semibold tracking-[0.12em] uppercase text-green-400 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              Data Export & Relatórios
            </div>
 
            <h1 className="font-extrabold text-[clamp(1.9rem,4vw,2.8rem)] leading-[1.1] tracking-[-0.025em] text-white mb-4">
              Exportação de{" "}
              <span className="bg-gradient-to-r from-green-400 to-sky-400 bg-clip-text text-transparent">
                Avaliações em CSV
              </span>
            </h1>
 
            <p className="text-[0.88rem] text-slate-400 leading-relaxed max-w-lg font-light">
              Gere relatórios personalizados aplicando filtros estratégicos.
              O arquivo gerado contém todos os campos relevantes de cada avaliação.
            </p>
 
            <div className="mt-6 h-px bg-gradient-to-r from-green-500/20 via-slate-700/60 to-transparent" />
          </div>
 
          {/* ── info card sobre o CSV ── */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 overflow-hidden">
 
            {/* header */}
            <div className="flex items-center gap-3 px-5 py-3.5 bg-white/[0.02] border-b border-slate-800">
              <div className="w-8 h-8 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center flex-shrink-0">
                <FileText size={15} className="text-green-400" />
              </div>
              <div>
                <p className="text-[0.82rem] font-semibold text-slate-200">evaluations.csv</p>
                <p className="text-[0.68rem] text-slate-600">{csvColumns.length} colunas exportadas</p>
              </div>
              {/* dots decorativos */}
              <div className="ml-auto flex gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500/60" />
                <span className="w-2 h-2 rounded-full bg-yellow-500/60" />
                <span className="w-2 h-2 rounded-full bg-green-500/60" />
              </div>
            </div>
 
            {/* colunas */}
            <div className="px-5 py-4 grid grid-cols-2 sm:grid-cols-3 gap-2">
              {csvColumns.map((col) => (
                <div key={col.label} className="flex items-start gap-2">
                  <CheckCircle size={12} className="text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[0.75rem] font-semibold text-slate-300 leading-none mb-0.5">{col.label}</p>
                    <p className="text-[0.65rem] text-slate-600 leading-tight">{col.desc}</p>
                  </div>
                </div>
              ))}
            </div>
 
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
            onApply={handleExport}
            buttonLabel="Exportar CSV"
          />
 
          {/* ── botão principal de exportação ── */}
          <div className="flex flex-col items-center gap-4">
            <button
              onClick={handleExport}
              disabled={loading}
              className="relative inline-flex items-center gap-2.5 overflow-hidden px-8 py-3.5 rounded-xl font-bold text-[0.9rem] text-white bg-gradient-to-br from-green-500 to-emerald-600 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed hover:enabled:-translate-y-0.5 hover:enabled:shadow-[0_12px_32px_rgba(34,197,94,0.4)] before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/15 before:to-transparent before:-translate-x-full before:transition-transform before:duration-500 hover:enabled:before:translate-x-full"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                  Gerando arquivo...
                </>
              ) : (
                <>
                  <Download size={16} />
                  Baixar CSV completo
                </>
              )}
            </button>
 
            {/* feedback sucesso */}
            {exported && (
              <div className="flex items-center gap-2.5 px-5 py-2.5 rounded-xl border border-green-500/30 bg-green-500/[0.08] text-green-400 text-sm font-medium animate-pulse">
                <CheckCircle size={15} />
                Arquivo exportado com sucesso!
              </div>
            )}
 
            {/* feedback erro */}
            {exportError && (
              <div className="flex items-center gap-2.5 px-5 py-2.5 rounded-xl border border-red-500/30 bg-red-500/[0.08] text-red-400 text-sm font-medium">
                <span className="text-base">⚠</span>
                {exportError}
              </div>
            )}
 
            <p className="text-[0.72rem] text-slate-600 text-center max-w-xs">
              Use os filtros acima para exportar apenas os dados que você precisa.
              Sem filtros, todas as avaliações serão incluídas.
            </p>
          </div>
 
        </div>
      </main>
 
      <Footer />
    </div>
  );
}