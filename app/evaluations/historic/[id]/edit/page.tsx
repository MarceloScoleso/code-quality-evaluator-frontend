"use client";
 
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import EvaluationForm, {
  EvaluationFormData,
} from "@/app/components/EvaluationForm";
import { apiFetch } from "@/app/lib/api";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
 
export default function EditEvaluationPage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const router = useRouter();
 
  const [initialData, setInitialData] = useState<
    Partial<EvaluationFormData> | undefined
  >(undefined);
 
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
 
  /* ── buscar avaliação ── */
  useEffect(() => {
    const fetchEvaluation = async () => {
      try {
        const response = await apiFetch(`/api/evaluations/${id}`);
 
        if (!response.ok) throw new Error();
 
        const data = await response.json();
 
        setInitialData({
          projectName: data.projectName,
          language: data.language,
          linesOfCode: data.linesOfCode,
          complexity: data.complexity,
          hasTests: data.hasTests,
          usesGit: data.usesGit,
          analyzedBy: data.analyzedBy,
          description: data.description,
        });
 
      } catch (err) {
        console.error(err);
        setError(t("editEvaluation.errorLoad"));
      } finally {
        setFetching(false);
      }
    };
 
    if (id) fetchEvaluation();
  }, [id]);
 
  /* ── update ── */
  const handleUpdate = async (data: EvaluationFormData) => {
    setLoading(true);
    setSuccess(false);
    setError(undefined);
 
    try {
      const response = await apiFetch(`/api/evaluations/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
 
      if (!response.ok) throw new Error();
 
      setSuccess(true);
      setTimeout(() => router.push("/evaluations"), 1500);
 
    } catch (err) {
      console.error(err);
      setError(t("editEvaluation.errorUpdate"));
    } finally {
      setLoading(false);
    }
  };
 
  /* ── loading ── */
  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-400">
        <span className="w-4 h-4 mr-3 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
        {t("common.loadingEval")}
      </div>
    );
  }
 
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Header />
 
      <main className="flex-1 pt-8 pb-20">
        <div className="max-w-2xl mx-auto px-6">
 
          {/* ── botão voltar ── */}
          <div className="mb-8 mt-2">
            <button
              onClick={() => router.push("/evaluations")}
              className="group inline-flex items-center gap-2 text-[0.82rem] font-medium text-slate-500 hover:text-slate-200 transition-colors duration-200"
            >
              <span className="w-7 h-7 rounded-lg border border-slate-800 bg-slate-900/60 flex items-center justify-center transition-all duration-200 group-hover:border-violet-500/40 group-hover:bg-violet-500/[0.08] group-hover:-translate-x-0.5">
                <ArrowLeft size={13} />
              </span>
              {t("common.backToHome")}
            </button>
          </div>
 
          {/* ── header ── */}
          <div className="mb-10">
 
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-violet-500/25 bg-violet-500/[0.08] text-[0.68rem] font-semibold tracking-[0.12em] uppercase text-violet-400 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
              {t("editEvaluation.eyebrow")}
            </div>
 
            <h1 className="font-extrabold text-[clamp(1.9rem,4vw,2.8rem)] leading-[1.1] tracking-[-0.025em] text-white mb-4">
              {t("editEvaluation.title")}{" "}
              <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                {t("editEvaluation.titleAccent")}
              </span>
            </h1>
 
            <p className="text-[0.88rem] text-slate-400 leading-relaxed max-w-lg font-light">
              {t("editEvaluation.subtitle")}
            </p>
 
            <div className="mt-7 h-px bg-gradient-to-r from-violet-500/20 via-slate-700/60 to-transparent" />
          </div>
 
          {/* ── form ── */}
          <EvaluationForm
            initialData={initialData}
            onSubmit={handleUpdate}
            loading={loading}
            success={success}
            error={error}
            submitLabel={t("evaluationForm.submit")}
          />
 
        </div>
      </main>
 
      <Footer />
    </div>
  );
}