"use client";

import { useState, useEffect } from "react";
import MobileWarning from "@/components/MobileWarning";

export default function ContactoPage() {
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    asunto: "",
    mensaje: "",
  });
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [userRol, setUserRol] = useState("");

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (d.user?.isLoggedIn) setUserRol(d.user.rol || "");
      })
      .catch(() => {});
  }, []);

  const isAdmin = userRol === "admin";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nombre || !form.email || !form.asunto || !form.mensaje) {
      setStatus("error");
      setErrorMsg("Por favor, completa todos los campos.");
      return;
    }
    setLoading(true);
    setStatus("idle");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        setForm({ nombre: "", email: "", asunto: "", mensaje: "" });
      } else {
        setStatus("error");
        setErrorMsg(data.error || "Error al enviar.");
      }
    } catch {
      setStatus("error");
      setErrorMsg("Error de conexión.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Hero */}
      <section
        id="inicio"
        className="h-screen flex flex-col justify-center items-center text-center relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #0a0a0a 0%, #141414 50%, #0f0f0f 100%)",
        }}
      >
        <div className="relative z-10 px-8">
          <h1 className="font-[family-name:var(--font-heading)] text-[clamp(3rem,8vw,6rem)] font-semibold tracking-[-2px] leading-[1.1] mb-6 opacity-0 animate-[fadeInUp_1s_ease_forwards]">
            <span className="text-[#888] font-light">Contacto</span> Streetwear
          </h1>
          <p className="text-[1.1rem] text-[#888] max-w-[500px] mx-auto mb-8 opacity-0 animate-[fadeInUp_1s_ease_0.3s_forwards]">
            Estamos aquí para ayudarte. Envíanos tu consulta y te responderemos
            en breve.
          </p>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-0 animate-[fadeIn_1s_ease_1.5s_forwards]">
          <span className="text-[0.65rem] tracking-[3px] uppercase text-[#888]">
            Explorar
          </span>
          <div className="w-[25px] h-[40px] border border-[#888] rounded-[12px] relative">
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-1 h-2 bg-[#888] rounded-full animate-[fadeInUp_1.5s_ease_infinite]" />
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-24 px-[5%] bg-[#0a0a0a]">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="text-center reveal">
            <div className="text-[#ffffff] text-2xl mb-4 flex justify-center">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </div>
            <h4 className="font-[family-name:var(--font-heading)] text-sm uppercase tracking-[2px] mb-3">
              Email
            </h4>
            <p className="text-[#888] text-sm leading-relaxed">
              hola@kreastreetwear.com
              <br />
              Respuesta en 24-48 horas
            </p>
          </div>
          <div className="text-center reveal">
            <div className="text-[#ffffff] text-2xl mb-4 flex justify-center">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            </div>
            <h4 className="font-[family-name:var(--font-heading)] text-sm uppercase tracking-[2px] mb-3">
              Teléfono
            </h4>
            <p className="text-[#888] text-sm leading-relaxed">
              +52 (55) 1234-5678
              <br />
              Lun-Vie: 9:00 - 18:00
            </p>
          </div>
          <div className="text-center reveal">
            <div className="text-[#ffffff] text-2xl mb-4 flex justify-center">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>
            <h4 className="font-[family-name:var(--font-heading)] text-sm uppercase tracking-[2px] mb-3">
              Ubicación
            </h4>
            <p className="text-[#888] text-sm leading-relaxed">
              Ciudad de México, México
              <br />
              Envíos a todo el país
            </p>
          </div>
          <div className="text-center reveal">
            <div className="text-[#ffffff] text-2xl mb-4 flex justify-center">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </div>
            <h4 className="font-[family-name:var(--font-heading)] text-sm uppercase tracking-[2px] mb-3">
              Instagram
            </h4>
            <p className="text-[#888] text-sm leading-relaxed">
              @kreastreetwear
              <br />
              Síguenos para novedades
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="formulario" className="py-24 px-[5%] bg-[#0a0a0a]">
        <div className="text-center mb-16 reveal">
          <p className="text-[#ffffff] text-xs uppercase tracking-[3px] mb-4">
            Escríbenos
          </p>
          <h2 className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl font-semibold tracking-[-1px]">
            Envíanos un Mensaje
          </h2>
          <div className="w-12 h-px bg-[#ffffff] mx-auto mt-6" />
        </div>
        <div className="max-w-[1200px] mx-auto px-[5%]">
          {status === "success" && (
            <div className="reveal bg-green-500/10 border border-green-500/30 text-green-400 p-4 rounded text-sm mb-8 max-w-[800px] mx-auto">
              ¡Gracias por contactarnos! Tu mensaje ha sido enviado. Te
              responderemos pronto.
            </div>
          )}
          {status === "error" && (
            <div className="reveal bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded text-sm mb-8 max-w-[800px] mx-auto">
              {errorMsg}
            </div>
          )}
          {isAdmin && (
            <div className="reveal bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 p-4 rounded text-sm mb-8 max-w-[800px] mx-auto">
              Como administrador, no puedes enviar mensajes de contacto desde la
              tienda.
            </div>
          )}
          <form
            onSubmit={handleSubmit}
            className="reveal space-y-6 max-w-[800px] mx-auto"
          >
            <div>
              <label
                htmlFor="nombre"
                className="block text-xs uppercase tracking-[1.5px] text-[#888] mb-2 font-[family-name:var(--font-heading)]"
              >
                Nombre Completo
              </label>
              <input
                type="text"
                id="nombre"
                required
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                disabled={isAdmin}
                className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#2a2a2a] text-[#f5f5f5] font-[family-name:var(--font-body)] text-sm focus:outline-none focus:border-[#888] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-xs uppercase tracking-[1.5px] text-[#888] mb-2 font-[family-name:var(--font-heading)]"
              >
                Correo Electrónico
              </label>
              <input
                type="email"
                id="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                disabled={isAdmin}
                className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#2a2a2a] text-[#f5f5f5] font-[family-name:var(--font-body)] text-sm focus:outline-none focus:border-[#888] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              />
            </div>
            <div>
              <label
                htmlFor="asunto"
                className="block text-xs uppercase tracking-[1.5px] text-[#888] mb-2 font-[family-name:var(--font-heading)]"
              >
                Asunto
              </label>
              <select
                id="asunto"
                required
                value={form.asunto}
                onChange={(e) => setForm({ ...form, asunto: e.target.value })}
                disabled={isAdmin}
                className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#2a2a2a] text-[#f5f5f5] font-[family-name:var(--font-body)] text-sm focus:outline-none focus:border-[#888] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <option value="">Selecciona un asunto</option>
                <option value="pedido">Consulta sobre pedido</option>
                <option value="producto">Información de producto</option>
                <option value="envio">Envíos y entregas</option>
                <option value="devolucion">Devoluciones</option>
                <option value="colaboracion">Colaboraciones</option>
                <option value="otro">Otro</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="mensaje"
                className="block text-xs uppercase tracking-[1.5px] text-[#888] mb-2 font-[family-name:var(--font-heading)]"
              >
                Mensaje
              </label>
              <textarea
                id="mensaje"
                rows={6}
                required
                placeholder={
                  isAdmin
                    ? "No disponible para administradores"
                    : "Cuéntanos en qué podemos ayudarte..."
                }
                value={form.mensaje}
                onChange={(e) => setForm({ ...form, mensaje: e.target.value })}
                disabled={isAdmin}
                className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#2a2a2a] text-[#f5f5f5] font-[family-name:var(--font-body)] text-sm focus:outline-none focus:border-[#888] transition-colors resize-none disabled:opacity-40 disabled:cursor-not-allowed"
              />
            </div>
            <div className="text-center">
              <button
                type="submit"
                disabled={loading || isAdmin}
                className="bg-[#ffffff] text-[#0a0a0a] px-12 py-4 text-[0.75rem] uppercase tracking-[2px] font-[family-name:var(--font-heading)] font-semibold transition-all duration-300 hover:bg-[#d4d4d4] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAdmin
                  ? "No disponible"
                  : loading
                    ? "Enviando..."
                    : "Enviar Mensaje"}
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-[5%] bg-[#0a0a0a]">
        <div className="text-center mb-16 reveal">
          <p className="text-[#ffffff] text-xs uppercase tracking-[3px] mb-4">
            Preguntas Frecuentes
          </p>
          <h2 className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl font-semibold tracking-[-1px]">
            ¿Tienes dudas?
          </h2>
          <div className="w-12 h-px bg-[#ffffff] mx-auto mt-6" />
        </div>
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              badge: "Envíos",
              q: "¿Cuánto tarda el envío?",
              a: "Los envíos estándar tardan 3-5 días hábiles. Los envíos express llegan en 24-48 horas.",
            },
            {
              badge: "Pedidos",
              q: "¿Puedo cambiar mi pedido?",
              a: "Sí, puedes modificar tu pedido dentro de las primeras 2 horas después de realizarlo.",
            },
            {
              badge: "Devoluciones",
              q: "¿Cómo realizo una devolución?",
              a: "Tienes 30 días para devolver cualquier artículo en su estado original.",
            },
          ].map((faq) => (
            <article
              key={faq.q}
              className="bg-[#141414] border border-[#2a2a2a] p-8 relative transition-all duration-300 hover:-translate-y-2 hover:border-[#3a3a3a] reveal"
            >
              <span className="inline-block bg-[#ffffff] text-[#0a0a0a] text-[0.6rem] uppercase tracking-[2px] font-semibold px-3 py-1 mb-4">
                {faq.badge}
              </span>
              <h3 className="font-[family-name:var(--font-heading)] text-xl mb-3">
                {faq.q}
              </h3>
              <p className="text-[#888] text-sm leading-relaxed">{faq.a}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
