"use client";
 
import { useEffect, useState, useCallback } from "react";
import { apiFetch } from "@/app/lib/api";
import {
  Github, Star, GitFork, Lock, Globe,
  RefreshCw, Zap, CheckCircle, XCircle,
  Loader2, Unplug,
} from "lucide-react";
 
// ── tipos ──────────────────────────────────────────────────────────────────
 
interface GitHubRepo {
  id:           number;
  name:         string;
  fullName:     string;  // full_name
  description:  string | null;
  htmlUrl:      string;
  stars:        number;
  forks:        number;
  language:     string | null;
  privateRepo:  boolean;
  updatedAt:    string;
  sizeKb:       number;
}
 
interface Props {
  /** chamado quando a análise é concluída com sucesso */
  onAnalyzed: () => void;
  analyzedBy?: string;
}
 
// ── helpers ────────────────────────────────────────────────────────────────
 
const langColor: Record<string, string> = {
  Java:       "bg-orange-500/20 text-orange-400 border-orange-500/25",
  TypeScript: "bg-blue-500/20 text-blue-400 border-blue-500/25",
  JavaScript: "bg-yellow-500/20 text-yellow-400 border-yellow-500/25",
  Python:     "bg-green-500/20 text-green-400 border-green-500/25",
  Go:         "bg-cyan-500/20 text-cyan-400 border-cyan-500/25",
  Rust:       "bg-orange-700/20 text-orange-300 border-orange-700/25",
  Kotlin:     "bg-violet-500/20 text-violet-400 border-violet-500/25",
  default:    "bg-slate-700/40 text-slate-400 border-slate-700/40",
};
 
function LangBadge({ lang }: { lang: string | null }) {
  if (!lang) return null;
  const cls = langColor[lang] ?? langColor.default;
  return (
    <span className={`px-2 py-0.5 rounded-md text-[0.62rem] font-semibold border ${cls}`}>
      {lang}
    </span>
  );
}
 
// ── componente principal ───────────────────────────────────────────────────
 
