"use client";

import Link from "next/link";
import Image from "next/image";
import Footer from "./components/Footer";
import LanguageSwitcher from "./components/LanguageSwitcher";
import { useTranslation } from "react-i18next";

export default function LandingPage() {
  const { t } = useTranslation();

  const steps = [
    { number: "01", icon: "📝",  title: t("landing.howItWorks.steps.0.title"), description: t("landing.howItWorks.steps.0.description") },
    { number: "02", icon: "⚙️",  title: t("landing.howItWorks.steps.1.title"), description: t("landing.howItWorks.steps.1.description") },
    { number: "03", icon: "📈",  title: t("landing.howItWorks.steps.2.title"), description: t("landing.howItWorks.steps.2.description") },
  ];

  const stats = [
    { val: t("landing.stats.levels"),    label: t("landing.stats.levelsSub")  },
    { val: t("landing.stats.auto"),      label: t("landing.stats.autoSub")    },
    { val: t("landing.stats.metrics"),   label: t("landing.stats.metricsSub") },
    { val: t("landing.stats.dashboard"), label: t("landing.stats.dashSub")    },
  ];

  const metrics = [
    { name: t("landing.howItWorks.mockup.testCoverage"),         pct: 82  },
    { name: t("landing.howItWorks.mockup.structuralComplexity"), pct: 91  },
    { name: t("landing.howItWorks.mockup.versionControl"),       pct: 100 },
    { name: t("landing.howItWorks.mockup.bestPractices"),        pct: 74  },
  ];

  const ctaFeatures = t("landing.cta.features", { returnObjects: true }) as string[];

  return (
    <div className="font-sans bg-slate-950 text-slate-100 overflow-x-hidden">

      {/* ══ NAV ══ */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-12 py-[18px] border-b border-slate-800 bg-[rgba(8,12,20,0.75)] backdrop-blur-xl">
        <Image src="/Logo1.png" alt="CodeQuality" width={180} height={60} className="object-contain" />
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <Link
            href="/auth/login"
            className="inline-flex items-center px-[22px] py-[9px] rounded-[10px] text-sm font-medium border border-violet-500/30 text-violet-400 bg-transparent transition-all duration-200 hover:bg-violet-500/10 hover:border-violet-500 hover:shadow-[0_0_20px_rgba(139,92,246,0.35)] hover:-translate-y-px"
          >
            {t("landing.nav.login")}
          </Link>
          <Link
            href="/auth/register"
            className="inline-flex items-center px-[22px] py-[9px] rounded-[10px] text-sm font-semibold border border-transparent text-white bg-gradient-to-br from-violet-500 to-indigo-500 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(139,92,246,0.35)]"
          >
            {t("landing.nav.register")}
          </Link>
        </div>
      </nav>

      {/* ══ HERO ══ */}
      <section
        className="relative min-h-screen flex flex-col justify-center items-center text-center px-12 pt-[120px] pb-20"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      >
        <div className="absolute w-[900px] h-[900px] rounded-full -top-40 left-1/2 -translate-x-1/2 pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(139,92,246,0.28) 0%, transparent 60%)" }} />
        <div className="absolute w-[500px] h-[500px] rounded-full bottom-0 right-[5%] pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(56,189,248,0.18) 0%, transparent 65%)" }} />

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-400/40 bg-violet-400/[0.12] text-[0.72rem] font-semibold tracking-[0.12em] uppercase text-violet-300 mb-7">
          <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
          {t("landing.hero.eyebrow")}
        </div>

        <h1 className="font-extrabold text-[clamp(2.8rem,6vw,5rem)] leading-[1.08] tracking-[-0.03em] max-w-[780px] mx-auto mb-6 text-white">
          {t("landing.hero.titleLine1")}
          <span className="block bg-gradient-to-br from-violet-400 to-sky-300 bg-clip-text text-transparent">
            {t("landing.hero.titleLine2")}
          </span>
        </h1>

        <p className="max-w-[520px] mx-auto mb-12 text-base leading-relaxed text-slate-300 font-light">
          {t("landing.hero.subtitle")}
        </p>

        <div className="relative z-20 flex gap-3.5 justify-center flex-wrap">
          <Link
            href="/auth/register"
            className="relative inline-flex items-center gap-2 overflow-hidden px-9 py-3.5 rounded-[14px] font-bold text-[0.9rem] tracking-[0.02em] text-white bg-gradient-to-br from-violet-400 via-violet-500 to-indigo-500 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_50px_rgba(139,92,246,0.65)] before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/30 before:to-transparent before:-translate-x-full before:transition-transform before:duration-500 hover:before:translate-x-full"
          >
            {t("landing.hero.ctaStart")}
          </Link>
          <Link
            href="/auth/login"
            className="inline-flex items-center px-9 py-3.5 rounded-[14px] font-bold text-[0.9rem] tracking-[0.02em] border border-sky-300/70 text-sky-200 bg-sky-400/[0.15] backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-sky-400/[0.25] hover:border-sky-200 hover:text-white hover:shadow-[0_16px_40px_rgba(56,189,248,0.45)]"
          >
            {t("landing.hero.ctaLogin")}
          </Link>
        </div>
      </section>

      {/* ══ STATS STRIP ══ */}
      <div className="flex justify-center border-t border-b border-slate-700/70 bg-slate-900/70 overflow-hidden">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className={`flex-1 max-w-[240px] px-8 py-8 text-center transition-colors duration-300 hover:bg-violet-500/[0.08] ${i < stats.length - 1 ? "border-r border-slate-700/70" : ""}`}
          >
            <div className="font-extrabold text-[2rem] leading-none bg-gradient-to-r from-violet-400 to-sky-300 bg-clip-text text-transparent">
              {s.val}
            </div>
            <div className="mt-2 text-[0.72rem] font-medium tracking-[0.1em] uppercase text-slate-400">
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* ══ HOW IT WORKS ══ */}
      <div className="max-w-[1200px] mx-auto px-12 py-[100px]">
        <div className="flex items-center gap-2.5 mb-4 text-[0.7rem] font-bold tracking-[0.15em] uppercase text-sky-400 before:block before:w-7 before:h-px before:bg-sky-400">
          {t("landing.howItWorks.eyebrow")}
        </div>
        <h2 className="font-extrabold text-[clamp(1.8rem,3.5vw,2.8rem)] tracking-[-0.025em] leading-[1.15] mb-4">
          {t("landing.howItWorks.title")}<br />
          <span className="text-sky-400">{t("landing.howItWorks.titleAccent")}</span>
        </h2>
        <p className="text-[0.95rem] text-slate-400 leading-relaxed max-w-[440px] mb-16">
          {t("landing.howItWorks.subtitle")}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-start">
          <div className="flex flex-col gap-4">
            {steps.map((s) => (
              <div
                key={s.number}
                className="group relative flex gap-5 p-6 rounded-2xl border border-slate-800 bg-slate-900/60 transition-all duration-300 hover:border-violet-500/40 hover:bg-violet-500/[0.05] hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(139,92,246,0.15)] cursor-default overflow-hidden"
              >
                <div className="absolute right-4 top-1/2 -translate-y-1/2 font-extrabold text-[5rem] leading-none select-none pointer-events-none text-white/[0.03] group-hover:text-violet-400/[0.07] transition-colors duration-300">
                  {s.number}
                </div>
                <div className="relative z-10 flex flex-col items-center gap-1.5 flex-shrink-0 pt-0.5">
                  <span className="text-[0.62rem] font-bold tracking-[0.1em] uppercase text-slate-500 group-hover:text-violet-400 transition-colors duration-300">
                    {s.number}
                  </span>
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl bg-slate-800 border border-slate-700 group-hover:border-violet-500/50 group-hover:bg-violet-500/10 transition-all duration-300">
                    {s.icon}
                  </div>
                </div>
                <div className="relative z-10 flex-1">
                  <div className="font-bold text-[0.95rem] text-white mb-1.5 group-hover:text-violet-100 transition-colors duration-300">
                    {s.title}
                  </div>
                  <p className="text-[0.83rem] leading-relaxed text-slate-400">{s.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* mockup panel */}
          <div className="sticky top-[120px]">
            <div className="rounded-3xl overflow-hidden border border-slate-800 bg-slate-900">
              <div className="flex items-center gap-2 px-5 py-4 bg-white/[0.03] border-b border-slate-800">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
                <span className="ml-2 text-[0.72rem] text-slate-500 tracking-[0.08em]">score_analysis.json</span>
              </div>
              <div className="p-7">
                <div className="flex justify-center items-center py-8 pb-6">
                  <div
                    className="w-[140px] h-[140px] rounded-full flex flex-col items-center justify-center"
                    style={{ border: "3px solid transparent", background: "linear-gradient(#0F172A, #0F172A) padding-box, linear-gradient(135deg, #8B5CF6, #38BDF8) border-box" }}
                  >
                    <span className="font-extrabold text-[2.4rem] leading-none bg-gradient-to-br from-violet-400 to-sky-300 bg-clip-text text-transparent">87</span>
                    <span className="text-[0.65rem] tracking-[0.1em] uppercase text-slate-500 mt-1">SCORE</span>
                  </div>
                </div>
                <div className="flex flex-col gap-3.5">
                  {metrics.map((m) => (
                    <div key={m.name} className="flex flex-col gap-1.5">
                      <div className="flex justify-between items-center">
                        <span className="text-[0.78rem] text-slate-400">{m.name}</span>
                        <span className="text-[0.78rem] font-semibold text-slate-200">{m.pct}%</span>
                      </div>
                      <div className="h-1 rounded-full bg-white/[0.06] overflow-hidden">
                        <div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-sky-400 transition-all duration-1000" style={{ width: `${m.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-5 text-center">
                  <span className="inline-flex items-center gap-1.5 px-[18px] py-1.5 rounded-full border border-green-500/40 bg-green-500/10 text-[0.75rem] font-bold tracking-[0.08em] text-green-400 uppercase">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    {t("landing.howItWorks.mockup.classification")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══ BOTTOM CTA ══ */}
      <div className="relative mx-12 mb-20 rounded-[28px] overflow-hidden border border-slate-700/50">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-950/80 via-slate-900 to-sky-950/60" />
        <div className="absolute inset-0 pointer-events-none opacity-60"
          style={{ backgroundImage: "radial-gradient(rgba(139,92,246,0.12) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
        <div className="absolute -top-28 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(139,92,246,0.35), transparent 70%)" }} />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(56,189,248,0.2), transparent 70%)" }} />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10 px-16 py-16">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-violet-400/30 bg-violet-400/[0.08] text-[0.65rem] font-bold tracking-[0.14em] uppercase text-violet-300 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
              {t("landing.cta.eyebrow")}
            </div>
            <h2 className="font-extrabold text-[clamp(1.8rem,3vw,2.6rem)] tracking-[-0.03em] leading-[1.1] text-white mb-4">
              {t("landing.cta.title")}<br />
              <span className="bg-gradient-to-r from-violet-400 to-sky-300 bg-clip-text text-transparent">
                {t("landing.cta.titleAccent")}
              </span>
            </h2>
            <p className="text-[0.9rem] text-slate-400 leading-relaxed max-w-[380px]">
              {t("landing.cta.subtitle")}
            </p>
          </div>

          <div className="flex-shrink-0 w-full md:w-[300px]">
            <div className="flex flex-col gap-5 p-7 rounded-2xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-sm">
              <div className="flex flex-col gap-3">
                {ctaFeatures.map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center flex-shrink-0">
                      <span className="text-green-400 text-[0.6rem] font-bold">✓</span>
                    </div>
                    <span className="text-[0.82rem] text-slate-300">{item}</span>
                  </div>
                ))}
              </div>
              <div className="h-px bg-white/[0.07]" />
              <Link
                href="/auth/register"
                className="relative inline-flex items-center justify-center gap-2 overflow-hidden px-6 py-3.5 rounded-xl font-bold text-[0.9rem] text-white bg-gradient-to-br from-violet-500 to-indigo-500 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(139,92,246,0.5)] before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/20 before:to-transparent before:-translate-x-full before:transition-transform before:duration-500 hover:before:translate-x-full"
              >
                {t("landing.cta.createAccount")}
              </Link>
              <Link href="/auth/login" className="text-center text-[0.8rem] text-slate-500 hover:text-slate-300 transition-colors">
                {t("landing.cta.alreadyHave")}
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}