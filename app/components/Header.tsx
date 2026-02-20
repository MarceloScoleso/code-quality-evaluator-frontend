"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { apiFetch } from "@/app/lib/api"; // <- usar apiFetch

interface Stats {
  total: number;
  averageScore: number;
  excellentCount: number;
}

export default function Header() {
  const [stats, setStats] = useState<Stats>({
    total: 0,
    averageScore: 0,
    excellentCount: 0,
  });

  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await apiFetch("/api/evaluations/stats");

      if (!res.ok) {
        throw new Error("Erro ao buscar estatísticas");
      }

      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error(error);
      setStats({ total: 0, averageScore: 0, excellentCount: 0 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <header className="w-full hero">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="sr-only">Code Quality Evaluator</h1>

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10">
          <div className="max-w-2xl">
            <div className="mb-4 flex items-center">
              <Image
                src="/Logo1.png"
                alt="Code Quality Evaluator Logo"
                width={0}
                height={0}
                sizes="100vw"
                priority
                className="h-16 w-auto object-contain hover:scale-105 transition-transform duration-300"
              />
            </div>

            <p className="hero-subtitle">
              Plataforma inteligente para análise automatizada de qualidade de código
            </p>

            <p className="hero-description">
              Este sistema permite avaliar projetos com base em métricas estruturais
              como complexidade, volume de código, uso de testes e versionamento.
              Ideal para times que desejam manter padrões elevados de qualidade,
              governança técnica e evolução sustentável do software.
            </p>
          </div>

          <div className="stats w-full lg:w-80 space-y-3">
            <div className="stat-card">
              <div className="stat-label">Avaliações</div>
              <div className="stat-number">{loading ? "..." : stats.total}</div>
            </div>

            <div className="stat-card">
              <div className="stat-label">Score Médio</div>
              <div className="stat-number">{loading ? "..." : stats.averageScore}</div>
            </div>

            <div className="stat-card">
              <div className="stat-label">Excelentes</div>
              <div className="stat-number">{loading ? "..." : stats.excellentCount}</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}