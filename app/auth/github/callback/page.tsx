"use client";
 
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
 
/**
 * Esta página fica em /auth/github/callback
 * O GitHub redireciona aqui com ?code=XXX&state=YYY
 *
 * Se aberta em popup: envia o code para a janela pai via postMessage e fecha.
 * Se aberta na mesma aba: salva o code no sessionStorage e redireciona para /evaluations/new.
 */
export default function GitHubCallbackPage() {
  const params = useSearchParams();
 
  useEffect(() => {
    const code  = params.get("code");
    const error = params.get("error");
 
    if (error) {
      if (window.opener) {
        window.opener.postMessage({ type: "github_oauth_callback", error }, window.location.origin);
        window.close();
      } else {
        window.location.href = "/evaluations/new?github_error=" + error;
      }
      return;
    }
 
    if (!code) return;
 
    if (window.opener) {
      // popup flow: notifica a janela pai e fecha
      window.opener.postMessage(
        { type: "github_oauth_callback", code },
        window.location.origin
      );
      window.close();
    } else {
      // fallback: mesma aba — salva code e redireciona
      sessionStorage.setItem("github_oauth_code", code);
      window.location.href = "/evaluations/new";
    }
  }, [params]);
 
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-400 text-sm">
      <div className="flex items-center gap-3">
        <span className="w-4 h-4 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
        Conectando com GitHub...
      </div>
    </div>
  );
}