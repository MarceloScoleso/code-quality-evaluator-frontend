"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import BackToHomeButton from "@/app/components/BackToHomeButton";
import EvaluationForm, {
  EvaluationFormData,
} from "@/app/components/EvaluationForm";
import { apiFetch } from "@/app/lib/api";

export default function EditEvaluationPage() {
  const { id } = useParams();
  const router = useRouter();

  const [initialData, setInitialData] = useState<
    Partial<EvaluationFormData> | undefined
  >(undefined);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [success, setSuccess] = useState(false);

  // Buscar avaliação existente
  useEffect(() => {
    const fetchEvaluation = async () => {
      try {
        const response = await apiFetch(`/api/evaluations/${id}`);

        if (!response.ok) {
          throw new Error("Erro ao buscar avaliação");
        }

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

      } catch (error) {
        console.error(error);
        alert("Erro ao carregar avaliação");
      } finally {
        setFetching(false);
      }
    };

    if (id) {
      fetchEvaluation();
    }
  }, [id]);

  // Atualizar avaliação
  const handleUpdate = async (data: EvaluationFormData) => {
    setLoading(true);
    setSuccess(false);

    try {
      const response = await apiFetch(`/api/evaluations/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Erro ao atualizar avaliação");
      }

      setSuccess(true);

      setTimeout(() => {
        router.push("/evaluations");
      }, 1500);

    } catch (error) {
      console.error(error);
      alert("Erro ao atualizar avaliação");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-400">
        Carregando avaliação...
      </div>
    );
  }

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
                Editar{" "}
                <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                  Avaliação Técnica
                </span>
              </h1>

              <p className="text-slate-400 max-w-xl leading-relaxed">
                Atualize as métricas do projeto e reavalie sua classificação técnica.
              </p>

              <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
            </div>

            <EvaluationForm
              initialData={initialData}
              onSubmit={handleUpdate}
              loading={loading}
              submitLabel="Atualizar Avaliação"
            />

            {success && (
              <div className="text-green-400 text-sm text-center">
                ✅ Avaliação atualizada com sucesso! Redirecionando...
              </div>
            )}

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}