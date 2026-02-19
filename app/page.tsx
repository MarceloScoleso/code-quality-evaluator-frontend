"use client";

import Image from "next/image";
import Link from "next/link";
import Footer from "./components/Footer";

export default function LandingPage() {
  return (
    <>
      <main className="hero-section min-h-screen flex flex-col relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950">

        {/* 🎇 Fundo animado */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
          <div className="animate-spin-slow absolute w-[600px] h-[600px] bg-gradient-to-r from-purple-600 to-blue-400 opacity-20 rounded-full -top-32 -left-32"></div>
          <div className="animate-pulse absolute w-[400px] h-[400px] bg-gradient-to-r from-blue-400 to-purple-500 opacity-10 rounded-full -bottom-20 -right-20"></div>
        </div>

        <div className="hero-content max-w-7xl mx-auto px-6 py-20 text-center space-y-10 flex-1 relative z-10">
          {/* Logo */}
          <div className="flex justify-center">
            <Image
              src="/Logo1.png"
              alt="Code Quality Evaluator"
              width={180}
              height={60}
              priority
              className="hover:scale-105 transition-transform duration-300 drop-shadow-lg"
            />
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
            Avaliação Inteligente de{" "}
            <span className="bg-gradient-to-r from-purple-500 to-blue-400 bg-clip-text text-transparent animate-gradient">
              Qualidade de Código
            </span>
          </h1>

          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            Analise métricas técnicas, monitore evolução de projetos e mantenha
            padrões elevados de qualidade de software com uma plataforma moderna e estratégica.
          </p>

          {/* CTAs */}
          <div className="flex justify-center gap-6 pt-6">
            <Link href="/auth/login" className="primary-cta hover:scale-105 transition-transform">
              Entrar
            </Link>

            <Link href="/auth/register" className="secondary-cta hover:scale-105 transition-transform">
              Criar Conta
            </Link>
          </div>
        </div>

        {/* Como funciona */}
        <section className="max-w-6xl mx-auto px-6 py-24 relative z-10 space-y-24 mb-20">
  <div className="text-center space-y-4">
    <h2 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-400">
      Como funciona a plataforma
    </h2>
    <p className="text-slate-400 max-w-2xl mx-auto text-lg">
      Fluxo simples, estratégico e orientado a dados para elevar o padrão
      de qualidade dos seus projetos.
    </p>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
    {[
      {
        number: "01",
        icon: "🔗",
        title: "Conecte seu repositório",
        description:
          "Integre seus projetos e permita que a plataforma analise métricas estruturais, complexidade, cobertura de testes e versionamento.",
      },
      {
        number: "02",
        icon: "📊",
        title: "Analise indicadores estratégicos",
        description:
          "Visualize dados consolidados que auxiliam na tomada de decisão técnica e no planejamento evolutivo do software.",
      },
      {
        number: "03",
        icon: "🚀",
        title: "Eleve o padrão de qualidade",
        description:
          "Utilize as classificações automatizadas para manter governança, reduzir débito técnico e evoluir continuamente seus projetos.",
      },
    ].map((step) => (
      <div
        key={step.number}
        className="relative p-8 rounded-3xl border border-purple-500/20 bg-gradient-to-tr from-slate-800/80 to-slate-900/95 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-transform"
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-purple-500 to-blue-400 bg-clip-text text-transparent">
            {step.number}
          </div>
          <div className="text-3xl">{step.icon}</div>
        </div>
        <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
        <p className="text-slate-400">{step.description}</p>
      </div>
    ))}
  </div>
</section>
      </main>

      <Footer />
    </>
  );
}
