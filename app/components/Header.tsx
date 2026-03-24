"use client";
 
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { LogOut } from "lucide-react";
import { apiFetch } from "@/app/lib/api";
 
interface Stats {
  total: number;
  averageScore: number;
  excellentCount: number;
}
 
export default function Header() {
  const { logout } = useAuth();
  const router     = useRouter();
 
  const [stats, setStats]     = useState<Stats>({ total: 0, averageScore: 0, excellentCount: 0 });
  const [loading, setLoading] = useState(true);
 
  useEffect(() => {
    apiFetch("/api/evaluations/stats")
      .then((r) => r.json())
      .then((data) => setStats(data))
      .catch(() => setStats({ total: 0, averageScore: 0, excellentCount: 0 }))
      .finally(() => setLoading(false));
  }, []);
 
  function handleLogout() {
    logout();
    router.push("/auth/login");
  }
 
  const statItems = [
    { label: "Avaliações",  value: stats.total,          color: "text-violet-400",  dim: "bg-violet-500/10 border-violet-500/20" },
    { label: "Score Médio", value: stats.averageScore,    color: "text-sky-400",     dim: "bg-sky-500/10 border-sky-500/20"       },
    { label: "Excelentes",  value: stats.excellentCount,  color: "text-green-400",   dim: "bg-green-500/10 border-green-500/20"   },
  ];
 
  return (
    <header className="relative w-full border-b border-slate-800 overflow-hidden">
 
      {/* ── fundo — idêntico ao original ── */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-950/30 via-slate-950 to-slate-950 pointer-events-none" />
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: "radial-gradient(rgba(139,92,246,0.08) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
      <div
        className="absolute -top-24 -left-24 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 65%)" }}
      />
 
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
 
          {/* ══ ESQUERDA — intacta ══ */}
          <div className="flex flex-col gap-3 max-w-xl">
            <Link href="/evaluations">
              <Image
                src="/Logo1.png"
                alt="Code Quality Evaluator"
                width={0} height={0} sizes="100vw"
                priority
                className="h-12 w-auto object-contain hover:opacity-80 transition-opacity duration-200"
              />
            </Link>
            <div>
              <p className="text-[0.78rem] font-semibold tracking-[0.12em] uppercase text-violet-400 mb-1.5">
                Plataforma de Análise Técnica
              </p>
              <p className="text-[0.85rem] text-slate-400 leading-relaxed font-light">
                Avalie projetos com métricas estruturais — complexidade, testes e versionamento.
                Governança técnica e evolução sustentável do software em um único lugar.
              </p>
            </div>
          </div>
 
          {/* ══ DIREITA — stats redesenhadas + logout ══ */}
          <div className="flex flex-col items-start lg:items-end gap-5 flex-shrink-0">

  {/* stats */}
  <div className="grid grid-cols-3 gap-4">
    {statItems.map((s) => (
      <div
        key={s.label}
        className={`
          group relative px-5 py-4 rounded-2xl border backdrop-blur-md
          bg-white/5 border-white/10
          hover:bg-white/10 transition-all duration-300
          flex flex-col items-center justify-center min-w-[90px]
        `}
      >
        {/* glow sutil */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition bg-gradient-to-br from-violet-500/10 to-transparent" />

        {/* valor */}
        <span className={`relative font-extrabold text-2xl mb-1 ${s.color}`}>
          {loading ? (
            <span className="inline-block w-8 h-5 rounded bg-slate-700 animate-pulse" />
          ) : (
            s.value
          )}
        </span>

        {/* label */}
        <span className="relative text-[0.65rem] font-semibold tracking-widest uppercase text-slate-400">
          {s.label}
        </span>
      </div>
    ))}
  </div>

  {/* divisor */}
  <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent" />

  {/* logout */}
  <button
    onClick={handleLogout}
    className="
      group inline-flex items-center gap-2 px-5 py-2.5 rounded-xl
      text-[0.8rem] font-medium
      bg-white/5 border border-white/10
      text-slate-400
      hover:text-red-400 hover:border-red-500/40 hover:bg-red-500/10
      transition-all duration-300
    "
  >
    <LogOut size={15} className="group-hover:scale-110 transition-transform" />
    Sair da conta
  </button>

</div>
        </div>
      </div>
    </header>
  );
}