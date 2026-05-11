"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function SignupPage() {
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    telefono: "",
    contrasena: "",
    confirmar: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (key: string, val: string) =>
    setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (data.success) {
        setSuccess("¡Cuenta creada exitosamente! Ahora puedes iniciar sesión.");
        setForm({
          nombre: "",
          apellido: "",
          correo: "",
          telefono: "",
          contrasena: "",
          confirmar: "",
        });
      } else {
        setError(data.error || "Error al crear la cuenta.");
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
          Crear cuenta
        </h1>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded text-sm mb-6 text-center">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-500/10 border border-green-500/30 text-green-400 p-4 rounded text-sm mb-6 text-center">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="nombre"
                className="block text-xs uppercase tracking-[1.5px] text-[#888] mb-2 font-[family-name:var(--font-heading)]"
              >
                Nombre <span className="text-[#ffffff]">*</span>
              </label>
              <input
                type="text"
                id="nombre"
                required
                value={form.nombre}
                onChange={(e) => set("nombre", e.target.value)}
                className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#2a2a2a] text-[#f5f5f5] font-[family-name:var(--font-body)] text-sm focus:outline-none focus:border-[#888] transition-colors"
              />
            </div>
            <div>
              <label
                htmlFor="apellido"
                className="block text-xs uppercase tracking-[1.5px] text-[#888] mb-2 font-[family-name:var(--font-heading)]"
              >
                Apellido <span className="text-[#ffffff]">*</span>
              </label>
              <input
                type="text"
                id="apellido"
                required
                value={form.apellido}
                onChange={(e) => set("apellido", e.target.value)}
                className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#2a2a2a] text-[#f5f5f5] font-[family-name:var(--font-body)] text-sm focus:outline-none focus:border-[#888] transition-colors"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="correo"
              className="block text-xs uppercase tracking-[1.5px] text-[#888] mb-2 font-[family-name:var(--font-heading)]"
            >
              Correo Electrónico <span className="text-[#ffffff]">*</span>
            </label>
            <input
              type="email"
              id="correo"
              required
              value={form.correo}
              onChange={(e) => set("correo", e.target.value)}
              className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#2a2a2a] text-[#f5f5f5] font-[family-name:var(--font-body)] text-sm focus:outline-none focus:border-[#888] transition-colors"
            />
          </div>
          <div>
            <label
              htmlFor="telefono"
              className="block text-xs uppercase tracking-[1.5px] text-[#888] mb-2 font-[family-name:var(--font-heading)]"
            >
              Teléfono
            </label>
            <input
              type="tel"
              id="telefono"
              value={form.telefono}
              onChange={(e) => set("telefono", e.target.value)}
              className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#2a2a2a] text-[#f5f5f5] font-[family-name:var(--font-body)] text-sm focus:outline-none focus:border-[#888] transition-colors"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="contrasena"
                className="block text-xs uppercase tracking-[1.5px] text-[#888] mb-2 font-[family-name:var(--font-heading)]"
              >
                Contraseña <span className="text-[#ffffff]">*</span>
              </label>
              <input
                type="password"
                id="contrasena"
                required
                minLength={6}
                value={form.contrasena}
                onChange={(e) => set("contrasena", e.target.value)}
                className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#2a2a2a] text-[#f5f5f5] font-[family-name:var(--font-body)] text-sm focus:outline-none focus:border-[#888] transition-colors"
              />
            </div>
            <div>
              <label
                htmlFor="confirmar"
                className="block text-xs uppercase tracking-[1.5px] text-[#888] mb-2 font-[family-name:var(--font-heading)]"
              >
                Confirmar <span className="text-[#ffffff]">*</span>
              </label>
              <input
                type="password"
                id="confirmar"
                required
                value={form.confirmar}
                onChange={(e) => set("confirmar", e.target.value)}
                className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#2a2a2a] text-[#f5f5f5] font-[family-name:var(--font-body)] text-sm focus:outline-none focus:border-[#888] transition-colors"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#ffffff] text-[#0a0a0a] py-3 text-[0.75rem] uppercase tracking-[2px] font-[family-name:var(--font-heading)] font-semibold transition-all duration-300 hover:bg-[#d4d4d4] disabled:opacity-50"
          >
            {loading ? "Creando..." : "Crear Cuenta"}
          </button>
        </form>
        <div className="mt-8 text-center text-sm text-[#888]">
          <p>
            ¿Ya tienes una cuenta?{" "}
            <Link
              href="/login"
              className="text-[#ffffff] hover:text-[#d4d4d4] transition-colors"
            >
              Iniciar sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
