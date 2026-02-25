"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import BackToHomeButton from "@/app/components/BackToHomeButton";
import { apiFetch } from "@/app/lib/api";
import EvaluationForm from "@/app/components/EvaluationForm";


export default function NewEvaluationPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

type EvaluationFormData = Parameters<
  React.ComponentProps<typeof EvaluationForm>["onSubmit"]
>[0];

const handleSubmit = async (data: EvaluationFormData) => {
  setLoading(true);
  setSuccess(false);
  setError(undefined);
  
  try {
    const response = await apiFetch("/api/evaluations", {
      method: "POST",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Erro ao criar avaliação");
    }

    setSuccess(true);

    setTimeout(() => {
      router.push("/evaluations");
    }, 1500);

  } catch (err) {
  console.error(err);
  setError("Não foi possível criar a avaliação. Verifique os dados e tente novamente.");
  } finally {
    setLoading(false);
  }
};

  return (
  <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950">
    
    <Header />

    <main className="flex-1">
      <div className="container py-12">

        <div className="flex justify-end mb-6">
          <BackToHomeButton />
        </div>

        <div className="max-w-2xl mx-auto space-y-10">

        <div className="space-y-4">

  <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-violet-500/10 text-violet-400 border border-violet-500/20">
    Quality Evaluator
  </div>

  <h1 className="text-4xl font-bold leading-tight">
    Criar Nova{" "}
    <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
      Avaliação Técnica
    </span>
  </h1>

  <p className="text-slate-400 max-w-xl leading-relaxed">
    Preencha as métricas do projeto e gere automaticamente
    uma classificação baseada em critérios técnicos,
    boas práticas e complexidade estrutural.
  </p>
<div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
</div>


        <EvaluationForm
        onSubmit={handleSubmit}
        loading={loading}
        success={success}
        error={error}
        />

      </div>
    
    </div>
    </main>
    <Footer />
     </div>
    
  );
}
