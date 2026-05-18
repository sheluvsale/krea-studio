"use client";

import { useState, useEffect } from "react";
import { Lock } from "lucide-react";

interface PasswordGateProps {
  children: React.ReactNode;
}

export default function PasswordGate({ children }: PasswordGateProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Check local storage on mount
  useEffect(() => {
    const stored = localStorage.getItem("krea-designer-auth");
    if (stored === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Check password - using env variable or default
    const correctPassword = process.env.NEXT_PUBLIC_DESIGNER_PASSWORD || "krea2024";

    setTimeout(() => {
      if (password === correctPassword) {
        localStorage.setItem("krea-designer-auth", "true");
        setIsAuthenticated(true);
      } else {
        setError("Contraseña incorrecta. Intenta de nuevo.");
      }
      setLoading(false);
    }, 500);
  };

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="h-screen w-full flex items-center justify-center bg-[#0a0a0a]">
      <div className="w-full max-w-md p-8 bg-[#141414] border border-[#2a2a2a]">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="font-[family-name:var(--font-heading)] text-2xl font-semibold tracking-[-0.5px] mb-2">
            Acceso Restringido
          </h1>
          <p className="text-[#888] text-sm">
            El diseñador está en desarrollo. Introduce la contraseña para continuar.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-[1.5px] text-[#888] mb-2 font-[family-name:var(--font-heading)]">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Introduce la contraseña"
              className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#2a2a2a] text-[#f5f5f5] text-sm focus:outline-none focus:border-[#888] transition-colors"
              autoFocus
            />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full bg-[#ffffff] text-[#0a0a0a] py-3 text-[0.75rem] uppercase tracking-[2px] font-[family-name:var(--font-heading)] font-semibold transition-all hover:bg-[#d4d4d4] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Verificando..." : "Acceder"}
          </button>
        </form>

        <p className="text-center text-[#666] text-xs mt-6">
          Krea Studio - Diseñador de Ropa
        </p>
      </div>
    </div>
  );
}
