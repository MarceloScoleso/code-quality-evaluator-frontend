"use client";

import { useState } from "react";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import BackToHomeButton from "@/app/components/BackToHomeButton";

type Language =
  | "JAVA"
  | "CSHARP"
  | "JAVASCRIPT"
  | "TYPESCRIPT"
  | "PYTHON"
  | "KOTLIN"
  | "GO"
  | "PHP"
  | "RUBY"
  | "SWIFT"
  | "C"
  | "CPP"
  | "RUST"
  | "DART"
  | "OTHER";

type Classification = "EXCELENTE" | "BOM" | "REGULAR" | "RUIM";

export default function ExportCsvPage() {
  const [filterName, setFilterName] = useState("");
  const [filterLanguage, setFilterLanguage] = useState<Language | "">("");
  const [filterClassification, setFilterClassification] =
    useState<Classification | "">("");
  const [filterMinScore, setFilterMinScore] = useState<number | "">("");
  const [filterMaxScore, setFilterMaxScore] = useState<number | "">("");
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");

  const handleExport = async () => {
    const params = new URLSearchParams();

    if (filterName) params.append("projectName", filterName);
    if (filterLanguage) params.append("language", filterLanguage);
    if (filterClassification)
      params.append("classification", filterClassification);
    if (filterMinScore !== "")
      params.append("minScore", String(filterMinScore));
    if (filterMaxScore !== "")
      params.append("maxScore", String(filterMaxScore));
    if (filterStartDate)
      params.append("startDate", filterStartDate);
    if (filterEndDate)
      params.append("endDate", filterEndDate);

    window.open(`/api/evaluations/export?${params.toString()}`);
  };

  return (
    <>
      <Header evaluations={[]} averageScore={0} />

      <main className="container min-h-screen space-y-12">
        
        <div className="flex justify-end mb-6">
          <BackToHomeButton />
        </div>

        {/* HEADER SAAS */}
        <div className="space-y-6">

          <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-violet-500/10 text-violet-400 border border-violet-500/20">
            Data Export & Relatórios
          </div>

          <h1 className="text-4xl font-bold leading-tight">
            Exportação de{" "}
            <span className="bg-gradient-to-r from-violet-400 to-sky-400 bg-clip-text text-transparent">
              Avaliações em CSV
            </span>
          </h1>

          <p className="text-slate-400 max-w-xl leading-relaxed">
            Gere relatórios personalizados das avaliações realizadas,
            aplicando filtros estratégicos para análise externa,
            auditorias ou integração com outras ferramentas.
          </p>

          <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />

        </div>

        {/* FILTROS COMPLETOS */}
        <div className="filter-card space-y-6">

          <h3 className="text-sm uppercase tracking-wider text-slate-400">
            Filtros para Exportação
          </h3>

          <div className="grid md:grid-cols-3 gap-6">

            <div>
              <label className="block text-sm font-medium mb-2">
                Nome do Projeto
              </label>
              <input
                type="text"
                placeholder="Buscar por nome..."
                value={filterName}
                onChange={(e) => setFilterName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Linguagem
              </label>
              <select
                value={filterLanguage}
                onChange={(e) =>
                  setFilterLanguage(e.target.value as Language)
                }
              >
                <option value="">Todas</option>
                {[
                  "JAVA","CSHARP","JAVASCRIPT","TYPESCRIPT","PYTHON",
                  "KOTLIN","GO","PHP","RUBY","SWIFT","C","CPP",
                  "RUST","DART","OTHER",
                ].map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Classificação
              </label>
              <select
                value={filterClassification}
                onChange={(e) =>
                  setFilterClassification(e.target.value as Classification)
                }
              >
                <option value="">Todas</option>
                {["EXCELENTE","BOM","REGULAR","RUIM"].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Score Mínimo
              </label>
              <input
                type="number"
                min={0}
                max={100}
                value={filterMinScore}
                onChange={(e) =>
                  setFilterMinScore(
                    e.target.value === "" ? "" : Number(e.target.value)
                  )
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Score Máximo
              </label>
              <input
                type="number"
                min={0}
                max={100}
                value={filterMaxScore}
                onChange={(e) =>
                  setFilterMaxScore(
                    e.target.value === "" ? "" : Number(e.target.value)
                  )
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Data Inicial
              </label>
              <input
                type="date"
                value={filterStartDate}
                onChange={(e) => setFilterStartDate(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Data Final
              </label>
              <input
                type="date"
                value={filterEndDate}
                onChange={(e) => setFilterEndDate(e.target.value)}
              />
            </div>

          </div>

          <div className="flex justify-end">
            <button onClick={handleExport} className="primary-cta">
              Exportar CSV
            </button>
          </div>

        </div>

        <Footer />
      </main>
    </>
  );
}