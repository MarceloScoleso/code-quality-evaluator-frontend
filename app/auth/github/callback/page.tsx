export const dynamic = "force-dynamic";

"use client";
 
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
 
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
      window.opener.postMessage(
        { type: "github_oauth_callback", code },
        window.location.origin
      );
      window.close();
    } else {
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