"use client";

import { useState } from "react";
import { SlidersHorizontal, ChevronDown, ChevronUp, Search } from "lucide-react";
import { useTranslation } from "react-i18next";

type Language = "JAVA"|"CSHARP"|"JAVASCRIPT"|"TYPESCRIPT"|"PYTHON"|"KOTLIN"|"GO"|"PHP"|"RUBY"|"SWIFT"|"C"|"CPP"|"RUST"|"DART"|"OTHER";
type Classification = "EXCELENTE"|"BOM"|"REGULAR"|"RUIM";

interface Props {
  filterName: string; setFilterName: (v: string) => void;
  filterLanguage: Language | ""; setFilterLanguage: (v: Language | "") => void;
  filterClassification: Classification | ""; setFilterClassification: (v: Classification | "") => void;
  filterMinScore: number | ""; setFilterMinScore: (v: number | "") => void;
  filterMaxScore: number | ""; setFilterMaxScore: (v: number | "") => void;
  filterStartDate: string; setFilterStartDate: (v: string) => void;
  filterEndDate: string; setFilterEndDate: (v: string) => void;
  onApply: () => void; buttonLabel?: string;
}

const inputCls = "w-full rounded-xl px-3.5 py-2.5 bg-white/[0.03] border border-white/[0.07] text-slate-100 text-sm placeholder:text-slate-600 outline-none transition-all duration-200 focus:border-sky-500/60 focus:bg-sky-500/[0.04] focus:ring-2 focus:ring-sky-500/15";
const labelCls = "block text-[0.68rem] font-semibold tracking-[0.1em] uppercase text-slate-500 mb-1.5";
const classColors: Record<Classification, string> = {
  EXCELENTE: "text-green-400 bg-green-500/10 border-green-500/25",
  BOM:       "text-sky-400 bg-sky-500/10 border-sky-500/25",
  REGULAR:   "text-yellow-400 bg-yellow-500/10 border-yellow-500/25",
  RUIM:      "text-red-400 bg-red-500/10 border-red-500/25",
};

export default function EvaluationFilters({
  filterName, setFilterName, filterLanguage, setFilterLanguage,
  filterClassification, setFilterClassification,
  filterMinScore, setFilterMinScore, filterMaxScore, setFilterMaxScore,
  filterStartDate, setFilterStartDate, filterEndDate, setFilterEndDate,
  onApply, buttonLabel,
}: Props) {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  const hasActive = filterName || filterLanguage || filterClassification ||
    filterMinScore !== "" || filterMaxScore !== "" || filterStartDate || filterEndDate;

  return (
    <div className="rounded-2xl border border-sky-500/15 bg-slate-900/50 backdrop-blur-sm overflow-hidden">
      <button type="button" onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-white/[0.02] transition-colors duration-200">
        <div className="flex items-center gap-2.5">
          <SlidersHorizontal size={15} className="text-sky-400" />
          <span className="text-[0.78rem] font-semibold tracking-[0.08em] uppercase text-slate-400">
            {t("filters.title")}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {hasActive && <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />}
          {open ? <ChevronUp size={15} className="text-sky-400" /> : <ChevronDown size={15} className="text-slate-500" />}
        </div>
      </button>

      <div className={`transition-all duration-400 ease-in-out overflow-hidden ${open ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="px-6 pb-6 border-t border-white/[0.05]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pt-5">

            <div className="sm:col-span-2 lg:col-span-1">
              <label className={labelCls}>{t("filters.projectName")}</label>
              <div className="relative">
                <Search size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none" />
                <input type="text" placeholder={t("filters.searchPlaceholder")} value={filterName}
                  onChange={(e) => setFilterName(e.target.value)} className={`${inputCls} pl-8`} />
              </div>
            </div>

            <div>
              <label className={labelCls}>{t("filters.language")}</label>
              <select value={filterLanguage} onChange={(e) => setFilterLanguage(e.target.value as Language | "")} className={inputCls}>
                <option value="" className="bg-slate-900">{t("filters.allLanguages")}</option>
                {["JAVA","CSHARP","JAVASCRIPT","TYPESCRIPT","PYTHON","KOTLIN","GO","PHP","RUBY","SWIFT","C","CPP","RUST","DART","OTHER"].map((l) => (
                  <option key={l} value={l} className="bg-slate-900">{l}</option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelCls}>{t("filters.classification")}</label>
              <select value={filterClassification} onChange={(e) => setFilterClassification(e.target.value as Classification | "")} className={inputCls}>
                <option value="" className="bg-slate-900">{t("filters.allClassifications")}</option>
                {(["EXCELENTE","BOM","REGULAR","RUIM"] as Classification[]).map((c) => (
                  <option key={c} value={c} className="bg-slate-900">{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelCls}>{t("filters.minScore")}</label>
              <input type="number" min={0} max={100} placeholder="0" value={filterMinScore}
                onChange={(e) => setFilterMinScore(e.target.value === "" ? "" : Number(e.target.value))} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>{t("filters.maxScore")}</label>
              <input type="number" min={0} max={100} placeholder="100" value={filterMaxScore}
                onChange={(e) => setFilterMaxScore(e.target.value === "" ? "" : Number(e.target.value))} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>{t("filters.startDate")}</label>
              <input type="date" value={filterStartDate} onChange={(e) => setFilterStartDate(e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>{t("filters.endDate")}</label>
              <input type="date" value={filterEndDate} onChange={(e) => setFilterEndDate(e.target.value)} className={inputCls} />
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-5">
            <span className="text-[0.65rem] font-semibold tracking-widest uppercase text-slate-600 self-center mr-1">
              {t("filters.quickFilter")}
            </span>
            {(["EXCELENTE","BOM","REGULAR","RUIM"] as Classification[]).map((c) => (
              <button key={c} type="button" onClick={() => setFilterClassification(filterClassification === c ? "" : c)}
                className={`px-3 py-1 rounded-full text-[0.7rem] font-bold border transition-all duration-200 ${filterClassification === c ? classColors[c] : "text-slate-600 border-slate-800 bg-transparent hover:border-slate-700 hover:text-slate-400"}`}>
                {c}
              </button>
            ))}
          </div>

          <div className="flex justify-end gap-3 mt-5 pt-4 border-t border-white/[0.05]">
            <button type="button"
              onClick={() => { setFilterName(""); setFilterLanguage(""); setFilterClassification(""); setFilterMinScore(""); setFilterMaxScore(""); setFilterStartDate(""); setFilterEndDate(""); }}
              className="px-4 py-2 rounded-xl text-[0.8rem] font-medium text-slate-500 border border-slate-800 hover:text-slate-300 hover:border-slate-700 transition-all duration-200">
              {t("filters.clear")}
            </button>
            <button type="button" onClick={onApply}
              className="relative inline-flex items-center gap-2 overflow-hidden px-5 py-2 rounded-xl font-bold text-[0.82rem] text-white bg-gradient-to-br from-sky-500 to-violet-500 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(56,189,248,0.3)] before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/15 before:to-transparent before:-translate-x-full before:transition-transform before:duration-500 hover:before:translate-x-full">
              <Search size={13} />
              {buttonLabel ?? t("filters.apply")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}