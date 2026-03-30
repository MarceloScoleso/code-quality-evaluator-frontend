"use client";
 
import { useEffect, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import BackToHomeButton from "@/app/components/BackToHomeButton";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/app/lib/api";
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, CartesianGrid,
  ResponsiveContainer, LineChart, Line, Area,
} from "recharts";
import { TrendingUp, FlaskConical, GitBranch, LayoutDashboard } from "lucide-react";
import { useTranslation } from "react-i18next";
 
interface DashboardSummary {
  total: number;
  averageScore: number;
  excellent: number;
  good: number;
  regular: number;
  bad: number;
  byLanguage: Record<string, number>;
  scoreEvolution: Record<string, number>;
  testsPercentage: number;
  gitPercentage: number;
}
 
const tooltipStyle = {
  contentStyle: {
    backgroundColor: "#0D1117",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: "12px",
    boxShadow: "0 16px 40px rgba(0,0,0,0.5)",
  },
  labelStyle:   { color: "#F1F5F9", fontWeight: 600, fontSize: 12 },
  itemStyle:    { color: "#94A3B8", fontSize: 12 },
};
 
const sectionTagCls =
  "flex items-center gap-2.5 text-[0.68rem] font-bold tracking-[0.14em] uppercase text-sky-400 before:block before:w-5 before:h-px before:bg-sky-400 mb-4";
 
const chartCardCls =
  "rounded-2xl border border-slate-800 bg-slate-900/50 p-6";
 
