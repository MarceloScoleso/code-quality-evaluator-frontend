"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import BackToHomeButton from "@/app/components/BackToHomeButton";
import { API_URL } from "@/app/config/api";

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
  const [linesOfCode, setLinesOfCode] = useState<number | "">("");
  const [complexity, setComplexity] = useState<number | "">("");
  const [hasTests, setHasTests] = useState(true);
  const [usesGit, setUsesGit] = useState(true);
  const [analyzedBy, setAnalyzedBy] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setSuccess(false);

  try {
    const response = await fetch(`${API_URL}/api/evaluations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
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

    if (!response.ok) {
      throw new Error("Erro ao criar avaliação");
    }

    setSuccess(true);

    setTimeout(() => {
      router.push("/evaluations");
    }, 1500);

  } catch (error) {
    console.error(error);
    alert("Erro ao conectar com a API");
  } finally {
    setLoading(false);
  }
};

  return (
  <>
    <Header evaluations={[]} averageScore={0} />

    <main className="container min-h-screen">
      <div className="flex justify-end mb-6">
  <BackToHomeButton />
</div>
      <div className="max-w-2xl mx-auto space-y-10">

        <div className="space-y-4">

  <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-violet-500/10 text-violet-400 border border-violet-500/20">
    Quality Evaluator
  </div>

  <h1 className="text-4xl font-bold leading-tight">
    Criar Nova{" "}
    <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
      Avaliação Técnica
    </span>
  </h1>

  <p className="text-slate-400 max-w-xl leading-relaxed">
    Preencha as métricas do projeto e gere automaticamente
    uma classificação baseada em critérios técnicos,
    boas práticas e complexidade estrutural.
  </p>
<div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
</div>


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

 
  {/* BOTÃO */}
  
  <div className="pt-4">
    <button
      type="submit"
      disabled={loading}
      className="w-full text-base"
    >
      {loading ? "Gerando avaliação..." : "Gerar Avaliação Técnica"}
    </button>

    {success && (
      <div className="text-green-400 text-sm mt-4 text-center">
        ✅ Avaliação criada com sucesso! Redirecionando...
      </div>
    )}
  </div>

</form>

      </div>
    <Footer />
    </main>
    
    </>
  );
}
