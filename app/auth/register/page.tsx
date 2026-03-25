"use client";
 
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff, User, Mail, Lock, CheckCircle, XCircle } from "lucide-react";
import { API_URL } from "@/app/config/api";
 
/* ── regras espelhando o backend ────────────────────────────────────────────
   @Size(min = 8)
   @Pattern(regexp = "^(?=.*[A-Z])(?=.*[0-9]).+$")
────────────────────────────────────────────────────────────────────────── */
const passwordRules = [
  { id: "length",    label: "Mínimo de 8 caracteres",          test: (v: string) => v.length >= 8 },
  { id: "uppercase", label: "Ao menos uma letra maiúscula",    test: (v: string) => /[A-Z]/.test(v) },
  { id: "number",    label: "Ao menos um número",              test: (v: string) => /[0-9]/.test(v) },
];
 
export default function RegisterPage() {
  const router = useRouter();
 
  const [name, setName]                 = useState("");
  const [email, setEmail]               = useState("");
  const [password, setPassword]         = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [submitError, setSubmitError]   = useState("");
  const [loading, setLoading]           = useState(false);
 
  const rulesPassed  = passwordRules.filter((r) => r.test(password));
  const allValid     = rulesPassed.length === passwordRules.length;
  const strength     = rulesPassed.length; // 0-3
 
  const strengthLabel = ["", "Fraca", "Média", "Forte"];
  const strengthColor = ["", "text-red-400", "text-yellow-400", "text-green-400"];
  const strengthBar   = [
    "",
    "w-1/3 bg-red-500",
    "w-2/3 bg-yellow-400",
    "w-full bg-green-500",
  ];
 
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError("");
 
    if (!allValid) {
      setSubmitError("A senha não atende todos os requisitos.");
      return;
    }
 
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
 
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setSubmitError(body?.message ?? "Erro ao registrar usuário. Tente novamente.");
        return;
      }
 
      router.push("/auth/login");
    } catch {
      setSubmitError("Não foi possível conectar ao servidor.");
    } finally {
      setLoading(false);
    }
  }
 
  return (
    <div className="min-h-screen flex bg-slate-950 overflow-hidden">
 
      {/* ══ PAINEL ESQUERDO — branding ══ */}
      <aside className="hidden lg:flex relative w-[52%] flex-shrink-0 flex-col justify-between px-14 py-12 overflow-hidden bg-slate-950">
 
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.055) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
        <div className="absolute top-1/2 left-[40%] -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(139,92,246,0.22) 0%, transparent 65%)" }} />
        <div className="absolute -bottom-16 -right-16 w-80 h-80 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(56,189,248,0.15) 0%, transparent 70%)" }} />
        <div className="absolute top-10 right-10 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(34,197,94,0.08) 0%, transparent 70%)" }} />
        <div className="absolute top-0 right-0 w-px h-full pointer-events-none"
          style={{ background: "linear-gradient(to bottom, transparent, rgba(139,92,246,0.4) 30%, rgba(56,189,248,0.3) 70%, transparent)" }} />
 
        <div className="relative z-10">
          <Image src="/Logo1.png" alt="CodeQuality" width={180} height={48} className="object-contain" />
        </div>
 
        <div className="relative z-10 flex flex-col justify-center flex-1 py-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-green-400/30 bg-green-400/[0.06] w-fit mb-7">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-[0.65rem] font-semibold tracking-[0.14em] uppercase text-green-400">Cadastro gratuito</span>
          </div>
 
          <h1 className="text-4xl xl:text-5xl font-extrabold leading-[1.1] tracking-tight mb-5">
            Comece a avaliar
            <span className="block bg-gradient-to-r from-violet-400 to-sky-300 bg-clip-text text-transparent">em minutos.</span>
          </h1>
 
          <p className="text-sm text-slate-400 leading-relaxed max-w-sm font-light">
            Crie sua conta e tenha acesso imediato à plataforma de classificação estratégica de projetos de software.
          </p>
 
          <div className="flex flex-col gap-0 mt-10">
            {[
              { step: "01", label: "Crie sua conta",        desc: "Preencha os dados ao lado" },
              { step: "02", label: "Cadastre seus projetos", desc: "Informe as métricas técnicas" },
              { step: "03", label: "Receba a classificação", desc: "Score automático em segundos" },
            ].map((item, i, arr) => (
              <div key={item.step} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border border-violet-500/40 bg-violet-500/10 text-[0.65rem] font-bold text-violet-400">
                    {item.step}
                  </div>
                  {i < arr.length - 1 && (
                    <div className="w-px flex-1 my-1 bg-gradient-to-b from-violet-500/30 to-slate-700/30 min-h-[28px]" />
                  )}
                </div>
                <div className={`pb-6 ${i === arr.length - 1 ? "pb-0" : ""}`}>
                  <p className="text-sm font-semibold text-slate-200 leading-none mb-1">{item.label}</p>
                  <p className="text-xs text-slate-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
 
        <p className="relative z-10 text-xs text-slate-600 tracking-wide">
          © {new Date().getFullYear()} CodeQuality — Avaliação Estratégica de Software
        </p>
      </aside>
 
      {/* ══ PAINEL DIREITO — form ══ */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 relative bg-slate-950/40">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(139,92,246,0.1), transparent 70%)" }} />
 
        <div className="w-full max-w-sm relative z-10">
 
          <div className="flex justify-center mb-8 lg:hidden">
            <Image src="/Logo1.png" alt="CodeQuality" width={130} height={44} className="object-contain" />
          </div>
 
          <div className="mb-8">
            <h2 className="text-3xl font-extrabold tracking-tight leading-snug mb-2">
              Criar{" "}
              <span className="bg-gradient-to-r from-violet-400 to-sky-300 bg-clip-text text-transparent">nova conta</span>
            </h2>
            <p className="text-sm text-slate-400 font-light">Preencha os dados abaixo para começar</p>
          </div>
 
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
 
            {/* Nome */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[0.7rem] font-semibold tracking-widest uppercase text-slate-500">Nome completo</label>
              <div className="relative">
                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none" />
                <input
                  type="text" placeholder="Seu nome" value={name}
                  onChange={(e) => setName(e.target.value)} required
                  className="w-full rounded-xl pl-9 pr-4 py-3 bg-white/[0.03] border border-white/[0.08] text-slate-100 text-sm placeholder:text-slate-600 outline-none transition-all duration-200 focus:border-violet-500 focus:bg-violet-500/[0.06] focus:ring-2 focus:ring-violet-500/20"
                />
              </div>
            </div>
 
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[0.7rem] font-semibold tracking-widest uppercase text-slate-500">E-mail</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none" />
                <input
                  type="email" placeholder="seu@email.com" value={email}
                  onChange={(e) => setEmail(e.target.value)} required
                  className="w-full rounded-xl pl-9 pr-4 py-3 bg-white/[0.03] border border-white/[0.08] text-slate-100 text-sm placeholder:text-slate-600 outline-none transition-all duration-200 focus:border-violet-500 focus:bg-violet-500/[0.06] focus:ring-2 focus:ring-violet-500/20"
                />
              </div>
            </div>
 
            {/* Senha */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[0.7rem] font-semibold tracking-widest uppercase text-slate-500">Senha</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••" value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  required
                  className={`w-full rounded-xl pl-9 pr-11 py-3 bg-white/[0.03] border text-slate-100 text-sm placeholder:text-slate-600 outline-none transition-all duration-200 focus:ring-2 focus:ring-violet-500/20
                    ${password.length > 0
                      ? allValid
                        ? "border-green-500/50 focus:border-green-500 focus:bg-green-500/[0.04]"
                        : "border-red-500/40 focus:border-red-500 focus:bg-red-500/[0.04]"
                      : "border-white/[0.08] focus:border-violet-500 focus:bg-violet-500/[0.06]"
                    }`}
                />
                <button type="button" onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
 
              {/* ── barra de força ── */}
              {password.length > 0 && (
                <div className="mt-1.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 h-1 rounded-full bg-white/[0.06] overflow-hidden mr-3">
                      <div className={`h-full rounded-full transition-all duration-500 ${strengthBar[strength]}`} />
                    </div>
                    <span className={`text-[0.65rem] font-bold uppercase tracking-wide flex-shrink-0 ${strengthColor[strength]}`}>
                      {strengthLabel[strength]}
                    </span>
                  </div>
                </div>
              )}
 
              {/* ── checklist de requisitos ── */}
              {(passwordFocused || password.length > 0) && (
                <div className="mt-2 p-3 rounded-xl border border-white/[0.06] bg-white/[0.02] space-y-1.5">
                  <p className="text-[0.63rem] font-semibold tracking-widest uppercase text-slate-600 mb-2">
                    Requisitos da senha
                  </p>
                  {passwordRules.map((rule) => {
                    const ok = rule.test(password);
                    return (
                      <div key={rule.id} className="flex items-center gap-2">
                        {ok
                          ? <CheckCircle size={12} className="text-green-400 flex-shrink-0" />
                          : <XCircle    size={12} className="text-slate-600 flex-shrink-0" />
                        }
                        <span className={`text-[0.72rem] transition-colors duration-200 ${ok ? "text-green-400" : "text-slate-500"}`}>
                          {rule.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
 
            {/* erro de submit */}
            {submitError && (
              <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-red-500/30 bg-red-500/[0.08] text-red-400 text-[0.78rem]">
                <XCircle size={14} className="flex-shrink-0" />
                {submitError}
              </div>
            )}
 
            {/* submit */}
            <button
              type="submit" disabled={loading || !allValid}
              className="relative w-full mt-1 py-3.5 rounded-xl font-bold text-sm text-white overflow-hidden bg-gradient-to-r from-violet-600 to-indigo-500 shadow-lg shadow-violet-500/20 transition-all duration-300 hover:enabled:-translate-y-0.5 hover:enabled:shadow-violet-500/40 hover:enabled:shadow-xl active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Criando conta...
                </span>
              ) : (
                "Criar conta grátis →"
              )}
            </button>
 
          </form>
 
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-white/[0.07]" />
            <span className="text-[0.65rem] font-medium tracking-widest uppercase text-slate-600">ou</span>
            <div className="flex-1 h-px bg-white/[0.07]" />
          </div>
 
          <p className="text-center text-sm text-slate-500">
            Já possui conta?{" "}
            <Link href="/auth/login" className="text-sky-400 font-semibold hover:text-violet-400 transition-colors">
              Entrar agora
            </Link>
          </p>
 
        </div>
      </div>
    </div>
  );
}