"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import { API_URL } from "@/app/config/api";
import { useTranslation } from "react-i18next";

export default function LoginPage() {
  const { login } = useAuth();
  const router    = useRouter();
  const { t }     = useTranslation();

  const features = [
    { icon: "⚡", title: t("login.features.0.title"), desc: t("login.features.0.desc") },
    { icon: "📊", title: t("login.features.1.title"), desc: t("login.features.1.desc") },
    { icon: "🔍", title: t("login.features.2.title"), desc: t("login.features.2.desc") },
  ];

  const [email, setEmail]               = useState("");
  const [password, setPassword]         = useState("");
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) { alert(t("login.invalidCredentials")); return; }
    const data = await res.json();
    login(data.token);
    router.push("/evaluations");
  }

  return (
    <div className="min-h-screen flex bg-slate-950 overflow-hidden">

      {/* ══ PAINEL ESQUERDO ══ */}
      <aside className="hidden lg:flex relative w-[52%] flex-shrink-0 flex-col justify-between px-14 py-12 overflow-hidden bg-slate-950">
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.055) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
        <div className="absolute top-1/2 left-[40%] -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(139,92,246,0.22) 0%, transparent 65%)" }} />
        <div className="absolute -bottom-16 -right-16 w-80 h-80 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(56,189,248,0.15) 0%, transparent 70%)" }} />
        <div className="absolute top-0 right-0 w-px h-full pointer-events-none"
          style={{ background: "linear-gradient(to bottom, transparent, rgba(139,92,246,0.4) 30%, rgba(56,189,248,0.3) 70%, transparent)" }} />

        <div className="relative z-10">
          <Image src="/Logo1.png" alt="CodeQuality" width={180} height={48} className="drop-shadow-lg" />
        </div>

        <div className="relative z-10 flex flex-col justify-center flex-1 py-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-sky-400/30 bg-sky-400/[0.06] w-fit mb-7">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
            <span className="text-[0.65rem] font-semibold tracking-[0.14em] uppercase text-sky-400">
              {t("login.eyebrow")}
            </span>
          </div>

          <h1 className="text-4xl xl:text-5xl font-extrabold !leading-[1.4] tracking-tight mb-5">
            {t("login.title")}
            <span className="block bg-gradient-to-r from-violet-500 to-sky-400 bg-clip-text text-transparent">
              {t("login.titleAccent")}
            </span>
          </h1>

          <p className="text-sm text-slate-400 leading-relaxed max-w-sm font-light">
            {t("login.subtitle")}
          </p>

          <div className="flex flex-col gap-3 mt-10">
            {features.map((f) => (
              <div key={f.title} className="flex items-center gap-4 px-4 py-3.5 rounded-2xl border border-white/[0.05] bg-white/[0.03] backdrop-blur-sm transition-all duration-300 hover:border-violet-500/30 hover:bg-violet-500/[0.06] cursor-default">
                <div className="w-9 h-9 flex-shrink-0 rounded-xl flex items-center justify-center text-base border border-violet-500/20 bg-gradient-to-br from-violet-500/20 to-sky-400/15">
                  {f.icon}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-200 leading-none mb-1">{f.title}</p>
                  <p className="text-xs text-slate-500">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-xs text-slate-600 tracking-wide">
          © {new Date().getFullYear()} CodeQuality — {t("login.footer")}
        </p>
      </aside>

      {/* ══ PAINEL DIREITO ══ */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 relative bg-slate-950/40">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(139,92,246,0.1), transparent 70%)" }} />

        <div className="w-full max-w-sm relative z-10">
          <div className="flex justify-center mb-8 lg:hidden">
            <Image src="/Logo1.png" alt="CodeQuality" width={130} height={44} className="drop-shadow-lg" />
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-extrabold tracking-tight leading-snug mb-2">
              {t("login.formTitle")}{" "}
              <span className="bg-gradient-to-r from-violet-500 to-sky-400 bg-clip-text text-transparent">
                {t("login.formAccent")}
              </span>
            </h2>
            <p className="text-sm text-slate-400 font-light">{t("login.formSubtitle")}</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-[0.7rem] font-semibold tracking-widest uppercase text-slate-500">
                {t("login.email")}
              </label>
              <input
                type="email" placeholder={t("login.emailPlaceholder")}
                value={email} onChange={(e) => setEmail(e.target.value)} required
                className="w-full rounded-xl px-4 py-3 bg-white/[0.03] border border-white/[0.08] text-slate-100 text-sm placeholder:text-slate-600 outline-none transition-all duration-200 focus:border-violet-500 focus:bg-violet-500/[0.06] focus:ring-2 focus:ring-violet-500/20"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[0.7rem] font-semibold tracking-widest uppercase text-slate-500">
                {t("login.password")}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"} placeholder="••••••••"
                  value={password} onChange={(e) => setPassword(e.target.value)} required
                  className="w-full rounded-xl px-4 py-3 pr-11 bg-white/[0.03] border border-white/[0.08] text-slate-100 text-sm placeholder:text-slate-600 outline-none transition-all duration-200 focus:border-violet-500 focus:bg-violet-500/[0.06] focus:ring-2 focus:ring-violet-500/20"
                />
                <button type="button" onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  aria-label={showPassword ? t("login.hidePassword") : t("login.showPassword")}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit"
              className="relative w-full mt-1 py-3.5 rounded-xl font-bold text-sm text-white overflow-hidden bg-gradient-to-r from-violet-600 to-indigo-500 shadow-lg shadow-violet-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-violet-500/40 hover:shadow-xl active:translate-y-0">
              {t("login.submit")}
            </button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-white/[0.07]" />
            <span className="text-[0.65rem] font-medium tracking-widest uppercase text-slate-600">ou</span>
            <div className="flex-1 h-px bg-white/[0.07]" />
          </div>

          <p className="text-center text-sm text-slate-500">
            {t("login.noAccount")}{" "}
            <Link href="/auth/register" className="text-sky-400 font-semibold hover:text-violet-400 transition-colors">
              {t("login.createNow")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}