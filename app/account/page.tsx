"use client";
 
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../components/Header";
import Footer from "../components/Footer";
import BackToHomeButton from "../components/BackToHomeButton";
import { useAuth } from "@/app/context/AuthContext";
import { apiFetch } from "@/app/lib/api";
import {
  UserCircle, Mail, CalendarDays, ShieldCheck,
  Trash2, Download, AlertTriangle, CheckCircle,
} from "lucide-react";
 
interface UserData {
  id: number;
  name: string;
  email: string;
  createdAt: string;
}
 
export default function AccountPage() {
  const { token, isLoading, logout } = useAuth();
  const router = useRouter();
 
  const [user, setUser]             = useState<UserData | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [deleteStep, setDeleteStep] = useState<"idle" | "confirm" | "deleting">("idle");
  const [deleteError, setDeleteError] = useState("");
  const [exportSuccess, setExportSuccess] = useState(false);
 
  useEffect(() => {
    if (!isLoading && !token) router.push("/auth/login");
  }, [token, isLoading, router]);
 
  useEffect(() => {
    if (!token) return;
    apiFetch("/api/user/me")
      .then((r) => r.json())
      .then((data) => setUser(data))
      .catch(() => setUser(null))
      .finally(() => setLoadingUser(false));
  }, [token]);
 
  /* ── exportar dados pessoais (LGPD Art. 18) ── */
  const handleExportData = () => {
    if (!user) return;
    const content = JSON.stringify(
      { id: user.id, name: user.name, email: user.email, createdAt: user.createdAt },
      null, 2
    );
    const blob = new Blob([content], { type: "application/json;charset=utf-8;" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = "meus-dados.json";
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
    setExportSuccess(true);
    setTimeout(() => setExportSuccess(false), 4000);
  };
 
  /* ── excluir conta (LGPD Art. 18) ── */
  const handleDeleteAccount = async () => {
    setDeleteStep("deleting");
    setDeleteError("");
    try {
      const res = await apiFetch("/api/user/me", { method: "DELETE" });
      if (!res.ok) throw new Error();
      logout();
      router.push("/auth/login");
    } catch {
      setDeleteError("Não foi possível excluir a conta. Tente novamente.");
      setDeleteStep("confirm");
    }
  };
 
  if (isLoading || loadingUser) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-950">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex items-center gap-3 text-slate-400 text-sm">
            <span className="w-4 h-4 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
            Carregando seus dados...
          </div>
        </div>
      </div>
    );
  }
 
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Header />
 
      <main className="flex-1 pt-8 pb-20">
        <div className="max-w-2xl mx-auto px-6 space-y-8">
 
          {/* ── back ── */}
          <BackToHomeButton />
 
          {/* ── cabeçalho ── */}
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-sky-500/25 bg-sky-500/[0.08] text-[0.68rem] font-semibold tracking-[0.12em] uppercase text-sky-400 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
              Dados do usuário
            </div>
 
            <h1 className="font-extrabold text-[clamp(1.9rem,4vw,2.4rem)] leading-[1.1] tracking-[-0.025em] text-white mb-3">
              Minha{" "}
              <span className="bg-gradient-to-r from-sky-400 to-violet-400 bg-clip-text text-transparent">
                Conta
              </span>
            </h1>
 
            <p className="text-[0.85rem] text-slate-400 leading-relaxed font-light">
              Gerencie seus dados pessoais. De acordo com a Lei Geral de Proteção de
              Dados (LGPD), você tem direito de acessar, exportar e solicitar a exclusão
              das suas informações a qualquer momento.
            </p>
 
            <div className="mt-5 h-px bg-gradient-to-r from-sky-500/20 via-slate-700/60 to-transparent" />
          </div>
 
          {/* ── card de dados pessoais ── */}
          {user && (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 overflow-hidden">
 
              <div className="flex items-center gap-3 px-5 py-4 bg-white/[0.02] border-b border-slate-800">
                <div className="w-8 h-8 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center">
                  <UserCircle size={16} className="text-sky-400" />
                </div>
                <span className="text-[0.78rem] font-semibold text-slate-300">Dados pessoais</span>
              </div>
 
              <div className="p-5 space-y-3">
                {[
                  { icon: <UserCircle size={14} />,    label: "Nome",             value: user.name },
                  { icon: <Mail size={14} />,           label: "E-mail",           value: user.email },
                  { icon: <CalendarDays size={14} />,   label: "Conta criada em",  value: new Date(user.createdAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" }) },
                  { icon: <ShieldCheck size={14} />,    label: "ID interno",        value: `#${user.id}` },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between py-2.5 border-b border-slate-800/80 last:border-0">
                    <div className="flex items-center gap-2 text-slate-500">
                      {row.icon}
                      <span className="text-[0.75rem] font-medium">{row.label}</span>
                    </div>
                    <span className="text-[0.82rem] font-semibold text-slate-200">{row.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
 
          {/* ── direitos LGPD ── */}
          <div className="space-y-3">
            <p className="text-[0.68rem] font-bold tracking-[0.12em] uppercase text-slate-600 flex items-center gap-2 before:block before:w-5 before:h-px before:bg-slate-700">
              Seus direitos 
            </p>
 
            {/* exportar dados */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-white mb-1">Exportar meus dados</p>
                <p className="text-[0.78rem] text-slate-500 leading-relaxed max-w-sm">
                  Baixe um arquivo JSON com todas as informações pessoais armazenadas sobre sua conta.
                </p>
              </div>
              <div className="flex flex-col items-start sm:items-end gap-2 flex-shrink-0">
                <button
                  onClick={handleExportData}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-[0.82rem] border border-sky-500/30 text-sky-400 bg-sky-500/[0.08] transition-all duration-200 hover:-translate-y-0.5 hover:bg-sky-500/[0.15] hover:border-sky-400 hover:shadow-[0_8px_20px_rgba(56,189,248,0.2)]"
                >
                  <Download size={14} />
                  Baixar meus dados
                </button>
                {exportSuccess && (
                  <div className="flex items-center gap-1.5 text-green-400 text-[0.72rem] font-medium animate-pulse">
                    <CheckCircle size={12} />
                    Dados exportados!
                  </div>
                )}
              </div>
            </div>
 
            {/* excluir conta */}
            <div className="rounded-2xl border border-red-500/20 bg-red-500/[0.04] p-5">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-red-400 mb-1 flex items-center gap-2">
                    <AlertTriangle size={14} />
                    Excluir minha conta
                  </p>
                  <p className="text-[0.78rem] text-slate-500 leading-relaxed max-w-sm">
                    Remove permanentemente sua conta e todos os dados associados. Esta ação não pode ser desfeita.
                  </p>
                </div>
 
                {deleteStep === "idle" && (
                  <button
                    onClick={() => setDeleteStep("confirm")}
                    className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-[0.82rem] border border-red-500/30 text-red-400 bg-red-500/[0.08] transition-all duration-200 hover:bg-red-500/[0.15] hover:border-red-400"
                  >
                    <Trash2 size={14} />
                    Solicitar exclusão
                  </button>
                )}
              </div>
 
              {/* ── confirmação ── */}
              {(deleteStep === "confirm" || deleteStep === "deleting") && (
                <div className="mt-4 pt-4 border-t border-red-500/15 space-y-3">
                  <p className="text-[0.8rem] text-slate-300 font-medium">
                    Tem certeza? Todos os seus projetos e avaliações serão permanentemente excluídos.
                  </p>
 
                  {deleteError && (
                    <div className="flex items-center gap-2 text-red-400 text-[0.75rem]">
                      <AlertTriangle size={12} />
                      {deleteError}
                    </div>
                  )}
 
                  <div className="flex gap-3">
                    <button
                      onClick={handleDeleteAccount}
                      disabled={deleteStep === "deleting"}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-[0.82rem] text-white bg-red-600 hover:bg-red-500 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {deleteStep === "deleting" ? (
                        <>
                          <span className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                          Excluindo...
                        </>
                      ) : (
                        <>
                          <Trash2 size={14} />
                          Confirmar exclusão
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => { setDeleteStep("idle"); setDeleteError(""); }}
                      disabled={deleteStep === "deleting"}
                      className="px-5 py-2.5 rounded-xl font-bold text-[0.82rem] border border-slate-700 text-slate-400 hover:text-slate-200 hover:border-slate-600 transition-all duration-200 disabled:opacity-50"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </div>
 
          </div>
 
        </div>
      </main>
 
      <Footer />
    </div>
  );
}