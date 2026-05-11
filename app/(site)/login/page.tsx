"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, contrasena }),
      });
      const data = await res.json();

      if (data.success) {
        if (data.user.rol === "admin" || data.user.rol === "vendedor") {
          router.push("/admin");
        } else {
          router.push("/dashboard");
        }
      } else {
        setError(data.error || "Error al iniciar sesión.");
      }
    } catch {
      setError("Error de conexión.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#0a0a0a] relative">
      <Link
        href="/"
        className="absolute top-6 left-6 text-[#888] hover:text-white transition-colors text-xs uppercase tracking-[2px] font-[family-name:var(--font-heading)] z-10"
      >
        ← Volver al inicio
      </Link>
      <div className="w-full max-w-[450px] bg-[#141414] border border-[#2a2a2a] p-10 reveal active">
        <div className="mb-8 flex justify-center">
          <Link href="/">
            <Image
              src="/images/logo/Krea-blanco-sinfondo.png"
              alt="Krea"
              width={120}
              height={40}
            />
          </Link>
        </div>
        <h1 className="font-[family-name:var(--font-heading)] text-[1.8rem] uppercase tracking-[2px] mb-2 text-center">
          Bienvenido de vuelta
        </h1>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded text-sm mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="correo"
              className="block text-xs uppercase tracking-[1.5px] text-[#888] mb-2 font-[family-name:var(--font-heading)]"
            >
              Correo Electrónico
            </label>
            <input
              type="email"
              id="correo"
              required
              autoFocus
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#2a2a2a] text-[#f5f5f5] font-[family-name:var(--font-body)] text-sm focus:outline-none focus:border-[#888] transition-colors"
            />
          </div>
          <div>
            <label
              htmlFor="contrasena"
              className="block text-xs uppercase tracking-[1.5px] text-[#888] mb-2 font-[family-name:var(--font-heading)]"
            >
              Contraseña
            </label>
            <div className="relative flex items-center">
              <input
                type={showPw ? "text" : "password"}
                id="contrasena"
                required
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                className="w-full px-4 py-3 pr-12 bg-[#1a1a1a] border border-[#2a2a2a] text-[#f5f5f5] font-[family-name:var(--font-body)] text-sm focus:outline-none focus:border-[#888] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 text-[#888] hover:text-white transition-colors bg-transparent border-none"
              >
                {showPw ? (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#ffffff] text-[#0a0a0a] py-3 text-[0.75rem] uppercase tracking-[2px] font-[family-name:var(--font-heading)] font-semibold transition-all duration-300 hover:bg-[#d4d4d4] disabled:opacity-50"
          >
            {loading ? "Iniciando..." : "Iniciar Sesión"}
          </button>
        </form>
        <div className="mt-8 text-center text-sm text-[#888]">
          <p>
            ¿No tienes una cuenta?{" "}
            <Link
              href="/signup"
              className="text-[#ffffff] hover:text-[#d4d4d4] transition-colors"
            >
              Crear cuenta
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
