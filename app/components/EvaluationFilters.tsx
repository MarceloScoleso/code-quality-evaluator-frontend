"use client";

import { useState } from "react";

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

interface Props {
  filterName: string;
  setFilterName: (v: string) => void;

  filterLanguage: Language | "";
  setFilterLanguage: (v: Language | "") => void;

  filterClassification: Classification | "";
  setFilterClassification: (v: Classification | "") => void;

  filterMinScore: number | "";
  setFilterMinScore: (v: number | "") => void;

  filterMaxScore: number | "";
  setFilterMaxScore: (v: number | "") => void;

  filterStartDate: string;
  setFilterStartDate: (v: string) => void;

  filterEndDate: string;
  setFilterEndDate: (v: string) => void;

  onApply: () => void;
  
  buttonLabel?: string;
}



export default function EvaluationFilters({
  filterName,
  setFilterName,
  filterLanguage,
  setFilterLanguage,
  filterClassification,
  setFilterClassification,
  filterMinScore,
  setFilterMinScore,
  filterMaxScore,
  setFilterMaxScore,
  filterStartDate,
  setFilterStartDate,
  filterEndDate,
  setFilterEndDate,
  onApply,
  buttonLabel = "Aplicar Filtros",
}: Props) {
    const [open, setOpen] = useState(false);
  return (
  <div className="filter-card">

    {/* HEADER DO FILTRO */}
    <div
      onClick={() => setOpen(!open)}
      className="flex justify-between items-center cursor-pointer"
    >
      <h3 className="text-sm uppercase tracking-wider text-slate-400">
        Filtros Avançados
      </h3>

      <span className="text-sky-400 text-sm font-medium">
        {open ? "Ocultar ▲" : "Mostrar ▼"}
      </span>
    </div>

    {/* CONTEÚDO ANIMADO */}
    <div
      className={`transition-all duration-500 ease-in-out overflow-hidden ${
        open
          ? "max-h-[1000px] opacity-100 mt-6"
          : "max-h-0 opacity-0"
      }`}
    >

      {/* GRID */}
      <div className="filter-grid">

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

      {/* BOTÃO */}
      <div className="filter-actions">
        <button onClick={onApply} className="filter-btn">
            {buttonLabel}
        </button>
      </div>

    </div>
  </div>
);
}
