"use client";

import { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { Plus, BarChart2, Download, TrendingUp, Zap, Clock, FileText } from "lucide-react";
import { apiFetch } from "@/app/lib/api";
import { useTranslation } from "react-i18next";

interface Stats { total: number; averageScore: number; excellentCount: number; }

const accentMap: Record<string, { border: string; bg: string; icon: string; glow: string }> = {
  violet: { border: "border-violet-500/25 hover:border-violet-500/50", bg: "group-hover:bg-violet-500/[0.05]", icon: "bg-violet-500/10 border-violet-500/25 text-violet-400", glow: "hover:shadow-[0_16px_40px_rgba(139,92,246,0.12)]" },
  sky:    { border: "border-sky-500/25 hover:border-sky-500/50",       bg: "group-hover:bg-sky-500/[0.05]",    icon: "bg-sky-500/10 border-sky-500/25 text-sky-400",       glow: "hover:shadow-[0_16px_40px_rgba(56,189,248,0.12)]"  },
  green:  { border: "border-green-500/25 hover:border-green-500/50",   bg: "group-hover:bg-green-500/[0.05]",  icon: "bg-green-500/10 border-green-500/25 text-green-400", glow: "hover:shadow-[0_16px_40px_rgba(34,197,94,0.12)]"   },
};

export default function Page() {
  const [stats, setStats] = useState<Stats>({ total: 0, averageScore: 0, excellentCount: 0 });
  const { token, isLoading } = useAuth();
  const router = useRouter();
  const { t }  = useTranslation();

  const features = [
    { icon: <Zap size={20} />,      label: t("home.features.items.0.label"), desc: t("home.features.items.0.desc"), accent: "violet" },
    { icon: <Clock size={20} />,    label: t("home.features.items.1.label"), desc: t("home.features.items.1.desc"), accent: "sky"    },
    { icon: <FileText size={20} />, label: t("home.features.items.2.label"), desc: t("home.features.items.2.desc"), accent: "green"  },
  ];

  useEffect(() => { if (!isLoading && !token) router.push("/auth/login"); }, [token, isLoading, router]);
  useEffect(() => {
    if (!token) return;
    apiFetch("/api/evaluations/stats").then((r) => r.json()).then(setStats).catch(() => setStats({ total: 0, averageScore: 0, excellentCount: 0 }));
  }, [token]);

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <div className="flex items-center gap-3 text-slate-400 text-sm">
        <span className="w-4 h-4 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
        {t("common.checkingAuth")}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Header />
      <main className="flex-1">

        <section className="relative overflow-hidden pt-20 pb-16 px-6">
          <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)", backgroundSize: "56px 56px", WebkitMaskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, black 20%, transparent 100%)", maskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, black 20%, transparent 100%)" }} />
          <div className="absolute -top-28 left-1/2 -translate-x-1/2 w-[700px] h-[480px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 65%)" }} />
          <div className="absolute top-10 right-10 w-64 h-64 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(56,189,248,0.09) 0%, transparent 70%)" }} />

          <div className="relative z-10 max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-400/30 bg-violet-400/[0.07] text-[0.68rem] font-semibold tracking-[0.14em] uppercase text-violet-300 mb-7">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
              {t("home.eyebrow")}
            </div>
            <h1 className="font-extrabold text-[clamp(2.2rem,5vw,3.6rem)] leading-[1.35] tracking-[-0.03em] text-white mb-8">
              {t("home.title")}
              <span className="block mt-2 bg-gradient-to-r from-violet-400 to-sky-300 bg-clip-text text-transparent">{t("home.titleAccent")}</span>
            </h1>
            <p className="max-w-lg mx-auto text-[0.9rem] text-slate-400 leading-relaxed font-light mb-10">{t("home.subtitle")}</p>

            <div className="flex flex-wrap justify-center gap-3 mb-10">
              <a href="/evaluations/new" className="relative inline-flex items-center gap-2 overflow-hidden px-6 py-2.5 rounded-xl font-bold text-sm text-white bg-gradient-to-br from-violet-500 to-indigo-500 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(139,92,246,0.4)] before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/15 before:to-transparent before:-translate-x-full before:transition-transform before:duration-500 hover:before:translate-x-full">
                <Plus size={15} />{t("home.newEvaluation")}
              </a>
              <a href="/evaluations/historic" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm border border-sky-400/35 text-sky-300 bg-sky-400/[0.07] transition-all duration-300 hover:-translate-y-0.5 hover:bg-sky-400/[0.14] hover:border-sky-300 hover:shadow-[0_12px_24px_rgba(56,189,248,0.18)]">
                <BarChart2 size={15} />{t("home.history")}
              </a>
              <a href="/evaluations/export/csv" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm border border-green-400/30 text-green-300 bg-green-400/[0.06] transition-all duration-300 hover:-translate-y-0.5 hover:bg-green-400/[0.13] hover:border-green-300 hover:shadow-[0_12px_24px_rgba(34,197,94,0.15)]">
                <Download size={15} />{t("home.exportCsv")}
              </a>
            </div>

            <div className="flex items-center gap-4 max-w-xs mx-auto mb-7">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent to-slate-800" />
              <span className="text-[0.62rem] font-medium tracking-widest uppercase text-slate-700">{t("home.quickAccess")}</span>
              <div className="flex-1 h-px bg-gradient-to-l from-transparent to-slate-800" />
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              <a href="/evaluations/dashboard" className="group inline-flex items-center gap-3 px-7 py-3.5 rounded-2xl text-sm text-white border border-violet-400/20 bg-gradient-to-br from-violet-950/60 to-slate-900/80 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-violet-400/45 hover:shadow-[0_14px_36px_rgba(139,92,246,0.22)]">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-violet-500 to-indigo-500 flex-shrink-0 transition-transform duration-300 group-hover:scale-110">
                  <TrendingUp size={15} />
                </div>
                <div className="text-left">
                  <div className="font-bold text-[0.875rem] text-white leading-none mb-0.5">{t("home.dashboard.title")}</div>
                  <div className="text-[0.7rem] text-slate-400 font-normal">{t("home.dashboard.subtitle")}</div>
                </div>
                <span className="ml-1 text-slate-600 group-hover:text-violet-400 group-hover:translate-x-1 transition-all duration-300 text-sm">→</span>
              </a>
            </div>
          </div>
        </section>

        <section className="max-w-5xl mx-auto px-6 pt-4 pb-14">
          <div className="flex items-center gap-2.5 mb-8 text-[0.66rem] font-bold tracking-[0.15em] uppercase text-sky-400 before:block before:w-5 before:h-px before:bg-sky-400">
            {t("home.features.eyebrow")}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {features.map((f) => {
              const a = accentMap[f.accent];
              return (
                <div key={f.label} className={`group relative p-6 rounded-2xl border bg-slate-900/40 transition-all duration-300 cursor-default overflow-hidden hover:-translate-y-1 ${a.border} ${a.glow}`}>
                  <div className={`absolute inset-0 transition-colors duration-300 rounded-2xl ${a.bg}`} />
                  <div className={`relative z-10 w-10 h-10 rounded-xl flex items-center justify-center border mb-4 transition-transform duration-300 group-hover:scale-110 ${a.icon}`}>{f.icon}</div>
                  <h3 className="relative z-10 font-bold text-[0.92rem] text-white mb-2">{f.label}</h3>
                  <p className="relative z-10 text-[0.8rem] leading-relaxed text-slate-500">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="max-w-5xl mx-auto px-6 pb-16">
          <div className="relative rounded-3xl overflow-hidden border border-slate-800/70">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-950/60 via-slate-900 to-sky-950/40" />
            <div className="absolute inset-0 pointer-events-none opacity-40" style={{ backgroundImage: "radial-gradient(rgba(139,92,246,0.09) 1px, transparent 1px)", backgroundSize: "22px 22px" }} />
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[480px] h-[180px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(139,92,246,0.22), transparent 70%)" }} />
            <div className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(56,189,248,0.1), transparent 70%)" }} />

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 px-10 py-10">
              <div className="flex-1 text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-sky-400/25 bg-sky-400/[0.06] text-[0.62rem] font-bold tracking-[0.14em] uppercase text-sky-400 mb-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
                  {t("home.banner.eyebrow")}
                </div>
                <h3 className="font-extrabold text-[clamp(1.3rem,2.5vw,1.9rem)] tracking-tight leading-snug text-white mb-3">
                  {t("home.banner.title")}
                  <span className="block bg-gradient-to-r from-violet-400 to-sky-300 bg-clip-text text-transparent">{t("home.banner.titleAccent")}</span>
                </h3>
                <p className="text-[0.82rem] text-slate-400 leading-relaxed max-w-sm">{t("home.banner.subtitle")}</p>
              </div>

              <div className="flex-shrink-0 flex flex-col items-center gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-[110px] h-[110px] rounded-full flex flex-col items-center justify-center" style={{ border: "2px solid transparent", background: "linear-gradient(#0F172A, #0F172A) padding-box, linear-gradient(135deg, #8B5CF6, #38BDF8) border-box" }}>
                    <span className="font-extrabold text-[1.9rem] leading-none bg-gradient-to-br from-violet-400 to-sky-300 bg-clip-text text-transparent">
                      {stats.averageScore > 0 ? stats.averageScore : "—"}
                    </span>
                    <span className="text-[0.55rem] tracking-[0.1em] uppercase text-slate-500 mt-1">{t("home.banner.avg")}</span>
                  </div>
                  <p className="text-[0.67rem] text-slate-600 mt-2 tracking-wide">
                    {stats.total} {stats.total === 1 ? t("home.banner.evaluation") : t("home.banner.evaluations")}
                  </p>
                </div>
                <a href="/evaluations/dashboard" className="relative inline-flex items-center gap-2 overflow-hidden px-5 py-2.5 rounded-xl font-bold text-[0.8rem] text-white bg-gradient-to-br from-violet-500 to-indigo-500 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(139,92,246,0.38)] before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/15 before:to-transparent before:-translate-x-full before:transition-transform before:duration-500 hover:before:translate-x-full">
                  <TrendingUp size={13} />{t("home.banner.viewDashboard")}
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}