export default function GithubIntegration({ onAnalyzed, analyzedBy }: Props) {
  const [connected,       setConnected]       = useState<boolean | null>(null);
  const [repos,           setRepos]           = useState<GitHubRepo[]>([]);
  const [selectedRepo,    setSelectedRepo]    = useState<GitHubRepo | null>(null);
  const [search,          setSearch]          = useState("");
  const [loadingRepos,    setLoadingRepos]    = useState(false);
  const [analyzing,       setAnalyzing]       = useState(false);
  const [analyzeSuccess,  setAnalyzeSuccess]  = useState(false);
  const [analyzeError,    setAnalyzeError]    = useState("");
  const [disconnecting,   setDisconnecting]   = useState(false);
 
  // ── verificar status ao montar ───────────────────────────────────────────
 
  useEffect(() => {
    apiFetch("/api/github/status")
      .then((r) => r.json())
      .then((d) => {
        setConnected(d.connected);
        if (d.connected) fetchRepos();
      })
      .catch(() => setConnected(false));
  }, []);
 
  // ── ouvir callback OAuth do GitHub (postMessage da janela popup) ─────────
 
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type !== "github_oauth_callback") return;
      const code = e.data.code as string;
      if (!code) return;
      handleOAuthCode(code);
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);
 
  // ── buscar repos ─────────────────────────────────────────────────────────
 
  const fetchRepos = useCallback(async () => {
    setLoadingRepos(true);
    setAnalyzeError("");
    try {
      const res  = await apiFetch("/api/github/repos");
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        if (res.status === 400 || res.status === 401) {
          // token expirado — desconectar
          setConnected(false);
          setAnalyzeError(err.message ?? "Token GitHub expirado. Reconecte sua conta.");
          return;
        }
        throw new Error(err.message ?? "Erro ao buscar repositórios");
      }
      const data: any[] = await res.json();
      // mapear camelCase (Jackson serializa assim por padrão)
      const mapped: GitHubRepo[] = data.map((r) => ({
        id:          r.id,
        name:        r.name,
        fullName:    r.fullName ?? r.full_name,
        description: r.description,
        htmlUrl:     r.htmlUrl ?? r.html_url,
        stars:       r.stars ?? r.stargazers_count ?? 0,
        forks:       r.forks ?? r.forks_count ?? 0,
        language:    r.language,
        privateRepo: r.privateRepo ?? r.private ?? false,
        updatedAt:   r.updatedAt ?? r.updated_at,
        sizeKb:      r.sizeKb ?? r.size ?? 0,
      }));
      setRepos(mapped);
    } catch (e: any) {
      setAnalyzeError(e.message ?? "Não foi possível carregar os repositórios.");
    } finally {
      setLoadingRepos(false);
    }
  }, []);
 
  // ── conectar GitHub: abre popup ──────────────────────────────────────────
 
  const handleConnect = async () => {
    try {
      const res  = await apiFetch("/api/github/auth-url");
      const data = await res.json();
      const url  = data.url as string;
 
      // abre popup centrado
      const width  = 600; const height = 700;
      const left   = window.screenX + (window.outerWidth - width)  / 2;
      const top    = window.screenY + (window.outerHeight - height) / 2;
 
      const popup = window.open(
        url,
        "github_oauth",
        `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
      );
 
      // fallback: se popup bloqueado, redireciona na mesma aba
      if (!popup) window.location.href = url;
 
    } catch {
      setAnalyzeError("Não foi possível iniciar a conexão com o GitHub.");
    }
  };
 
  // ── processar code retornado pelo GitHub ──────────────────────────────────
 
  const handleOAuthCode = async (code: string) => {
    try {
      const res = await apiFetch("/api/github/callback", {
        method: "POST",
        body: JSON.stringify({ code }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setAnalyzeError(err.message ?? "Erro ao conectar GitHub.");
        return;
      }
      setConnected(true);
      fetchRepos();
    } catch {
      setAnalyzeError("Falha ao processar autorização do GitHub.");
    }
  };
 
  // ── desconectar ──────────────────────────────────────────────────────────
 
  const handleDisconnect = async () => {
    setDisconnecting(true);
    try {
      await apiFetch("/api/github/disconnect", { method: "DELETE" });
      setConnected(false);
      setRepos([]);
      setSelectedRepo(null);
    } finally {
      setDisconnecting(false);
    }
  };
 
  // ── analisar repositório selecionado ─────────────────────────────────────
 
  const handleAnalyze = async () => {
    if (!selectedRepo) return;
    setAnalyzing(true);
    setAnalyzeError("");
    setAnalyzeSuccess(false);
 
    try {
      const res = await apiFetch("/api/github/analyze", {
        method: "POST",
        body: JSON.stringify({
          repoFullName: selectedRepo.fullName,
          analyzedBy:   analyzedBy ?? "",
          aiLang:       "pt",
        }),
      });
 
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setAnalyzeError(err.message ?? "Erro ao analisar repositório.");
        return;
      }
 
      setAnalyzeSuccess(true);
      setTimeout(() => onAnalyzed(), 1500);
 
    } catch {
      setAnalyzeError("Não foi possível analisar o repositório.");
    } finally {
      setAnalyzing(false);
    }
  };
 
  // ── repositórios filtrados ────────────────────────────────────────────────
 
  const filtered = repos.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    (r.description ?? "").toLowerCase().includes(search.toLowerCase())
  );
 
  // ══════════════════════════════════════════════════════════════════════════
  // RENDER
  // ══════════════════════════════════════════════════════════════════════════
 
  // carregando status
  if (connected === null) {
    return (
      <div className="flex items-center justify-center py-16 text-slate-500 text-sm gap-3">
        <Loader2 size={16} className="animate-spin" />
        Verificando integração...
      </div>
    );
  }
 
  // ── NÃO conectado ─────────────────────────────────────────────────────────
  if (!connected) {
    return (
      <div className="flex flex-col items-center justify-center py-14 px-6 text-center gap-6">
 
        {/* ícone */}
        <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center">
          <Github size={30} className="text-slate-400" />
        </div>
 
        <div>
          <h3 className="font-bold text-lg text-white mb-2">
            Conecte sua conta GitHub
          </h3>
          <p className="text-sm text-slate-400 max-w-xs leading-relaxed">
            Autorize o acesso para listar seus repositórios e criar avaliações automáticas.
          </p>
        </div>
 
        {analyzeError && (
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-500/30 bg-red-500/[0.08] text-red-400 text-sm">
            <XCircle size={14} />
            {analyzeError}
          </div>
        )}
 
        <button
          onClick={handleConnect}
          className="relative inline-flex items-center gap-2.5 overflow-hidden px-7 py-3.5 rounded-xl font-bold text-sm text-white bg-slate-800 border border-slate-700 hover:border-violet-500/50 hover:bg-slate-700 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.4)]"
        >
          <Github size={18} />
          Conectar com GitHub
        </button>
 
        <p className="text-[0.7rem] text-slate-600 max-w-xs">
          Solicitaremos apenas permissão de leitura dos repositórios.
          Seu acesso_token é armazenado com segurança e nunca exposto no frontend.
        </p>
      </div>
    );
  }
 
  // ── CONECTADO ─────────────────────────────────────────────────────────────
  return (
    <div className="space-y-5">
 
      {/* header: status + botões */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-[0.78rem] text-slate-400">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          GitHub conectado
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchRepos}
            disabled={loadingRepos}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[0.75rem] font-medium border border-slate-800 text-slate-500 hover:text-slate-300 hover:border-slate-700 transition-all duration-200 disabled:opacity-50"
          >
            <RefreshCw size={12} className={loadingRepos ? "animate-spin" : ""} />
            Atualizar
          </button>
          <button
            onClick={handleDisconnect}
            disabled={disconnecting}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[0.75rem] font-medium border border-red-500/20 text-red-400/70 hover:text-red-400 hover:border-red-500/40 transition-all duration-200 disabled:opacity-50"
          >
            <Unplug size={12} />
            {disconnecting ? "Desconectando..." : "Desconectar"}
          </button>
        </div>
      </div>
 
      {/* busca */}
      <div className="relative">
        <input
          type="text"
          placeholder="Buscar repositório..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl px-4 py-2.5 bg-white/[0.03] border border-white/[0.07] text-slate-100 text-sm placeholder:text-slate-600 outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/15 transition-all"
        />
      </div>
 
      {/* lista de repositórios */}
      {loadingRepos ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-[72px] rounded-xl border border-slate-800 bg-slate-900/40 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-10 text-center text-slate-500 text-sm">
          Nenhum repositório encontrado.
        </div>
      ) : (
        <div className="flex flex-col gap-2 max-h-[380px] overflow-y-auto pr-1 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-800">
          {filtered.map((repo) => {
            const isSelected = selectedRepo?.id === repo.id;
            return (
              <button
                key={repo.id}
                type="button"
                onClick={() => setSelectedRepo(isSelected ? null : repo)}
                className={`w-full text-left px-4 py-3.5 rounded-xl border transition-all duration-200
                  ${isSelected
                    ? "border-violet-500/50 bg-violet-500/[0.08] shadow-[0_0_20px_rgba(139,92,246,0.1)]"
                    : "border-slate-800 bg-slate-900/40 hover:border-slate-700 hover:bg-slate-900/70"
                  }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      {repo.privateRepo
                        ? <Lock size={11} className="text-slate-500 flex-shrink-0" />
                        : <Globe size={11} className="text-slate-600 flex-shrink-0" />
                      }
                      <span className="font-semibold text-[0.88rem] text-white truncate">
                        {repo.name}
                      </span>
                      <LangBadge lang={repo.language} />
                    </div>
                    {repo.description && (
                      <p className="text-[0.72rem] text-slate-500 truncate">
                        {repo.description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-[0.68rem] text-slate-600 flex-shrink-0">
                    {repo.stars > 0 && (
                      <span className="flex items-center gap-1">
                        <Star size={10} /> {repo.stars}
                      </span>
                    )}
                    {repo.forks > 0 && (
                      <span className="flex items-center gap-1">
                        <GitFork size={10} /> {repo.forks}
                      </span>
                    )}
                    {isSelected && (
                      <span className="w-4 h-4 rounded-full bg-violet-500 flex items-center justify-center">
                        <CheckCircle size={10} className="text-white" />
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
 
      {/* repo selecionado + botão analisar */}
      {selectedRepo && (
        <div className="rounded-xl border border-violet-500/25 bg-violet-500/[0.06] p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[0.72rem] text-slate-500 uppercase tracking-wider mb-0.5">
                Repositório selecionado
              </p>
              <p className="font-bold text-sm text-white">{selectedRepo.fullName}</p>
            </div>
            <LangBadge lang={selectedRepo.language} />
          </div>
 
          {analyzeError && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-red-500/30 bg-red-500/[0.08] text-red-400 text-[0.78rem]">
              <XCircle size={13} />
              {analyzeError}
            </div>
          )}
 
          {analyzeSuccess ? (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-green-500/30 bg-green-500/[0.08] text-green-400 text-sm font-medium animate-pulse">
              <CheckCircle size={14} />
              Avaliação criada! Redirecionando...
            </div>
          ) : (
            <button
              onClick={handleAnalyze}
              disabled={analyzing}
              className="relative w-full inline-flex items-center justify-center gap-2.5 overflow-hidden px-6 py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-br from-violet-500 to-indigo-500 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed hover:enabled:-translate-y-0.5 hover:enabled:shadow-[0_10px_28px_rgba(139,92,246,0.4)] before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/15 before:to-transparent before:-translate-x-full before:transition-transform before:duration-500 hover:enabled:before:translate-x-full"
            >
              {analyzing ? (
                <><Loader2 size={16} className="animate-spin" /> Analisando...</>
              ) : (
                <><Zap size={16} /> Analisar repositório</>
              )}
            </button>
          )}
        </div>
      )}
 
    </div>
  );
}