"use client";

import { useEffect, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/app/lib/api";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
} from "recharts";
import BackToHomeButton from "@/app/components/BackToHomeButton";

interface DashboardSummary {
  total: number;
  averageScore: number;
  excellent: number;
  good: number;
  regular: number;
  bad: number;
  byLanguage: Record<string, number>;
  scoreEvolution: Record<string, number>;
  testsPercentage: number;
  gitPercentage: number;
}

export default function DashboardPage() {
  const { token, isLoading } = useAuth();
  const router = useRouter();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !token) {
      router.push("/auth/login");
    }
  }, [token, isLoading, router]);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const response = await apiFetch("/api/evaluations/dashboard");

        if (!response.ok) {
          throw new Error("Erro ao buscar dashboard");
        }

        const data = await response.json();
        setSummary(data);
      } catch (err) {
        console.error("Erro ao carregar dashboard:", err);
        setError("Não foi possível carregar o dashboard.");
      }
    };

    if (token) {
      loadDashboard();
    }
  }, [token]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-400">
        Carregando dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-400">
        {error}
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-400">
        Carregando dados...
      </div>
    );
  }

  const classificationData = [
    { name: "EXCELENTE", value: summary.excellent },
    { name: "BOM", value: summary.good },
    { name: "REGULAR", value: summary.regular },
    { name: "RUIM", value: summary.bad },
  ];

  const languageData = Object.keys(summary.byLanguage).map((lang) => ({
    name: lang,
    value: summary.byLanguage[lang],
  }));

  const scoreEvolution = Object.keys(summary.scoreEvolution)
    .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
    .map((date) => ({
      date,
      score: summary.scoreEvolution[date],
    }));

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 fade-in">
      <Header />

      <main className="flex-1">
        <div className="container">
          <div className="flex justify-end mb-6">
            <BackToHomeButton />
          </div>

          {/* HERO */}
          <div className="space-y-4 mb-12">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-violet-500/10 text-violet-400 border border-violet-500/20">
              Analytics
            </div>

            <h1 className="text-4xl font-bold leading-tight">
              Dashboard{" "}
              <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                Estratégico
              </span>
            </h1>

            <p className="text-slate-400 max-w-2xl">
              Visualize métricas técnicas, classificação dos projetos e evolução
              do score médio com base nas avaliações realizadas.
            </p>

            <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
          </div>

          {/* KPI CARDS */}
          <div className="grid md:grid-cols-4 gap-6 mb-14">
            {[
              { label: "Total de Avaliações", value: summary.total },
              { label: "Score Médio", value: summary.averageScore.toFixed(1) },
              { label: "% com Testes", value: `${summary.testsPercentage.toFixed(1)}%` },
              { label: "% com Git", value: `${summary.gitPercentage.toFixed(1)}%` },
            ].map((item, index) => (
              <div key={index} className="feature-card text-center">
                <p className="text-sm text-slate-400">{item.label}</p>
                <p className="text-3xl font-bold mt-2 text-violet-400">
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          {/* GRÁFICOS */}
          <div className="grid lg:grid-cols-2 gap-10 mb-14">
            {/* CLASSIFICAÇÃO */}
            <div className="feature-card">
              <h3 className="mb-6 font-semibold text-lg">
                Distribuição por Classificação
              </h3>

              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <defs>
                    <linearGradient id="gradExcellent" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#22C55E" />
                      <stop offset="100%" stopColor="#16A34A" />
                    </linearGradient>

                    <linearGradient id="gradGood" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#38BDF8" />
                      <stop offset="100%" stopColor="#0EA5E9" />
                    </linearGradient>

                    <linearGradient id="gradRegular" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#FACC15" />
                      <stop offset="100%" stopColor="#EAB308" />
                    </linearGradient>

                    <linearGradient id="gradBad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#EF4444" />
                      <stop offset="100%" stopColor="#DC2626" />
                    </linearGradient>
                  </defs>

                  <Pie
                    data={classificationData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={110}
                    innerRadius={60}
                    paddingAngle={4}
                    label
                  >
                    <Cell fill="url(#gradExcellent)" />
                    <Cell fill="url(#gradGood)" />
                    <Cell fill="url(#gradRegular)" />
                    <Cell fill="url(#gradBad)" />
                  </Pie>

                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0F172A",
                      border: "1px solid #334155",
                      borderRadius: "12px",
                    }}
                    labelStyle={{ color: "#F1F5F9", fontWeight: 500 }}
                    itemStyle={{ color: "#F1F5F9", fontWeight: 500 }}
                    formatter={(value: any, name: any) => [value, name]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* LINGUAGEM */}
            <div className="feature-card">
              <h3 className="mb-6 font-semibold text-lg">
                Projetos por Linguagem
              </h3>

              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={languageData}>
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8B5CF6" />
                      <stop offset="100%" stopColor="#6366F1" />
                    </linearGradient>
                  </defs>

                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />

                  <XAxis dataKey="name" stroke="#94A3B8" tick={{ fontSize: 12 }} />
                  <YAxis stroke="#94A3B8" tick={{ fontSize: 12 }} />

                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0F172A",
                      border: "1px solid #334155",
                      borderRadius: "12px",
                    }}
                    labelStyle={{ color: "#F1F5F9", fontWeight: 500 }}
                    itemStyle={{ color: "#F1F5F9", fontWeight: 500 }}
                  />

                  <Bar dataKey="value" fill="url(#barGradient)" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* EVOLUÇÃO */}
          <div className="feature-card">
            <h3 className="mb-6 font-semibold text-lg">Evolução do Score Médio</h3>

            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={scoreEvolution}>
                <defs>
                  <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />
                <XAxis dataKey="date" stroke="#94A3B8" tick={{ fontSize: 12 }} />
                <YAxis stroke="#94A3B8" tick={{ fontSize: 12 }} />

                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0F172A",
                    border: "1px solid #334155",
                    borderRadius: "12px",
                  }}
                  labelStyle={{ color: "#F1F5F9", fontWeight: 500 }}
                  itemStyle={{ color: "#F1F5F9", fontWeight: 500 }}
                  formatter={(value: number | undefined) =>
                    value !== undefined ? value.toFixed(1) : "-"
                    }
                />

                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#8B5CF6"
                  strokeWidth={3}
                  dot={{ r: 5 }}
                  activeDot={{ r: 8 }}
                />

                <Area type="monotone" dataKey="score" stroke="none" fill="url(#lineGradient)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}