"use client";

import { useState, useEffect } from "react";
import Header from "./components/Header"; 

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

interface Evaluation {
  id: number;
  projectName: string;
  language: Language;
  score: number;
  classification: Classification;
  analyzedBy: string;
  createdAt: string;
}

export default function Page() {
  // --- Estados do formulário e histórico ---
  const [projectName, setProjectName] = useState("");
  const [language, setLanguage] = useState<Language>("JAVA");
  const [linesOfCode, setLinesOfCode] = useState(0);
  const [complexity, setComplexity] = useState(1);
  const [hasTests, setHasTests] = useState(true);
  const [usesGit, setUsesGit] = useState(true);
  const [analyzedBy, setAnalyzedBy] = useState("");

  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [filterName, setFilterName] = useState("");
  const [filterLanguage, setFilterLanguage] = useState<Language | "">("");
  const [filterMinScore, setFilterMinScore] = useState<number | "">("");
  const [filterMaxScore, setFilterMaxScore] = useState<number | "">("");
  const [filterClassification, setFilterClassification] = useState<
    Classification | ""
  >("");

  // --- Funções de fetch ---
  const fetchEvaluations = async () => {
    const res = await fetch("/api/evaluations");
    const data: Evaluation[] = await res.json();
    setEvaluations(data);
  };

  useEffect(() => {
    fetchEvaluations();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = {
      projectName,
      language,
      linesOfCode,
      complexity,
      hasTests,
      usesGit,
      analyzedBy,
    };
    await fetch("/api/evaluations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    fetchEvaluations();
  };

  const handleFilter = async () => {
    const params = new URLSearchParams();
    if (filterName) params.append("projectName", filterName);
    if (filterLanguage) params.append("language", filterLanguage);
    if (filterMinScore) params.append("minScore", String(filterMinScore));
    if (filterMaxScore) params.append("maxScore", String(filterMaxScore));
    if (filterClassification)
      params.append("classification", filterClassification);

    const res = await fetch(`/api/evaluations/filter?${params.toString()}`);
    const data: Evaluation[] = await res.json();
    setEvaluations(data);
  };

  const handleExport = async () => {
    const params = new URLSearchParams();
    if (filterName) params.append("projectName", filterName);
    if (filterLanguage) params.append("language", filterLanguage);
    if (filterMinScore) params.append("minScore", String(filterMinScore));
    if (filterMaxScore) params.append("maxScore", String(filterMaxScore));
    if (filterClassification)
      params.append("classification", filterClassification);

    const res = await fetch(`/api/evaluations/export/csv?${params.toString()}`);
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "evaluations.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <Header />

      {/* Formulário de Avaliação */}
      <form className="form-card mb-6" onSubmit={handleSubmit}>
        <h2 className="text-xl font-bold mb-2">Nova Avaliação</h2>
        <input
          type="text"
          placeholder="Nome do Projeto"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          required
        />
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value as Language)}
        >
          {[
            "JAVA",
            "CSHARP",
            "JAVASCRIPT",
            "TYPESCRIPT",
            "PYTHON",
            "KOTLIN",
            "GO",
            "PHP",
            "RUBY",
            "SWIFT",
            "C",
            "CPP",
            "RUST",
            "DART",
            "OTHER",
          ].map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Linhas de Código"
          value={linesOfCode}
          onChange={(e) => setLinesOfCode(Number(e.target.value))}
          min={0}
        />
        <input
          type="number"
          placeholder="Complexidade (1-5)"
          value={complexity}
          onChange={(e) => setComplexity(Number(e.target.value))}
          min={1}
          max={5}
        />
        <div className="flex gap-4 mb-2">
          <label>
            <input
              type="checkbox"
              checked={hasTests}
              onChange={(e) => setHasTests(e.target.checked)}
            />{" "}
            Possui testes
          </label>
          <label>
            <input
              type="checkbox"
              checked={usesGit}
              onChange={(e) => setUsesGit(e.target.checked)}
            />{" "}
            Usa Git
          </label>
        </div>
        <input
          type="text"
          placeholder="Analisado por"
          value={analyzedBy}
          onChange={(e) => setAnalyzedBy(e.target.value)}
        />
        <button
          type="submit"
          className="mt-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          Criar Avaliação
        </button>
      </form>

      {/* Filtros */}
      <div className="filter-card mb-6 flex flex-wrap gap-2">
        <input
          type="text"
          placeholder="Filtrar por nome"
          value={filterName}
          onChange={(e) => setFilterName(e.target.value)}
          className="px-2 py-1 border rounded"
        />
        <select
          value={filterLanguage}
          onChange={(e) => setFilterLanguage(e.target.value as Language)}
          className="px-2 py-1 border rounded"
        >
          <option value="">Todas as Linguagens</option>
          {[
            "JAVA",
            "CSHARP",
            "JAVASCRIPT",
            "TYPESCRIPT",
            "PYTHON",
            "KOTLIN",
            "GO",
            "PHP",
            "RUBY",
            "SWIFT",
            "C",
            "CPP",
            "RUST",
            "DART",
            "OTHER",
          ].map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Score Mínimo"
          value={filterMinScore}
          onChange={(e) =>
            setFilterMinScore(e.target.value ? Number(e.target.value) : "")
          }
          className="px-2 py-1 border rounded"
        />
        <input
          type="number"
          placeholder="Score Máximo"
          value={filterMaxScore}
          onChange={(e) =>
            setFilterMaxScore(e.target.value ? Number(e.target.value) : "")
          }
          className="px-2 py-1 border rounded"
        />
        <select
          value={filterClassification}
          onChange={(e) =>
            setFilterClassification(e.target.value as Classification)
          }
          className="px-2 py-1 border rounded"
        >
          <option value="">Todas as Classificações</option>
          {["EXCELENTE", "BOM", "REGULAR", "RUIM"].map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <button
          onClick={handleFilter}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Filtrar
        </button>
        <button
          onClick={handleExport}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Exportar CSV
        </button>
      </div>

      {/* Grid de Avaliações */}
      <div className="cards-grid grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {evaluations.map((ev) => (
          <div
            key={ev.id}
            className="card p-4 border rounded shadow-sm hover:shadow-md transition"
          >
            <div className="flex justify-between mb-2">
              <span className="font-bold">{ev.projectName}</span>
              <span
                className={`px-2 py-1 rounded text-sm font-bold ${
                  ev.classification === "EXCELENTE"
                    ? "bg-green-200 text-green-800"
                    : ev.classification === "BOM"
                    ? "bg-blue-200 text-blue-800"
                    : ev.classification === "REGULAR"
                    ? "bg-yellow-200 text-yellow-800"
                    : "bg-red-200 text-red-800"
                }`}
              >
                {ev.classification}
              </span>
            </div>
            <p>Linguagem: {ev.language}</p>
            <p>Score: {ev.score}</p>
            <p>Analisado por: {ev.analyzedBy}</p>
            <p>
              Criado em: {new Date(ev.createdAt).toLocaleString("pt-BR")}
            </p>
          </div>
        ))}
      </div>

      <footer className="mt-6 text-gray-500 text-sm">
        © 2026 Code Quality Evaluator
      </footer>
    </div>
  );
}
