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

export type EvaluationFormData = {
  projectName: string;
  language: Language;
  linesOfCode: number | "";
  complexity: number | "";
  hasTests: boolean;
  usesGit: boolean;
  analyzedBy: string;
  description: string;
};

type EvaluationFormProps = {
  initialData?: Partial<EvaluationFormData>;
  onSubmit: (data: EvaluationFormData) => Promise<void>;
  loading?: boolean;
  submitLabel?: string;
  success?: boolean;
  successMessage?: string;
  error?: string;
};

export default function EvaluationForm({
  initialData,
  onSubmit,
  loading = false,
  submitLabel = "Gerar Avaliação Técnica",
  success = false,
  successMessage = "✅ Avaliação criada com sucesso! Redirecionando...",
  error,
}: EvaluationFormProps) {
  const [projectName, setProjectName] = useState(
    initialData?.projectName ?? ""
  );
  const [language, setLanguage] = useState<Language>(
    initialData?.language ?? "JAVA"
  );
  const [linesOfCode, setLinesOfCode] = useState<number | "">(
    initialData?.linesOfCode ?? ""
  );
  const [complexity, setComplexity] = useState<number | "">(
    initialData?.complexity ?? ""
  );
  const [hasTests, setHasTests] = useState(
    initialData?.hasTests ?? true
  );
  const [usesGit, setUsesGit] = useState(
    initialData?.usesGit ?? true
  );
  const [analyzedBy, setAnalyzedBy] = useState(
    initialData?.analyzedBy ?? ""
  );
  const [description, setDescription] = useState(
    initialData?.description ?? ""
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await onSubmit({
      projectName,
      language,
      linesOfCode,
      complexity,
      hasTests,
      usesGit,
      analyzedBy,
      description,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="form-card space-y-8">
      
      {/* DADOS DO PROJETO */}
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-2">
            Nome do Projeto
          </label>
          <input
            type="text"
            placeholder="Ex: Quality Evaluator API"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Linguagem Principal
          </label>
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
        </div>
      </div>

      {/* MÉTRICAS TÉCNICAS */}
      <div className="space-y-5">
        <h3 className="text-sm uppercase tracking-wider text-slate-400">
          Métricas Técnicas
        </h3>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Linhas de Código
            </label>
            <input
              type="number"
              placeholder="Ex: 350"
              value={linesOfCode}
              onChange={(e) =>
                setLinesOfCode(
                  e.target.value === "" ? "" : Number(e.target.value)
                )
              }
            />
            <p className="text-xs text-slate-500 mt-1">
              Total estimado de linhas do projeto.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Complexidade (1 a 5)
            </label>
            <input
              type="number"
              min={1}
              max={5}
              placeholder="Ex: 3"
              value={complexity}
              onChange={(e) =>
                setComplexity(
                  e.target.value === "" ? "" : Number(e.target.value)
                )
              }
            />
            <p className="text-xs text-slate-500 mt-1">
              1 = simples · 5 = altamente complexo
            </p>
          </div>
        </div>
      </div>

      {/* QUALIDADE */}
      <div className="space-y-5">
        <h3 className="text-sm uppercase tracking-wider text-slate-400">
          Boas Práticas
        </h3>

        <div className="grid md:grid-cols-2 gap-6">
          <label className={`quality-toggle ${hasTests ? "active" : ""}`}>
            <input
              type="checkbox"
              checked={hasTests}
              onChange={(e) => setHasTests(e.target.checked)}
            />
            <div>
              <span className="font-semibold">Testes Automatizados</span>
              <p className="text-xs text-slate-400">
                Projeto possui cobertura de testes.
              </p>
            </div>
          </label>

          <label className={`quality-toggle ${usesGit ? "active" : ""}`}>
            <input
              type="checkbox"
              checked={usesGit}
              onChange={(e) => setUsesGit(e.target.checked)}
            />
            <div>
              <span className="font-semibold">Versionamento com Git</span>
              <p className="text-xs text-slate-400">
                Controle de versão estruturado.
              </p>
            </div>
          </label>
        </div>
      </div>

      {/* RESPONSÁVEL */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Responsável pela Análise
        </label>
        <input
          type="text"
          placeholder="Ex: Marcelo"
          value={analyzedBy}
          onChange={(e) => setAnalyzedBy(e.target.value)}
        />
      </div>

      {/* DESCRIÇÃO */}
      <div className="space-y-2">
        <label className="block text-sm font-medium mb-2">
          Descrição do Projeto (Opcional)
        </label>
        <textarea
          placeholder="Ex: Projeto que avalia a qualidade de APIs..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="w-full rounded-md border border-slate-700 bg-slate-900 text-slate-200 px-3 py-2 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none"
        />
        <p className="text-xs text-slate-500">
          Você pode fornecer sua própria descrição. Caso não preencha, o sistema irá gerar automaticamente.
        </p>
      </div>

      {/* BOTÃO */}
<div className="pt-4">
  <button
    type="submit"
    disabled={loading}
    className="w-full text-base"
  >
    {loading ? "Processando..." : submitLabel}
  </button>

  {success && (
    <div className="text-green-400 text-sm mt-4 text-center animate-pulse">
      {successMessage}
    </div>
    
  )}
</div>
{error && (
  <div className="text-red-400 text-sm mt-4 text-center">
    ❌ {error}
  </div>
)}

    </form>
  );
}