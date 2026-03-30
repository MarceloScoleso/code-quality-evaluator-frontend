"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { apiFetch } from "@/app/lib/api";
import EvaluationForm from "@/app/components/EvaluationForm";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function NewEvaluationPage() {
  const router = useRouter();
  const { t }  = useTranslation();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError]     = useState<string | undefined>(undefined);

  type EvaluationFormData = Parameters<React.ComponentProps<typeof EvaluationForm>["onSubmit"]>[0];

  const handleSubmit = async (data: EvaluationFormData) => {
    setLoading(true); setSuccess(false); setError(undefined);
    try {
      const response = await apiFetch("/api/evaluations", { method: "POST", body: JSON.stringify(data) });
      if (!response.ok) throw new Error();
      setSuccess(true);
      setTimeout(() => router.push("/evaluations"), 1500);
    } catch {
      setError(t("newEvaluation.errorCreate"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Header />
      <main className="flex-1 pt-8 pb-20">
        <div className="max-w-2xl mx-auto px-6">
          <div className="mb-8 mt-2">
            <button onClick={() => router.push("/evaluations")} className="group inline-flex items-center gap-2 text-[0.82rem] font-medium text-slate-500 hover:text-slate-200 transition-colors duration-200">
              <span className="w-7 h-7 rounded-lg border border-slate-800 bg-slate-900/60 flex items-center justify-center transition-all duration-200 group-hover:border-violet-500/40 group-hover:bg-violet-500/[0.08] group-hover:-translate-x-0.5">
                <ArrowLeft size={13} />
              </span>
              {t("common.backToHome")}
            </button>
          </div>

          <div className="mb-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-violet-500/25 bg-violet-500/[0.08] text-[0.68rem] font-semibold tracking-[0.12em] uppercase text-violet-400 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
              {t("newEvaluation.eyebrow")}
            </div>
            <h1 className="font-extrabold text-[clamp(1.9rem,4vw,2.8rem)] leading-[1.1] tracking-[-0.025em] text-white mb-4">
              {t("newEvaluation.title")}{" "}
              <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">{t("newEvaluation.titleAccent")}</span>
            </h1>
            <p className="text-[0.88rem] text-slate-400 leading-relaxed max-w-lg font-light">{t("newEvaluation.subtitle")}</p>
            <div className="mt-7 h-px bg-gradient-to-r from-violet-500/20 via-slate-700/60 to-transparent" />
          </div>

          <EvaluationForm onSubmit={handleSubmit} loading={loading} success={success} error={error} />
        </div>
      </main>
      <Footer />
    </div>
  );
}