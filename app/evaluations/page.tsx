"use client";

import { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";

interface Evaluation {
  id: number;
  projectName: string;
  score: number;
  analyzedBy: string;
  createdAt: string;
}

export default function Page() {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);

  const { token, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !token) {
      router.push("/auth/login");
    }
  }, [token, isLoading, router]);

  const fetchEvaluations = async () => {
    const res = await fetch("/api/evaluations");
    const data: Evaluation[] = await res.json();
    setEvaluations(data);
  };

  useEffect(() => {
    if (token) {
      fetchEvaluations();
    }
  }, [token]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-400">
        Verificando autenticação...
      </div>
    );
  }

  const averageScore =
    evaluations.length > 0
      ? Math.round(
          evaluations.reduce((acc, ev) => acc + ev.score, 0) /
            evaluations.length
        )
      : 0;

  return (
  <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950">

    <Header />

    <main className="flex-1">
      <div className="container">

        {/* HERO SECTION */}
        <section className="hero-section py-16 text-center">
          <div className="hero-content space-y-6">

            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
              Governança Técnica com Inteligência
            </h2>

            <p className="max-w-xl mx-auto text-base text-slate-400">
              Avalie e monitore a qualidade dos seus projetos
              com métricas estruturadas e classificação automatizada.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mt-8">

  <a href="/evaluations/new" className="primary-cta">
    ➕ Nova Avaliação
  </a>

  <a href="/evaluations/historic" className="secondary-cta">
    📊 Histórico
  </a>

  <a href="/evaluations/export/csv" className="success-cta">
    ⬇ Exportar CSV
  </a>

</div>

<div className="mt-16 w-full max-w-md mx-auto">
  <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent mb-8" />

  <div className="flex justify-center">
    <a href="/evaluations/dashboard" className="dashboard-cta">
      📈 Acessar Dashboard Estratégico
    </a>
  </div>
</div>

          </div>
        </section>

        {/* FEATURES */}
        <section className="grid md:grid-cols-3 gap-10 mt-28">

          <div className="feature-card">
            <h3 className="text-xl font-semibold mb-4">
              ⚙️ Análise Automatizada
            </h3>
            <p className="text-slate-400">
              Score calculado automaticamente com base em linguagem,
              complexidade, presença de testes e uso de versionamento.
            </p>
          </div>

          <div className="feature-card">
            <h3 className="text-xl font-semibold mb-4">
              📊 Histórico Completo
            </h3>
            <p className="text-slate-400">
              Visualização paginada com ordenação, filtros avançados
              e busca por múltiplos critérios.
            </p>
          </div>

          <div className="feature-card">
            <h3 className="text-xl font-semibold mb-4">
              📁 Exportação Profissional
            </h3>
            <p className="text-slate-400">
              Gere relatórios CSV com filtros personalizados para
              auditoria, compliance e governança técnica.
            </p>
          </div>

        </section>

        {/* STRATEGIC SECTION */}
        <section className="strategic-section mt-32 space-y-6 text-center">
          <h3 className="text-3xl font-bold">
            Decisões Técnicas Baseadas em Dados
          </h3>

          <p className="max-w-3xl mx-auto text-slate-400">
            Transforme métricas técnicas em inteligência estratégica.
            Acompanhe a evolução dos seus projetos e mantenha padrões
            de qualidade consistentes em todo o seu ecossistema de software.
          </p>
        </section>

      </div>
    </main>

    <Footer />

  </div>
);
}