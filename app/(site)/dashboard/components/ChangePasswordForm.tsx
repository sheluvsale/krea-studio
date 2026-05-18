"use client";

import { useState } from "react";

export default function ChangePasswordForm() {
  const [form, setForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");
    if (form.newPassword !== form.confirmPassword) {
      setMsg("Las contraseñas no coinciden.");
      return;
    }
    if (form.newPassword.length < 6) {
      setMsg("La nueva contraseña debe tener al menos 6 caracteres.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/profile/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: form.currentPassword, newPassword: form.newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        setMsg("Contraseña actualizada correctamente.");
        setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        setMsg(data.error || "Error al actualizar contraseña.");
      }
    } catch {
      setMsg("Error de conexión.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      {msg && (
        <div className={`p-3 text-sm border ${msg.includes("correctamente") ? "bg-green-500/10 border-green-500/30 text-green-400" : "bg-red-500/10 border-red-500/30 text-red-400"}`}>
          {msg}
        </div>
      )}
      <div>
        <label className="block text-xs uppercase tracking-[1.5px] text-[#888] mb-2 font-[family-name:var(--font-heading)]">
          Contraseña Actual
        </label>
        <input
          type="password"
          value={form.currentPassword}
          onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
          required
          className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#2a2a2a] text-[#f5f5f5] text-sm focus:outline-none focus:border-[#888]"
        />
      </div>
      <div>
        <label className="block text-xs uppercase tracking-[1.5px] text-[#888] mb-2 font-[family-name:var(--font-heading)]">
          Nueva Contraseña
        </label>
        <input
          type="password"
          value={form.newPassword}
          onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
          required
          className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#2a2a2a] text-[#f5f5f5] text-sm focus:outline-none focus:border-[#888]"
        />
      </div>
      <div>
        <label className="block text-xs uppercase tracking-[1.5px] text-[#888] mb-2 font-[family-name:var(--font-heading)]">
          Confirmar Nueva Contraseña
        </label>
        <input
          type="password"
          value={form.confirmPassword}
          onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
          required
          className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#2a2a2a] text-[#f5f5f5] text-sm focus:outline-none focus:border-[#888]"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="border border-[#888] text-[#888] px-6 py-3 text-[0.75rem] uppercase tracking-[2px] font-[family-name:var(--font-heading)] transition-all hover:border-white hover:text-white bg-transparent disabled:opacity-50"
      >
        {loading ? "Actualizando..." : "Cambiar Contraseña"}
      </button>
    </form>
  );
}
