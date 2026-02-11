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
  // FORM
  const [projectName, setProjectName] = useState("");
  const [language, setLanguage] = useState<Language>("JAVA");
  const [linesOfCode, setLinesOfCode] = useState(0);
  const [complexity, setComplexity] = useState(1);
  const [hasTests, setHasTests] = useState(true);
  const [usesGit, setUsesGit] = useState(true);
  const [analyzedBy, setAnalyzedBy] = useState("");

  // DATA
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);

  // FILTERS
  const [filterName, setFilterName] = useState("");
  const [filterLanguage, setFilterLanguage] = useState<Language | "">("");
  const [filterMinScore, setFilterMinScore] = useState<number | "">("");
  const [filterMaxScore, setFilterMaxScore] = useState<number | "">("");
  const [filterClassification, setFilterClassification] =
    useState<Classification | "">("");

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

    await fetch("/api/evaluations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        projectName,
        language,
        linesOfCode,
        complexity,
        hasTests,
        usesGit,
        analyzedBy,
      }),
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

  const averageScore =
    evaluations.length > 0
      ? Math.round(
          evaluations.reduce((acc, ev) => acc + ev.score, 0) /
            evaluations.length
        )
      : 0;

  return (
    <>
    <Header 
      evaluations={evaluations}
      averageScore={averageScore}
    />
    <div className="container min-h-screen">

    <div className="main-grid">
   
      {/* NOVA AVALIAÇÃO */}
      <div className="section">
        <h2 className="section-title">Nova Avaliação</h2>
        <p className="section-description">
          Insira as informações do projeto para gerar automaticamente uma
          classificação baseada nas métricas definidas pelo sistema.
        </p>

        <form className="form-card" onSubmit={handleSubmit}>
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
              "JAVA","CSHARP","JAVASCRIPT","TYPESCRIPT","PYTHON",
              "KOTLIN","GO","PHP","RUBY","SWIFT","C","CPP",
              "RUST","DART","OTHER",
            ].map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Linhas de Código"
            value={linesOfCode}
            onChange={(e) => setLinesOfCode(Number(e.target.value))}
          />

          <input
            type="number"
            placeholder="Complexidade (1-5)"
            value={complexity}
            onChange={(e) => setComplexity(Number(e.target.value))}
            min={1}
            max={5}
          />

          <div className="flex gap-6">
            <label>
              <input
                type="checkbox"
                checked={hasTests}
                onChange={(e) => setHasTests(e.target.checked)}
              />{" "}
              Possui Testes Automatizados
            </label>

            <label>
              <input
                type="checkbox"
                checked={usesGit}
                onChange={(e) => setUsesGit(e.target.checked)}
              />{" "}
              Utiliza Controle de Versão (Git)
            </label>
          </div>

          <input
            type="text"
            placeholder="Responsável pela Análise"
            value={analyzedBy}
            onChange={(e) => setAnalyzedBy(e.target.value)}
          />

          <button type="submit">Gerar Avaliação</button>
        </form>
      </div>

      {/* HISTÓRICO */}
      <div className="section history-wrapper">
        <h2 className="section-title">Histórico de Avaliações</h2>
        <p className="section-description">
          Consulte avaliações anteriores, aplique filtros personalizados
          e exporte relatórios completos em formato CSV.
        </p>

        <div className="filter-card">
          <input
            type="text"
            placeholder="Filtrar por nome"
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
          />

          <select
            value={filterLanguage}
            onChange={(e) => setFilterLanguage(e.target.value as Language)}
          >
            <option value="">Todas as Linguagens</option>
            {[
              "JAVA","CSHARP","JAVASCRIPT","TYPESCRIPT","PYTHON",
              "KOTLIN","GO","PHP","RUBY","SWIFT","C","CPP",
              "RUST","DART","OTHER",
            ].map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Score Min"
            value={filterMinScore}
            onChange={(e) =>
              setFilterMinScore(e.target.value ? Number(e.target.value) : "")
            }
          />

          <input
            type="number"
            placeholder="Score Max"
            value={filterMaxScore}
            onChange={(e) =>
              setFilterMaxScore(e.target.value ? Number(e.target.value) : "")
            }
          />

          <select
            value={filterClassification}
            onChange={(e) =>
              setFilterClassification(e.target.value as Classification)
            }
          >
            <option value="">Classificação</option>
            {["EXCELENTE","BOM","REGULAR","RUIM"].map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <button onClick={handleFilter}>Filtrar</button>
          <button onClick={handleExport} className="export-btn">
            Exportar CSV
          </button>
        </div>

        <div className="cards-grid">
          {evaluations.map((ev) => (
            <div key={ev.id} className="card">
              <div className="card-header">
                <span className="project-name">{ev.projectName}</span>
                <span className={`badge ${ev.classification}`}>
                  {ev.classification}
                </span>
              </div>

              <div className="card-body">
                <p>Linguagem: {ev.language}</p>
                <p>Score: {ev.score}</p>
                <p>Analisado por: {ev.analyzedBy}</p>
                <p>
                  Criado em:{" "}
                  {new Date(ev.createdAt).toLocaleString("pt-BR")}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      </div>

      <footer className="footer">
    © 2026 Code Quality Evaluator — Sistema desenvolvido para análise
    técnica estruturada de projetos de software.
  </footer>

</div>
    </>
  );
}
