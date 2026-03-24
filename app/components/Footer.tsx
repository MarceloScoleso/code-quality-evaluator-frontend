import Link from "next/link";
 
export default function Footer() {
  return (
    <footer className="relative mt-20 border-t border-slate-800/70 overflow-hidden">
 
      {/* fundo sutil */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none" />
 
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row items-center justify-center gap-5">
  <p className="text-[0.75rem] text-slate-600 text-center">
    © {new Date().getFullYear()}{" "}
    <span className="text-slate-500 font-medium">Code Quality Evaluator</span>
    {" "}— Análise técnica estruturada de projetos de software.
  </p>
</div>
      </div>
    </footer>
  );
}