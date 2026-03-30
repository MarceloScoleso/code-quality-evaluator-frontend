"use client";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function BackToHomeButton() {
  const router = useRouter();
  const { t }  = useTranslation();
  return (
    <button
      onClick={() => router.push("/evaluations/")}
      className="group inline-flex items-center gap-2 text-[0.82rem] font-medium text-slate-500 hover:text-slate-200 transition-colors duration-200"
    >
      <span className="w-7 h-7 rounded-lg border border-slate-800 bg-slate-900/60 flex items-center justify-center transition-all duration-200 group-hover:border-violet-500/40 group-hover:bg-violet-500/[0.08] group-hover:-translate-x-0.5">
        <ArrowLeft size={13} />
      </span>
      {t("common.backToHome")}
    </button>
  );
}