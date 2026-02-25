"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import Link from "next/link";
import Image from "next/image";
import { API_URL } from "@/app/config/api";
import { Eye, EyeOff } from "lucide-react"; // usar lucide-react para os ícones

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      alert("Credenciais inválidas");
      return;
    }

    const data = await res.json();
    login(data.token);
    router.push("/evaluations");
  }

  return (
    <main className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950">
      {/* Fundo animado */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="animate-spin-slow absolute w-[600px] h-[600px] bg-gradient-to-r from-purple-600 to-blue-400 opacity-20 rounded-full -top-32 -left-32"></div>
        <div className="animate-pulse absolute w-[400px] h-[400px] bg-gradient-to-r from-blue-400 to-purple-500 opacity-10 rounded-full -bottom-20 -right-20"></div>
      </div>

      <div className="relative z-10 w-full max-w-md p-10 rounded-3xl border border-purple-500/30 shadow-2xl backdrop-blur-sm bg-gradient-to-tr from-slate-800/90 to-slate-900/95 space-y-6">
        <div className="flex justify-center mb-6">
          <Image src="/Logo1.png" alt="Logo" width={140} height={50} className="drop-shadow-lg" />
        </div>

        <h1 className="text-3xl md:text-4xl font-extrabold text-center bg-gradient-to-r from-purple-500 to-blue-400 bg-clip-text text-transparent">
          Acessar Plataforma
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
  {/* Email */}
  <input
    type="email"
    placeholder="Email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    required
    className="w-full rounded-xl p-3 bg-slate-900 border border-slate-700 text-white placeholder:text-slate-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:ring-opacity-30 transition"
  />

  {/* Senha com ícone */}
  <div className="relative">
    <input
      type={showPassword ? "text" : "password"}
      placeholder="Senha"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      required
      className="w-full rounded-xl p-3 pr-10 bg-slate-900 border border-slate-700 text-white placeholder:text-slate-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:ring-opacity-30 transition"
    />

    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition"
    >
      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
    </button>
  </div>

  <button
    type="submit"
    className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-purple-500 to-blue-400 shadow-lg hover:scale-105 hover:shadow-2xl transition-transform"
  >
    Entrar
  </button>
</form>

        <p className="text-center text-sm text-slate-400">
          Não possui conta?{" "}
          <Link href="/auth/register" className="text-blue-400 font-semibold hover:underline">
            Criar agora
          </Link>
        </p>
      </div>
    </main>
  );
}