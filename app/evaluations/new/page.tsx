"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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

export default function NewEvaluationPage() {
  const router = useRouter();

  const [projectName, setProjectName] = useState("");
  const [language, setLanguage] = useState<Language>("JAVA");
  const [linesOfCode, setLinesOfCode] = useState(0);
  const [complexity, setComplexity] = useState(1);
  const [hasTests, setHasTests] = useState(true);
  const [usesGit, setUsesGit] = useState(true);
  const [analyzedBy, setAnalyzedBy] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

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

    setLoading(false);
    setSuccess(true);

    // Reset form
    setProjectName("");
    setLanguage("JAVA");
    setLinesOfCode(0);
    setComplexity(1);
    setHasTests(true);
    setUsesGit(true);
    setAnalyzedBy("");

    // opcional: redirecionar após 2s
    setTimeout(() => {
      router.push("/evaluations");
    }, 1500);
  };

  return (
    <main className="container min-h-screen">

      <div className="max-w-2xl mx-auto space-y-10">

        <div className="space-y-3">
          <h1 className="text-3xl font-bold">
            Nova Avaliação
          </h1>

          <p className="text-slate-400">
            Insira as informações do projeto para gerar
            automaticamente a classificação técnica.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="form-card">

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

          <div className="flex gap-6 text-sm">

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={hasTests}
                onChange={(e) => setHasTests(e.target.checked)}
              />
              Possui Testes Automatizados
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={usesGit}
                onChange={(e) => setUsesGit(e.target.checked)}
              />
              Utiliza Git
            </label>

          </div>

          <input
            type="text"
            placeholder="Responsável pela Análise"
            value={analyzedBy}
            onChange={(e) => setAnalyzedBy(e.target.value)}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Gerando..." : "Gerar Avaliação"}
          </button>

          {success && (
            <div className="text-green-400 text-sm">
              ✅ Avaliação criada com sucesso! Redirecionando...
            </div>
          )}

        </form>

      </div>

    </main>
  );
}
