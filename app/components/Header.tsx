"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { Home, Clock, PlusSquare, Download, User, LogOut, ChevronDown, TrendingUp } from "lucide-react";
import { apiFetch } from "@/app/lib/api";

interface Stats {
  total: number;
  averageScore: number;
  excellentCount: number;
}

export default function Header() {
  const { logout } = useAuth();
  const router     = useRouter();
  const pathname   = usePathname();

  const [stats, setStats]       = useState<Stats>({ total: 0, averageScore: 0, excellentCount: 0 });
  const [loading, setLoading]   = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    apiFetch("/api/evaluations/stats")
      .then((r) => r.json())
      .then((data) => setStats(data))
      .catch(() => setStats({ total: 0, averageScore: 0, excellentCount: 0 }))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleLogout() {
    logout();
    router.push("/auth/login");
  }

  const statItems = [
    { label: "Avaliações",  value: stats.total,         color: "text-violet-400", bg: "bg-violet-500/10 border-violet-500/20" },
    { label: "Score Médio", value: stats.averageScore,  color: "text-sky-400",    bg: "bg-sky-500/10 border-sky-500/20"       },
    { label: "Excelentes",  value: stats.excellentCount,color: "text-green-400",  bg: "bg-green-500/10 border-green-500/20"   },
  ];

  const navLinks = [
    { label: "Home",           href: "/evaluations",        icon: <Home size={13} />        },
    { label: "Histórico",      href: "/evaluations/historic",icon: <Clock size={13} />       },
    { label: "Nova Avaliação", href: "/evaluations/new",    icon: <PlusSquare size={13} />  },
    { label: "Exportar CSV",   href: "/evaluations/export/csv", icon: <Download size={13} />    },
    { label: "Dashboard",   href: "/evaluations/dashboard", icon: <TrendingUp size={13} />    },
  ];

  return (
    <header className="relative w-full border-b border-slate-800 overflow-visible">

      {/* fundo */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-950/30 via-slate-950 to-slate-950 pointer-events-none" />
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{ backgroundImage: "radial-gradient(rgba(139,92,246,0.08) 1px, transparent 1px)", backgroundSize: "24px 24px" }}
      />
      <div
        className="absolute -top-24 -left-24 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 65%)" }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-5 space-y-4">

        {/* ── linha 1: logo + stats ── */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">

          <div className="flex flex-col gap-3 max-w-xl">
            <Link href="/evaluations">
              <Image
                src="/Logo1.png" alt="Code Quality Evaluator"
                width={0} height={0} sizes="100vw" priority
                className="h-12 w-auto object-contain hover:opacity-80 transition-opacity duration-200"
              />
            </Link>
            <div>
              <p className="text-[0.78rem] font-semibold tracking-[0.12em] uppercase text-violet-400 mb-1.5">
                Plataforma de Análise Técnica
              </p>
              <p className="text-[0.85rem] text-slate-400 leading-relaxed font-light">
                Avalie projetos com métricas estruturais — complexidade, testes e versionamento.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {statItems.map((s) => (
              <div
                key={s.label}
                className={`group relative px-5 py-4 rounded-2xl border backdrop-blur-md ${s.bg} hover:bg-white/10 transition-all duration-300 flex flex-col items-center justify-center min-w-[90px]`}
              >
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition bg-gradient-to-br from-violet-500/10 to-transparent" />
                <span className={`relative font-extrabold text-2xl mb-1 ${s.color}`}>
                  {loading
                    ? <span className="inline-block w-8 h-5 rounded bg-slate-700 animate-pulse" />
                    : s.value}
                </span>
                <span className="relative text-[0.65rem] font-semibold tracking-widest uppercase text-slate-400">
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── divisor ── */}
        <div className="h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent" />

        {/* ── linha 2: nav + conta ── */}
        <div className="flex items-center justify-between gap-4 flex-wrap">

          {/* nav links */}
          <nav className="flex items-center gap-1 flex-wrap">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`
                    inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[0.8rem] font-semibold
                    border transition-all duration-200
                    ${active
                      ? "bg-violet-500/12 border-violet-500/25 text-violet-400"
                      : "bg-transparent border-transparent text-slate-400 hover:bg-white/5 hover:border-white/10 hover:text-slate-200"}
                  `}
                >
                  {link.icon}
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* botão minha conta + dropdown */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[0.8rem] font-semibold border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-slate-100 transition-all duration-200"
            >
              <User size={13} />
              Minha Conta
              <ChevronDown size={12} className={`opacity-50 transition-transform duration-200 ${menuOpen ? "rotate-180" : ""}`} />
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-[calc(100%+8px)] z-50 w-44 rounded-2xl border border-slate-700/60 bg-slate-900/95 backdrop-blur-md shadow-xl py-1.5">
                <Link
                  href="/account"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-[0.8rem] text-slate-300 hover:text-white hover:bg-white/5 transition-all duration-150 rounded-xl mx-1"
                >
                  <User size={13} />
                  Perfil
                </Link>
                <div className="my-1 h-px bg-slate-700/50 mx-3" />
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[0.8rem] text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-150 rounded-xl mx-1"
                  style={{ width: "calc(100% - 8px)" }}
                >
                  <LogOut size={13} />
                  Sair da conta
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </header>
  );
}