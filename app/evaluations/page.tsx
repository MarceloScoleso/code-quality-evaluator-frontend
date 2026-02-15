"use client";

import { useEffect, useState } from "react";

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

interface PageResponse {
  content: Evaluation[];
  totalPages: number;
  totalElements: number;
  number: number;
}

export default function EvaluationsPage() {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  // filtros
  const [filterName, setFilterName] = useState("");
  const [filterLanguage, setFilterLanguage] = useState<Language | "">("");
  const [filterClassification, setFilterClassification] =
    useState<Classification | "">("");

  const fetchEvaluations = async () => {
    setLoading(true);

    const params = new URLSearchParams();
    params.append("page", String(page));
    params.append("size", "6");

    if (filterName) params.append("projectName", filterName);
    if (filterLanguage) params.append("language", filterLanguage);
    if (filterClassification)
      params.append("classification", filterClassification);

    const res = await fetch(`/api/evaluations/filter?${params.toString()}`);
    const data: PageResponse = await res.json();

    setEvaluations(data.content);
    setTotalPages(data.totalPages);
    setLoading(false);
  };

  useEffect(() => {
    fetchEvaluations();
  }, [page]);

  const handleFilter = () => {
    setPage(0);
    fetchEvaluations();
  };

  return (
    <main className="container min-h-screen space-y-12">

      {/* HEADER */}
      <div className="space-y-3">
        <h1 className="text-3xl font-bold">
          Histórico de Avaliações
        </h1>
        <p className="text-slate-400">
          Consulte avaliações anteriores com filtros avançados.
        </p>
      </div>

      {/* FILTROS */}
      <div className="filter-card">

        <input
          type="text"
          placeholder="Nome do Projeto"
          value={filterName}
          onChange={(e) => setFilterName(e.target.value)}
        />

        <select
          value={filterLanguage}
          onChange={(e) =>
            setFilterLanguage(e.target.value as Language)
          }
        >
          <option value="">Todas Linguagens</option>
          {[
            "JAVA","CSHARP","JAVASCRIPT","TYPESCRIPT","PYTHON",
            "KOTLIN","GO","PHP","RUBY","SWIFT","C","CPP",
            "RUST","DART","OTHER",
          ].map((l) => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>

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

        <button onClick={handleFilter}>
          Filtrar
        </button>

      </div>

      {/* LISTAGEM */}
      {loading ? (
        <div className="text-center text-slate-400">
          Carregando avaliações...
        </div>
      ) : (
        <div className="cards-grid">
          {evaluations.map((ev) => (
            <div key={ev.id} className="card">
              <div className="card-header">
                <span className="project-name">
                  {ev.projectName}
                </span>
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
      )}

      {/* PAGINAÇÃO */}
      <div className="flex justify-center gap-4 items-center mt-10">

        <button
          disabled={page === 0}
          onClick={() => setPage((prev) => prev - 1)}
          className="secondary-cta disabled:opacity-40"
        >
          ← Anterior
        </button>

        <span className="text-slate-400 text-sm">
          Página {page + 1} de {totalPages}
        </span>

        <button
          disabled={page + 1 >= totalPages}
          onClick={() => setPage((prev) => prev + 1)}
          className="secondary-cta disabled:opacity-40"
        >
          Próxima →
        </button>

      </div>

    </main>
  );
}
