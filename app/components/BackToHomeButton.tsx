"use client";

import { useRouter } from "next/navigation";

export default function BackToHomeButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push("/")}
      className="back-home-btn"
    >
      ← Voltar para Home
    </button>
  );
}