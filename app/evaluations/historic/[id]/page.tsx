"use client";
 
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import BackToHomeButton from "@/app/components/BackToHomeButton";
import { apiFetch } from "@/app/lib/api";
import {
  Pencil, Trash2, FlaskConical, GitBranch,
  Code2, Zap, Hash, CalendarDays, User,
} from "lucide-react";
import { useTranslation } from "react-i18next";
 
type Language =
  | "JAVA" | "CSHARP" | "JAVASCRIPT" | "TYPESCRIPT" | "PYTHON"
  | "KOTLIN" | "GO" | "PHP" | "RUBY" | "SWIFT" | "C" | "CPP" | "RUST" | "DART" | "OTHER";
 
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
  linesOfCode: number;
  complexity: number;
  description?: string;
}
 
const classConfig: Record<Classification, { chip: string; bar: string; glow: string; score: string }> = {
  EXCELENTE: { chip: "text-green-400 bg-green-500/10 border-green-500/30",  bar: "from-green-500 to-emerald-400",  glow: "shadow-[0_0_40px_rgba(34,197,94,0.15)]",   score: "from-green-400 to-emerald-300"  },
  BOM:       { chip: "text-sky-400   bg-sky-500/10   border-sky-500/30",    bar: "from-sky-500   to-blue-400",     glow: "shadow-[0_0_40px_rgba(56,189,248,0.15)]",  score: "from-sky-400   to-blue-300"     },
  REGULAR:   { chip: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30", bar: "from-yellow-500 to-amber-400", glow: "shadow-[0_0_40px_rgba(250,204,21,0.15)]",  score: "from-yellow-400 to-amber-300"   },
  RUIM:      { chip: "text-red-400   bg-red-500/10   border-red-500/30",    bar: "from-red-500   to-rose-400",     glow: "shadow-[0_0_40px_rgba(239,68,68,0.15)]",   score: "from-red-400   to-rose-300"     },
};
 
export default function EvaluationDetailPage() {
  const { t } = useTranslation();
  const { id }   = useParams();
  const router   = useRouter();
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [loading, setLoading]       = useState(true);
  const [deleting, setDeleting]     = useState(false);
 
  const complexityLabels = t("evaluationDetail.complexityLabels", { returnObjects: true }) as string[];
 
  useEffect(() => {
    apiFetch(`/api/evaluations/${id}`)
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then(setEvaluation)
      .catch(() => router.push("/evaluations/historic"))
      .finally(() => setLoading(false));
  }, [id]);
 
  const handleDelete = async () => {
    if (!window.confirm(t("common.confirmDelete"))) return;
    try {
      setDeleting(true);
      const res = await apiFetch(`/api/evaluations/${evaluation?.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      router.push("/evaluations/historic");
    } catch {
      alert(t("common.deleteError"));
    } finally {
      setDeleting(false);
    }
  };
 
  /* ── estados de carregamento ── */
  if (loading || !evaluation) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-950">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex items-center gap-3 text-slate-400 text-sm">
            <span className="w-4 h-4 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
            {t("common.loadingEval")}
          </div>
        </div>
      </div>
    );
  }
 
  const cfg = classConfig[evaluation.classification];
 
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Header />
 
      <main className="flex-1 pt-8 pb-20">
        <div className="max-w-5xl mx-auto px-6 space-y-8">
 
          {/* ── topbar: back + ações ── */}
          <div className="flex items-center justify-between gap-4">
            <BackToHomeButton />
            <div className="flex items-center gap-2">
              <button
                onClick={() => router.push(`/evaluations/historic/${evaluation.id}/edit`)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-[0.82rem] font-semibold border border-sky-500/30 text-sky-400 bg-sky-500/[0.08] transition-all duration-200 hover:-translate-y-0.5 hover:bg-sky-500/[0.15] hover:border-sky-400 hover:shadow-[0_8px_20px_rgba(56,189,248,0.2)]"
              >
                <Pencil size={13} />
                {t("common.edit")}
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-[0.82rem] font-semibold border border-red-500/30 text-red-400 bg-red-500/[0.08] transition-all duration-200 hover:-translate-y-0.5 hover:bg-red-500/[0.15] hover:border-red-400 hover:shadow-[0_8px_20px_rgba(239,68,68,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Trash2 size={13} />
                {deleting ? t("common.deleting") : t("common.delete")}
              </button>
            </div>
          </div>
 
          {/* ══ HERO ══ */}
          <div className="relative rounded-3xl border border-slate-800 overflow-hidden">
 
            {/* fundo */}
            <div className="absolute inset-0 bg-gradient-to-br from-violet-950/40 via-slate-900 to-slate-950" />
            <div
              className="absolute inset-0 pointer-events-none opacity-30"
              style={{
                backgroundImage: "radial-gradient(rgba(139,92,246,0.1) 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
            />
            <div
              className="absolute -top-20 -left-20 w-80 h-80 rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(139,92,246,0.18) 0%, transparent 65%)" }}
            />
 
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 p-8 lg:p-10">
 
              {/* info esquerda */}
              <div className="flex-1">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[0.65rem] font-bold uppercase tracking-wide border mb-4 ${cfg.chip}`}>
                  {t(`history.classification.${evaluation.classification}`)}
                </span>
 
                <h1 className="font-extrabold text-[clamp(1.6rem,4vw,2.6rem)] leading-[1.1] tracking-[-0.025em] text-white mb-3">
                  {evaluation.projectName}
                </h1>
 
                <div className="flex flex-wrap items-center gap-4 text-[0.8rem] text-slate-400">
                  <span className="inline-flex items-center gap-1.5">
                    <User size={13} />
                    {evaluation.analyzedBy}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays size={13} />
                    {new Date(evaluation.createdAt).toLocaleDateString()}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Code2 size={13} />
                    {evaluation.language}
                  </span>
                </div>
 
                <p className="mt-4 text-[0.85rem] text-slate-500 leading-relaxed max-w-lg font-light">
                  {t("evaluationDetail.eyebrow")}
                </p>
              </div>
 
              {/* score ring direita */}
              <div className={`flex-shrink-0 flex flex-col items-center justify-center rounded-2xl border border-slate-700/60 bg-slate-900/60 backdrop-blur-xl p-8 ${cfg.glow}`}>
                <span className="text-[0.65rem] font-semibold tracking-[0.1em] uppercase text-slate-500 mb-1">
                  {t("evaluationDetail.scoreFinal")}
                </span>
                <div
                  className="w-28 h-28 rounded-full flex flex-col items-center justify-center my-2"
                  style={{
                    border: "3px solid transparent",
                    background: "linear-gradient(#0F172A, #0F172A) padding-box, linear-gradient(135deg, #8B5CF6, #38BDF8) border-box",
                  }}
                >
                  <span className={`font-extrabold text-[2.5rem] leading-none bg-gradient-to-br ${cfg.score} bg-clip-text text-transparent`}>
                    {evaluation.score}
                  </span>
                  <span className="text-[0.55rem] tracking-widest uppercase text-slate-600 mt-0.5">/ 100</span>
                </div>
                {/* barra de progresso */}
                <div className="w-32 h-1.5 rounded-full bg-white/[0.05] overflow-hidden mt-1">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${cfg.bar} transition-all duration-1000`}
                    style={{ width: `${evaluation.score}%` }}
                  />
                </div>
              </div>
 
            </div>
          </div>
 
          {/* ══ GRID PRINCIPAL ══ */}
          <div className="grid lg:grid-cols-[1fr_1.1fr] gap-6">
 
            {/* ── card: detalhes técnicos ── */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 space-y-5">
              <div className="flex items-center gap-2.5 text-[0.68rem] font-bold tracking-[0.14em] uppercase text-sky-400 before:block before:w-5 before:h-px before:bg-sky-400">
                {t("evaluationDetail.technicalDetails")}
              </div>
 
              <div className="space-y-4">
                {[
                  { icon: <Code2 size={14} />,       label: t("evaluationDetail.language"),    value: evaluation.language },
                  { icon: <Hash size={14} />,         label: t("evaluationDetail.linesOfCode"), value: evaluation.linesOfCode.toLocaleString() },
                  {
                    icon: <Zap size={14} />,
                    label: t("evaluationDetail.complexity"),
                    value: `${evaluation.complexity}/5 — ${complexityLabels[evaluation.complexity] ?? ""}`,
                  },
                  { icon: <CalendarDays size={14} />, label: t("evaluationDetail.date"),        value: new Date(evaluation.createdAt).toLocaleDateString() },
                  { icon: <User size={14} />,         label: t("evaluationDetail.responsible"), value: evaluation.analyzedBy },
                ].map((row) => (
                  <div key={row.label} className="flex items-start justify-between gap-4 py-2.5 border-b border-slate-800/80 last:border-0">
                    <div className="flex items-center gap-2 text-slate-500 flex-shrink-0">
                      {row.icon}
                      <span className="text-[0.75rem] font-medium">{row.label}</span>
                    </div>
                    <span className="text-[0.82rem] font-semibold text-slate-200 text-right">{row.value}</span>
                  </div>
                ))}
              </div>
 
              {/* badges de boas práticas */}
              <div className="flex flex-wrap gap-2 pt-1">
                {evaluation.hasTests ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[0.75rem] font-semibold bg-green-500/10 text-green-400 border border-green-500/20">
                    <FlaskConical size={12} />
                    {t("evaluationDetail.hasTests")}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[0.75rem] font-semibold bg-slate-800 text-slate-500 border border-slate-700">
                    <FlaskConical size={12} />
                    {t("evaluationDetail.noTests")}
                  </span>
                )}
                {evaluation.usesGit ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[0.75rem] font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20">
                    <GitBranch size={12} />
                    {t("evaluationDetail.usesGit")}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[0.75rem] font-semibold bg-slate-800 text-slate-500 border border-slate-700">
                    <GitBranch size={12} />
                    {t("evaluationDetail.noGit")}
                  </span>
                )}
              </div>
            </div>
 
            {/* ── card: descrição ── */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 space-y-5 flex flex-col">
              <div className="flex items-center gap-2.5 text-[0.68rem] font-bold tracking-[0.14em] uppercase text-violet-400 before:block before:w-5 before:h-px before:bg-violet-400">
                {t("evaluationDetail.description")}
              </div>
 
              <div className="flex-1 rounded-xl border border-white/[0.05] bg-white/[0.02] p-5 text-[0.85rem] text-slate-300 leading-relaxed font-light">
                {evaluation.description || (
                  <span className="text-slate-600 italic">
                    {t("evaluationDetail.noDescription")}
                  </span>
                )}
              </div>
 
              {/* mini métricas */}
              <div className="grid grid-cols-3 gap-3 pt-1">
                {[
                  { label: t("evaluationDetail.lines"),      value: evaluation.linesOfCode, color: "text-violet-400", dim: "bg-violet-500/10 border-violet-500/20" },
                  { label: t("evaluationDetail.complexity"), value: `${evaluation.complexity}/5`, color: "text-sky-400", dim: "bg-sky-500/10 border-sky-500/20" },
                  { label: t("evaluationDetail.score"),      value: evaluation.score,       color: "text-green-400",  dim: "bg-green-500/10 border-green-500/20"  },
                ].map((m) => (
                  <div key={m.label} className={`flex flex-col items-center justify-center py-3 px-2 rounded-xl border ${m.dim} text-center`}>
                    <span className={`font-extrabold text-xl leading-none ${m.color}`}>{m.value}</span>
                    <span className="text-[0.62rem] font-medium tracking-wider uppercase text-slate-600 mt-1">{m.label}</span>
                  </div>
                ))}
              </div>
            </div>
 
          </div>
 
        </div>
      </main>
 
      <Footer />
    </div>
  );
}