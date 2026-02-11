"use client";

export default function Header() {
  return (
    <header className="mb-8">
      <div className="text-purple-600 uppercase tracking-wide font-bold">
        Code Quality Evaluator
      </div>
      <h1 className="text-3xl font-bold mt-1">Dashboard</h1>
      <p className="text-gray-500">
        Crie avaliações, veja histórico, filtre projetos e exporte CSV
      </p>
    </header>
  );
}