"use client";

import { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import BackToHomeButton from "../components/BackToHomeButton";

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
  
  const [filterMinScore, setFilterMinScore] = useState<number | "">("");
  const [filterMaxScore, setFilterMaxScore] = useState<number | "">("");
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");

  const fetchEvaluations = async () => {
    setLoading(true);

    const params = new URLSearchParams();
    params.append("page", String(page));
    params.append("size", "6");

    if (filterName) params.append("projectName", filterName);
    if (filterLanguage) params.append("language", filterLanguage);
    if (filterClassification)
      params.append("classification", filterClassification);

  if (filterMinScore !== "") params.append("minScore", String(filterMinScore));
  if (filterMaxScore !== "") params.append("maxScore", String(filterMaxScore));
  if (filterStartDate) params.append("startDate", filterStartDate);
  if (filterEndDate) params.append("endDate", filterEndDate);
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
    <>
        <Header evaluations={[]} averageScore={0} />
    <main className="container min-h-screen space-y-12">
      <div className="flex justify-end mb-6">
      <BackToHomeButton />
        </div>
      <div className="space-y-6">

  <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-sky-500/10 text-sky-400 border border-sky-500/20">
    Analytics & Monitoramento
  </div>

  <h1 className="text-4xl font-bold leading-tight">
    Histórico de{" "}
    <span className="bg-gradient-to-r from-sky-400 to-violet-400 bg-clip-text text-transparent">
      Avaliações Técnicas
    </span>
  </h1>

  <p className="text-slate-400 max-w-xl leading-relaxed">
    Explore avaliações realizadas, analise métricas de qualidade
    e acompanhe a evolução técnica dos projetos avaliados.
  </p>

  <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />

</div>

      {/* FILTROS */}
      <div className="filter-card space-y-6">

  <h3 className="text-sm uppercase tracking-wider text-slate-400">
    Filtros Avançados
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

  <div className="flex justify-end gap-4">
    <button onClick={handleFilter} className="primary-cta">
      Aplicar Filtros
    </button>
  </div>

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

              <div className="card-body space-y-2">

  <div className="flex justify-between">
    <span>Linguagem</span>
    <span className="font-semibold">{ev.language}</span>
  </div>

  <div className="flex justify-between">
    <span>Score</span>
    <span className="font-semibold">{ev.score}/100</span>
  </div>

  <div className="flex justify-between">
    <span>Analista</span>
    <span>{ev.analyzedBy}</span>
  </div>

  <div className="flex justify-between text-xs text-slate-500">
    <span>Data</span>
    <span>
      {new Date(ev.createdAt).toLocaleString("pt-BR")}
    </span>
  </div>

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
      <Footer />
    </main>
    </>
  );
}
