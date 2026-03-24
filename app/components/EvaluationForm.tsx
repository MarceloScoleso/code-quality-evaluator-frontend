"use client";
 
import { useState } from "react";
import { CheckCircle, XCircle, Loader2, CheckSquare, Square } from "lucide-react";
 
type Language =
  | "JAVA" | "CSHARP" | "JAVASCRIPT" | "TYPESCRIPT" | "PYTHON"
  | "KOTLIN" | "GO" | "PHP" | "RUBY" | "SWIFT" | "C" | "CPP"
  | "RUST" | "DART" | "OTHER";
 
export type EvaluationFormData = {
  projectName: string;
  language: Language;
  linesOfCode: number | "";
  complexity: number | "";
  hasTests: boolean;
  usesGit: boolean;
  analyzedBy: string;
  description: string;
};
 
type EvaluationFormProps = {
  initialData?: Partial<EvaluationFormData>;
  onSubmit: (data: EvaluationFormData) => Promise<void>;
  loading?: boolean;
  submitLabel?: string;
  success?: boolean;
  successMessage?: string;
  error?: string;
};
 
const languages: Language[] = [
  "JAVA","CSHARP","JAVASCRIPT","TYPESCRIPT","PYTHON",
  "KOTLIN","GO","PHP","RUBY","SWIFT","C","CPP","RUST","DART","OTHER",
];
 
/* ── rótulos legíveis para as linguagens ── */
const langLabel: Record<Language, string> = {
  JAVA: "Java", CSHARP: "C#", JAVASCRIPT: "JavaScript",
  TYPESCRIPT: "TypeScript", PYTHON: "Python", KOTLIN: "Kotlin",
  GO: "Go", PHP: "PHP", RUBY: "Ruby", SWIFT: "Swift",
  C: "C", CPP: "C++", RUST: "Rust", DART: "Dart", OTHER: "Outra",
};
 
/* ── classes compartilhadas ── */
const inputCls =
  "w-full rounded-xl px-4 py-3 bg-white/[0.03] border border-white/[0.08] text-slate-100 text-sm placeholder:text-slate-600 outline-none transition-all duration-200 focus:border-violet-500 focus:bg-violet-500/[0.05] focus:ring-2 focus:ring-violet-500/20";
 
const labelCls =
  "block text-[0.7rem] font-semibold tracking-[0.1em] uppercase text-slate-500 mb-2";
 
const sectionTitleCls =
  "flex items-center gap-2.5 text-[0.68rem] font-bold tracking-[0.14em] uppercase text-sky-400 before:block before:w-5 before:h-px before:bg-sky-400 mb-5";
 
