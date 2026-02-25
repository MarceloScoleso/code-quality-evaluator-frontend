"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import BackToHomeButton from "@/app/components/BackToHomeButton";
import { apiFetch } from "@/app/lib/api";

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
function MetricCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="p-6 rounded-2xl border border-slate-700 bg-slate-900/60 backdrop-blur-xl hover:scale-105 transition-all duration-300 shadow-xl">
      <p className="text-xs text-slate-400 uppercase tracking-wider">{label}</p>
      <p className="text-3xl font-bold mt-2 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
        {value}
      </p>
    </div>
  );
}
export default function EvaluationDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchEvaluation = async () => {
    try {
      setLoading(true);
      const res = await apiFetch(`/api/evaluations/${id}`);
      if (!res.ok) throw new Error("Erro ao buscar avaliação");
      const data = await res.json();
      setEvaluation(data);
    } catch (error) {
      console.error(error);
      router.push("/evaluations/historic");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
  const confirmDelete = window.confirm(
    "Tem certeza que deseja excluir esta avaliação? Essa ação não poderá ser desfeita."
  );

  if (!confirmDelete) return;

  try {
    const res = await apiFetch(`/api/evaluations/${evaluation?.id}`, {
      method: "DELETE",
    });

    if (!res.ok) throw new Error("Erro ao excluir");

    alert("Avaliação excluída com sucesso!");
    router.push("/evaluations/historic");
  } catch (error) {
    console.error(error);
    alert("Erro ao excluir avaliação.");
  }
};

  useEffect(() => { fetchEvaluation(); }, [id]);

  if (loading) return <div className="text-center py-20 text-slate-400">Carregando...</div>;
  if (!evaluation) return null;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950">
      <Header />
      <main className="flex-1 container fade-in">
        <div className="flex items-center justify-between mb-8">
  <BackToHomeButton />

  <div className="flex gap-4">
    {/* Botão Editar */}
    <button
      onClick={() => router.push(`/evaluations/historic/${evaluation.id}/edit`)}
      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 transition text-white font-medium"
    >
      ✏ Editar
    </button>

    {/* Botão Delete */}
    <button
      onClick={handleDelete}
      className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 transition text-white font-medium"
    >
      🗑 Excluir
    </button>
  </div>
</div>

        {/* Hero Section */}
        <section className="hero-section p-12 rounded-3xl border mb-12 relative overflow-hidden">
  <div className="hero-content flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10">
    
    <div>
      <h1 className="hero-title text-5xl">
        {evaluation.projectName}
      </h1>

      <p className="hero-subtitle">
        Avaliado por <strong>{evaluation.analyzedBy}</strong> •{" "}
        {new Date(evaluation.createdAt).toLocaleDateString("pt-BR")}
      </p>

      <p className="hero-description mt-4">
        Relatório completo de qualidade técnica, métricas estruturais e análise
        automatizada baseada em critérios objetivos.
      </p>
    </div>

    {/* Score Highlight */}
    <div className="flex flex-col items-center justify-center bg-slate-900/60 backdrop-blur-xl rounded-3xl p-8 border border-slate-700 shadow-2xl">
      <span className="text-sm text-slate-400">Score Final</span>
      <span className="text-6xl font-extrabold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
        {evaluation.score}
      </span>
      <span className="text-xs text-slate-500 mt-1">de 100</span>
    </div>

  </div>
</section>

        {/* Informações do Projeto */}
        <div className="main-grid">
          {/* Card Principal */}
          <div className="form-card space-y-6">
  <h2 className="section-title">Detalhes Técnicos</h2>
  <div className="space-y-4">
    <div className="flex flex-col gap-1">
      <span className="font-semibold text-white">Linguagem</span>
      <span className="text-slate-400">Este projeto foi desenvolvido utilizando a linguagem <strong>{evaluation.language}</strong>, escolhida pela sua eficiência e compatibilidade com o tipo de aplicação.</span>
    </div>

    <div className="flex flex-col gap-1">
      <span className="font-semibold text-white">Score</span>
      <span className="text-slate-400">{evaluation.score}/100</span>
    </div>

    <div className="flex items-center gap-4 mt-4">
      <span className="text-sm text-slate-400">Classificação</span>
      <span className={`badge ${evaluation.classification} classification-glow`}>
        {evaluation.classification}
      </span>
    </div>

    <div className="flex flex-col gap-1">
      <span className="font-semibold text-white">Linhas de Código</span>
      <span className="text-slate-400">O projeto contém <strong>{evaluation.linesOfCode}</strong> linhas de código, refletindo a complexidade e o tamanho da implementação.</span>
    </div>

    <div className="flex flex-col gap-1">
      <span className="font-semibold text-white">Complexidade</span>
      <span className="text-slate-400">A complexidade do projeto foi avaliada como <strong>{evaluation.complexity}</strong> (em uma escala de 1 a 5), indicando a dificuldade do código.</span>
    </div>

    <div className="flex gap-2">
      {evaluation.hasTests && <span className="px-2 py-1 bg-green-500/10 text-green-400 rounded-md">✔ Possui testes automatizados</span>}
      {evaluation.usesGit && <span className="px-2 py-1 bg-blue-500/10 text-blue-400 rounded-md">✔ Versionado no Git</span>}
    </div>
  </div>
</div>


          {/* Análise + Métricas */}
          <div className="form-card space-y-8 relative overflow-hidden">
            <h2 className="section-title">Análise Inteligente</h2>

            <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-700 leading-relaxed text-slate-300">
              {evaluation.description || 
                "A análise automática ainda não foi gerada para este projeto."
              }
            </div>

          {/* Divider elegante */}
            <div className="h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent" />

          {/* Métricas */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <MetricCard label="Linhas de Código" value={evaluation.linesOfCode} />
                <MetricCard label="Complexidade" value={evaluation.complexity} />
                <MetricCard label="Score Técnico" value={evaluation.score} />
              </div>
            </div>
          </div>
        </main>
      <Footer />
    </div>
  );
}