"use client";

import Image from "next/image";

interface HeaderProps {
  evaluations: any[];
  averageScore: number;
}

export default function Header({ evaluations, averageScore }: HeaderProps) {
  const excelentes = evaluations.filter(
    (e) => e.classification === "EXCELENTE"
  ).length;

  return (
    <header className="w-full hero">
      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* H1 invisível para SEO */}
        <h1 className="sr-only">Code Quality Evaluator</h1>

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10">

          {/* LADO ESQUERDO */}
          <div className="max-w-2xl">

            {/* LOGO */}
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

          {/* LADO DIREITO */}
          <div className="stats w-full lg:w-80 space-y-3">
            <div className="stat-card">
  <div className="stat-label">Avaliações</div>
  <div className="stat-number">{evaluations.length}</div>
</div>

<div className="stat-card">
  <div className="stat-label">Score Médio</div>
  <div className="stat-number">{averageScore}</div>
</div>

<div className="stat-card">
  <div className="stat-label">Excelentes</div>
  <div className="stat-number">{excelentes}</div>
</div>
          </div>

        </div>
      </div>
    </header>
  );
}