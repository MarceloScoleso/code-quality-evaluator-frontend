"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { API_URL } from "@/app/config/api";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    if (!res.ok) {
      alert("Erro ao registrar usuário");
      return;
    }

    router.push("/auth/login");
  }

  return (
    <main className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950">
      {/* 🎇 Efeitos de fundo animado */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="animate-spin-slow absolute w-[600px] h-[600px] bg-gradient-to-r from-purple-600 to-blue-400 opacity-20 rounded-full -top-32 -left-32"></div>
        <div className="animate-pulse absolute w-[400px] h-[400px] bg-gradient-to-r from-blue-400 to-purple-500 opacity-10 rounded-full -bottom-20 -right-20"></div>
      </div>

      <div className="form-card relative z-10 w-full max-w-md p-10 rounded-3xl border border-purple-500/30 shadow-2xl backdrop-blur-sm bg-gradient-to-tr from-slate-800/90 to-slate-900/95 space-y-6">
        <div className="flex justify-center mb-6">
          <Image src="/Logo1.png" alt="Logo" width={140} height={50} className="drop-shadow-lg" />
        </div>

        <h1 className="text-3xl md:text-4xl font-extrabold text-center bg-gradient-to-r from-purple-500 to-blue-400 bg-clip-text text-transparent animate-gradient">
          Criar Conta
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            placeholder="Nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full rounded-xl p-4 bg-slate-900 border border-slate-700 text-white placeholder:text-slate-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:ring-opacity-30 transition"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-xl p-4 bg-slate-900 border border-slate-700 text-white placeholder:text-slate-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:ring-opacity-30 transition"
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded-xl p-4 bg-slate-900 border border-slate-700 text-white placeholder:text-slate-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:ring-opacity-30 transition"
          />
          <button
            type="submit"
            className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-purple-500 to-blue-400 shadow-lg hover:scale-105 hover:shadow-2xl transition-transform"
          >
            Registrar
          </button>
        </form>

        <p className="text-center text-sm text-slate-400">
          Já possui conta?{" "}
          <Link href="/auth/login" className="text-blue-400 font-semibold hover:underline">
            Entrar
          </Link>
        </p>
      </div>
    </main>
  );
}