export default function EvaluationForm({
  initialData,
  onSubmit,
  loading = false,
  submitLabel = "Gerar Avaliação Técnica",
  success = false,
  successMessage = "Avaliação criada com sucesso! Redirecionando...",
  error,
}: EvaluationFormProps) {
  const [projectName, setProjectName] = useState(initialData?.projectName ?? "");
  const [language, setLanguage]       = useState<Language>(initialData?.language ?? "JAVA");
  const [linesOfCode, setLinesOfCode] = useState<number | "">(initialData?.linesOfCode ?? "");
  const [complexity, setComplexity]   = useState<number | "">(initialData?.complexity ?? "");
  const [hasTests, setHasTests]       = useState(initialData?.hasTests ?? true);
  const [usesGit, setUsesGit]         = useState(initialData?.usesGit ?? true);
  const [analyzedBy, setAnalyzedBy]   = useState(initialData?.analyzedBy ?? "");
  const [description, setDescription] = useState(initialData?.description ?? "");
 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({ projectName, language, linesOfCode, complexity, hasTests, usesGit, analyzedBy, description });
  };
 
  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-white/[0.07] bg-gradient-to-b from-slate-900/80 to-slate-950/90 backdrop-blur-xl shadow-2xl p-8 space-y-9"
    >
 
      {/* ══ DADOS DO PROJETO ══ */}
      <div className="space-y-5">
        <div className={sectionTitleCls}>Dados do Projeto</div>
 
        <div>
          <label className={labelCls}>Nome do Projeto</label>
          <input
            type="text"
            placeholder="Ex: Quality Evaluator API"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            required
            className={inputCls}
          />
        </div>
 
        <div>
          <label className={labelCls}>Linguagem Principal</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as Language)}
            className={inputCls}
          >
            {languages.map((l) => (
              <option key={l} value={l} className="bg-slate-900">
                {langLabel[l]}
              </option>
            ))}
          </select>
        </div>
      </div>
 
      {/* ══ MÉTRICAS TÉCNICAS ══ */}
      <div className="space-y-5">
        <div className={sectionTitleCls}>Métricas Técnicas</div>
 
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className={labelCls}>Linhas de Código</label>
            <input
              type="number"
              placeholder="Ex: 350"
              value={linesOfCode}
              onChange={(e) => setLinesOfCode(e.target.value === "" ? "" : Number(e.target.value))}
              className={inputCls}
            />
            <p className="text-[0.72rem] text-slate-600 mt-1.5">Total estimado de linhas do projeto.</p>
          </div>
 
          <div>
            <label className={labelCls}>Complexidade (1 – 5)</label>
            <input
              type="number"
              min={1} max={5}
              placeholder="Ex: 3"
              value={complexity}
              onChange={(e) => setComplexity(e.target.value === "" ? "" : Number(e.target.value))}
              className={inputCls}
            />
            <p className="text-[0.72rem] text-slate-600 mt-1.5">1 = simples · 5 = altamente complexo</p>
          </div>
        </div>
      </div>
 
      {/* ══ BOAS PRÁTICAS ══ */}
      <div className="space-y-5">
        <div className={sectionTitleCls}>Boas Práticas</div>
 
        <div className="grid md:grid-cols-2 gap-4">
 
          {/* toggle testes */}
          <button
            type="button"
            onClick={() => setHasTests((v) => !v)}
            className={`group flex items-start gap-4 p-4 rounded-2xl border text-left transition-all duration-300 cursor-pointer
              ${hasTests
                ? "border-violet-500/40 bg-violet-500/[0.08] shadow-[0_0_20px_rgba(139,92,246,0.1)]"
                : "border-white/[0.06] bg-white/[0.02] hover:border-violet-500/25 hover:bg-violet-500/[0.04]"
              }`}
          >
            <div className={`mt-0.5 flex-shrink-0 transition-colors duration-200 ${hasTests ? "text-violet-400" : "text-slate-600"}`}>
              {hasTests ? <CheckSquare size={18} /> : <Square size={18} />}
            </div>
            <div>
              <p className={`text-sm font-semibold leading-none mb-1 transition-colors duration-200 ${hasTests ? "text-slate-100" : "text-slate-400"}`}>
                Testes Automatizados
              </p>
              <p className="text-[0.75rem] text-slate-500">Projeto possui cobertura de testes.</p>
            </div>
          </button>
 
          {/* toggle git */}
          <button
            type="button"
            onClick={() => setUsesGit((v) => !v)}
            className={`group flex items-start gap-4 p-4 rounded-2xl border text-left transition-all duration-300 cursor-pointer
              ${usesGit
                ? "border-sky-500/40 bg-sky-500/[0.08] shadow-[0_0_20px_rgba(56,189,248,0.1)]"
                : "border-white/[0.06] bg-white/[0.02] hover:border-sky-500/25 hover:bg-sky-500/[0.04]"
              }`}
          >
            <div className={`mt-0.5 flex-shrink-0 transition-colors duration-200 ${usesGit ? "text-sky-400" : "text-slate-600"}`}>
              {usesGit ? <CheckSquare size={18} /> : <Square size={18} />}
            </div>
            <div>
              <p className={`text-sm font-semibold leading-none mb-1 transition-colors duration-200 ${usesGit ? "text-slate-100" : "text-slate-400"}`}>
                Versionamento com Git
              </p>
              <p className="text-[0.75rem] text-slate-500">Controle de versão estruturado.</p>
            </div>
          </button>
 
        </div>
      </div>
 
      {/* ══ RESPONSÁVEL ══ */}
      <div>
        <div className={sectionTitleCls}>Responsável</div>
        <input
          type="text"
          placeholder="Ex: Marcelo"
          value={analyzedBy}
          onChange={(e) => setAnalyzedBy(e.target.value)}
          className={inputCls}
        />
      </div>
 
      {/* ══ DESCRIÇÃO ══ */}
      <div>
        <div className={sectionTitleCls}>Descrição do Projeto</div>
        <textarea
          placeholder="Ex: Projeto que avalia a qualidade de APIs..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className={`${inputCls} resize-none`}
        />
        <p className="text-[0.72rem] text-slate-600 mt-1.5">
          Opcional — caso não preencha, o sistema irá gerar automaticamente.
        </p>
      </div>
 
      {/* ══ SUBMIT ══ */}
      <div className="pt-2 space-y-4">
        <button
          type="submit"
          disabled={loading}
          className="relative w-full inline-flex items-center justify-center gap-2.5 overflow-hidden px-6 py-3.5 rounded-xl font-bold text-[0.9rem] text-white bg-gradient-to-br from-violet-500 to-indigo-500 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed hover:enabled:-translate-y-0.5 hover:enabled:shadow-[0_12px_32px_rgba(139,92,246,0.45)] before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/15 before:to-transparent before:-translate-x-full before:transition-transform before:duration-500 hover:enabled:before:translate-x-full"
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Processando...
            </>
          ) : (
            submitLabel
          )}
        </button>
 
        {/* feedback de sucesso */}
        {success && (
          <div className="flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl border border-green-500/30 bg-green-500/[0.08] text-green-400 text-sm font-medium animate-pulse">
            <CheckCircle size={16} />
            {successMessage}
          </div>
        )}
 
        {/* feedback de erro */}
        {error && (
          <div className="flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl border border-red-500/30 bg-red-500/[0.08] text-red-400 text-sm font-medium">
            <XCircle size={16} />
            {error}
          </div>
        )}
      </div>
 
    </form>
  );
}