export default function DashboardPage() {
  const { t } = useTranslation();
  const { token, isLoading } = useAuth();
  const router = useRouter();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [error, setError]     = useState<string | null>(null);
 
  useEffect(() => {
    if (!isLoading && !token) router.push("/auth/login");
  }, [token, isLoading, router]);
 
  useEffect(() => {
    if (!token) return;
    apiFetch("/api/evaluations/dashboard")
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then(setSummary)
      .catch(() => setError(t("dashboard.errorLoad")));
  }, [token]);
 
  if (isLoading || !summary) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-950">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          {error ? (
            <div className="flex items-center gap-3 text-red-400 text-sm">
              <span className="text-xl">⚠</span>
              {error}
            </div>
          ) : (
            <div className="flex items-center gap-3 text-slate-400 text-sm">
              <span className="w-4 h-4 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
              {t("common.loadingDashboard")}
            </div>
          )}
        </div>
      </div>
    );
  }
 
  /* ── dados dos gráficos ── */
  const classificationData = [
    { name: t("dashboard.classLabels.EXCELENTE"), value: summary.excellent, color: "#22C55E" },
    { name: t("dashboard.classLabels.BOM"),       value: summary.good,      color: "#38BDF8" },
    { name: t("dashboard.classLabels.REGULAR"),   value: summary.regular,   color: "#FACC15" },
    { name: t("dashboard.classLabels.RUIM"),      value: summary.bad,       color: "#EF4444" },
  ];
 
  const languageData = Object.entries(summary.byLanguage).map(([name, value]) => ({ name, value }));
 
  const scoreEvolution = Object.keys(summary.scoreEvolution)
    .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
    .map((date) => ({ date, score: summary.scoreEvolution[date] }));
 
  /* ── KPIs ── */
  const kpis = [
    {
      label: t("dashboard.kpis.total"),
      value: summary.total,
      icon: <LayoutDashboard size={18} />,
      color: "text-violet-400",
      dim: "bg-violet-500/10 border-violet-500/20",
    },
    {
      label: t("dashboard.kpis.avgScore"),
      value: summary.averageScore.toFixed(1),
      icon: <TrendingUp size={18} />,
      color: "text-sky-400",
      dim: "bg-sky-500/10 border-sky-500/20",
    },
    {
      label: t("dashboard.kpis.testsPercent"),
      value: `${summary.testsPercentage.toFixed(1)}%`,
      icon: <FlaskConical size={18} />,
      color: "text-green-400",
      dim: "bg-green-500/10 border-green-500/20",
    },
    {
      label: t("dashboard.kpis.gitPercent"),
      value: `${summary.gitPercentage.toFixed(1)}%`,
      icon: <GitBranch size={18} />,
      color: "text-yellow-400",
      dim: "bg-yellow-500/10 border-yellow-500/20",
    },
  ];
 
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Header />
 
      <main className="flex-1 pt-8 pb-20">
        <div className="max-w-6xl mx-auto px-6 space-y-10">
 
          {/* ── back ── */}
          <BackToHomeButton />
 
          {/* ── cabeçalho ── */}
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-violet-500/25 bg-violet-500/[0.08] text-[0.68rem] font-semibold tracking-[0.12em] uppercase text-violet-400 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
              {t("dashboard.eyebrow")}
            </div>
 
            <h1 className="font-extrabold text-[clamp(1.9rem,4vw,2.8rem)] leading-[1.1] tracking-[-0.025em] text-white mb-4">
              {t("dashboard.title")}{" "}
              <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                {t("dashboard.titleAccent")}
              </span>
            </h1>
 
            <p className="text-[0.88rem] text-slate-400 leading-relaxed max-w-lg font-light">
              {t("dashboard.subtitle")}
            </p>
 
            <div className="mt-6 h-px bg-gradient-to-r from-violet-500/20 via-slate-700/60 to-transparent" />
          </div>
 
          {/* ── KPI cards ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {kpis.map((kpi) => (
              <div
                key={kpi.label}
                className={`flex flex-col items-start gap-3 p-5 rounded-2xl border transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(0,0,0,0.3)] ${kpi.dim}`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${kpi.dim} ${kpi.color}`}>
                  {kpi.icon}
                </div>
                <div>
                  <p className={`font-extrabold text-2xl leading-none mb-1 ${kpi.color}`}>
                    {kpi.value}
                  </p>
                  <p className="text-[0.72rem] font-medium text-slate-500 uppercase tracking-wide">
                    {kpi.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
 
          {/* ── barra de progresso de boas práticas ── */}
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { label: t("dashboard.charts.testsPractices"), pct: summary.testsPercentage, color: "from-green-500 to-emerald-400", text: "text-green-400" },
              { label: t("dashboard.charts.gitPractices"),   pct: summary.gitPercentage,   color: "from-sky-500 to-blue-400",    text: "text-sky-400"   },
            ].map((b) => (
              <div key={b.label} className={`${chartCardCls} flex flex-col gap-3`}>
                <div className="flex justify-between items-center">
                  <span className="text-[0.78rem] text-slate-400">{b.label}</span>
                  <span className={`font-extrabold text-lg ${b.text}`}>{b.pct.toFixed(1)}%</span>
                </div>
                <div className="h-2 rounded-full bg-white/[0.05] overflow-hidden">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${b.color} transition-all duration-1000`}
                    style={{ width: `${b.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
 
          {/* ── gráficos: pizza + barras ── */}
          <div className="grid lg:grid-cols-2 gap-6">
 
            {/* pizza — classificação */}
            <div className={chartCardCls}>
              <div className={sectionTagCls}>{t("dashboard.charts.classification")}</div>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <defs>
                    {classificationData.map((d) => (
                      <linearGradient key={d.name} id={`grad-${d.name}`} x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor={d.color} stopOpacity={1} />
                        <stop offset="100%" stopColor={d.color} stopOpacity={0.7} />
                      </linearGradient>
                    ))}
                  </defs>
                  <Pie
                    data={classificationData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={110}
                    innerRadius={58}
                    paddingAngle={4}
                    label={({ name, percent }) =>
                      `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                    }
                    labelLine={false}
                  >
                    {classificationData.map((d) => (
                      <Cell key={d.name} fill={`url(#grad-${d.name})`} />
                    ))}
                  </Pie>
                  <Tooltip {...tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
 
              {/* legenda manual */}
              <div className="flex flex-wrap gap-3 mt-2 justify-center">
                {classificationData.map((d) => (
                  <div key={d.name} className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: d.color }} />
                    <span className="text-[0.7rem] text-slate-500">{d.name}</span>
                  </div>
                ))}
              </div>
            </div>
 
            {/* barras — linguagem */}
            <div className={chartCardCls}>
              <div className={sectionTagCls}>{t("dashboard.charts.byLanguage")}</div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={languageData} barSize={28}>
                  <defs>
                    <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%"   stopColor="#8B5CF6" />
                      <stop offset="100%" stopColor="#6366F1" stopOpacity={0.7} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="name" stroke="#475569" tick={{ fontSize: 11, fill: "#64748B" }} axisLine={false} tickLine={false} />
                  <YAxis stroke="#475569" tick={{ fontSize: 11, fill: "#64748B" }} axisLine={false} tickLine={false} />
                  <Tooltip {...tooltipStyle} cursor={{ fill: "rgba(139,92,246,0.06)" }} />
                  <Bar dataKey="value" fill="url(#barGrad)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
 
          </div>
 
          {/* ── evolução do score ── */}
          <div className={chartCardCls}>
            <div className={sectionTagCls}>{t("dashboard.charts.scoreEvolution")}</div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={scoreEvolution} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                <defs>
                  <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor="#8B5CF6" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="date" stroke="#475569" tick={{ fontSize: 11, fill: "#64748B" }} axisLine={false} tickLine={false} />
                <YAxis stroke="#475569" tick={{ fontSize: 11, fill: "#64748B" }} axisLine={false} tickLine={false} domain={[0, 100]} />
                <Tooltip
                  {...tooltipStyle}
                  formatter={(value: number | undefined) => [
                    (value ?? 0).toFixed(1),
                    t("dashboard.charts.avgScore"),
                  ]}
                />
                <Area type="monotone" dataKey="score" stroke="none" fill="url(#areaGrad)" />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#8B5CF6"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: "#8B5CF6", strokeWidth: 2, stroke: "#0D1117" }}
                  activeDot={{ r: 7, fill: "#8B5CF6", stroke: "#0D1117", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
 
          {/* ── breakdown de classificação ── */}
          <div className={chartCardCls}>
            <div className={sectionTagCls}>{t("dashboard.charts.breakdown")}</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-2">
              {classificationData.map((d) => {
                const pct = summary.total > 0 ? ((d.value / summary.total) * 100).toFixed(1) : "0.0";
                return (
                  <div key={d.name} className="flex flex-col gap-2 p-4 rounded-xl border border-white/[0.05] bg-white/[0.02]">
                    <div className="flex justify-between items-center">
                      <span className="text-[0.7rem] font-bold uppercase tracking-wider" style={{ color: d.color }}>{d.name}</span>
                      <span className="font-extrabold text-lg text-white leading-none">{d.value}</span>
                    </div>
                    <div className="h-1 rounded-full bg-white/[0.05] overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: d.color }} />
                    </div>
                    <span className="text-[0.65rem] text-slate-600">{pct} {t("dashboard.charts.ofTotal")}</span>
                  </div>
                );
              })}
            </div>
          </div>
 
        </div>
      </main>
 
      <Footer />
    </div>
  );
}