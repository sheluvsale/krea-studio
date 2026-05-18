"use client";

import Link from "next/link";
import { useEffect, useState, useCallback } from "react";

interface CartItem {
  id: number;
  producto_id: number;
  nombre: string;
  slug: string;
  precio_base: number;
  cantidad: number;
  talla: string;
  color?: string;
  imagen: string;
}

const ENVIO_GRATIS_MINIMO = 3000;
const COSTO_ENVIO = 150;

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ isLoggedIn: boolean } | null>(null);
  const [showBeta, setShowBeta] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<
    {
      id: number;
      nombre: string;
      descripcion?: string;
      imagen_url?: string;
      comision_porcentaje?: number;
    }[]
  >([]);
  const [loadingPayments, setLoadingPayments] = useState(false);
  const [paymentMsg, setPaymentMsg] = useState("");
  const [cupon, setCupon] = useState("");
  const [cuponValido, setCuponValido] = useState(false);
  const [descuento, setDescuento] = useState(0);
  const [cuponMsg, setCuponMsg] = useState("");

  const fetchCart = useCallback(async () => {
    try {
      const res = await fetch("/api/cart");
      const data = await res.json();
      setItems(data.items || []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => setUser(d.user))
      .catch(() => setUser(null));
    fetchCart();
  }, [fetchCart]);

  useEffect(() => {
    if (!showBeta) return;
    setPaymentMsg("");
    setLoadingPayments(true);
    fetch("/api/payment-methods")
      .then((r) => r.json())
      .then((d) => setPaymentMethods(d.metodos || []))
      .catch(() => setPaymentMethods([]))
      .finally(() => setLoadingPayments(false));
  }, [showBeta]);

  const updateQty = async (id: number, delta: number) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    const newQty = item.cantidad + delta;
    await fetch("/api/cart", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, cantidad: newQty }),
    });
    fetchCart();
  };

  const removeItem = async (id: number) => {
    await fetch("/api/cart", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchCart();
  };

  const subtotal = items.reduce(
    (s, i) => s + Number(i.precio_base) * i.cantidad,
    0,
  );
  const envioGratis = subtotal >= ENVIO_GRATIS_MINIMO;
  const costoEnvio = envioGratis ? 0 : COSTO_ENVIO;
  const impuestos = subtotal * 0.16;
  const total = subtotal + costoEnvio + impuestos - descuento;

  const validarCupon = async () => {
    if (!cupon.trim()) {
      setCuponMsg("Ingresa un código de cupón.");
      return;
    }

    try {
      const res = await fetch("/api/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          codigo: cupon,
          total: subtotal + costoEnvio + impuestos,
        }),
      });
      const data = await res.json();

      if (res.ok) {
        setCuponValido(true);
        setDescuento(Number(data.descuento));
        setCuponMsg(`¡Cupón aplicado! Descuento: $${data.descuento}`);
      } else {
        setCuponValido(false);
        setDescuento(0);
        setCuponMsg(data.error || "Cupón inválido.");
      }
    } catch (error) {
      setCuponValido(false);
      setDescuento(0);
      setCuponMsg("Error al validar cupón.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] py-24 px-[5%]">
        <div className="text-center reveal max-w-[1200px] mx-auto">
          <h1 className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl font-semibold tracking-[-1px] mb-2">
            Carrito
          </h1>
          <p className="text-[#888]">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] py-24 px-[5%]">
      <div className="text-center mb-12 reveal max-w-[1200px] mx-auto">
        <h1 className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl font-semibold tracking-[-1px] mb-2">
          Carrito
        </h1>
        <p className="text-[#888]">
          Revisa tus productos antes de finalizar tu compra
        </p>
      </div>

      <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 reveal">
        {!user?.isLoggedIn ? (
          <div className="lg:col-span-2 max-w-[600px] mx-auto text-center">
            <div className="bg-[#141414] border border-[#2a2a2a] p-12">
              <h2 className="font-[family-name:var(--font-heading)] text-xl mb-3">
                Inicia sesión para ver tu carrito
              </h2>
              <p className="text-[#888] mb-6">
                Debes tener una cuenta para agregar y ver productos en tu
                carrito.
              </p>
              <Link
                href="/login"
                className="inline-block bg-[#ffffff] text-[#0a0a0a] px-8 py-3 text-[0.75rem] uppercase tracking-[2px] font-[family-name:var(--font-heading)] font-semibold transition-all hover:bg-[#d4d4d4]"
              >
                Iniciar Sesión
              </Link>
              <p className="mt-8 text-[#888] text-sm">
                ¿No tienes cuenta?{" "}
                <Link
                  href="/signup"
                  className="text-[#ffffff] hover:text-[#d4d4d4]"
                >
                  Regístrate aquí
                </Link>
              </p>
            </div>
          </div>
        ) : items.length === 0 ? (
          <div className="lg:col-span-2 max-w-[600px] mx-auto text-center">
            <div className="bg-[#141414] border border-[#2a2a2a] p-12">
              <h2 className="font-[family-name:var(--font-heading)] text-xl mb-3">
                Tu carrito está vacío
              </h2>
              <p className="text-[#888] mb-6">
                Explora nuestra colección y encuentra algo que te inspire.
              </p>
              <Link
                href="/productos"
                className="inline-block bg-[#ffffff] text-[#0a0a0a] px-8 py-3 text-[0.75rem] uppercase tracking-[2px] font-[family-name:var(--font-heading)] font-semibold transition-all hover:bg-[#d4d4d4]"
              >
                Ver Productos
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#141414] border border-[#2a2a2a] p-4 flex items-center gap-4 flex-wrap md:flex-nowrap"
                >
                  <Link
                    href={`/producto/${item.slug}`}
                    className="flex items-center gap-4 flex-1 min-w-0"
                  >
                    <div className="w-20 h-20 flex-shrink-0 overflow-hidden bg-[#1a1a1a]">
                      <img
                        src={item.imagen || "/images/products/placeholder.jpg"}
                        alt={item.nombre}
                        loading="lazy"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "/images/products/placeholder.jpg";
                        }}
                      />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-[family-name:var(--font-heading)] text-sm truncate">
                        {item.nombre}
                      </h3>
                      <p className="text-[#888] text-xs">
                        Talla: {item.talla || "N/A"} | Color:{" "}
                        {item.color || "N/A"}
                      </p>
                    </div>
                  </Link>
                  <div className="flex items-center border border-[#2a2a2a]">
                    <button
                      className="w-8 h-8 bg-transparent border-none text-[#f5f5f5] hover:bg-[#1a1a1a] transition-colors"
                      onClick={() => updateQty(item.id, -1)}
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-sm font-[family-name:var(--font-heading)]">
                      {item.cantidad}
                    </span>
                    <button
                      className="w-8 h-8 bg-transparent border-none text-[#f5f5f5] hover:bg-[#1a1a1a] transition-colors"
                      onClick={() => updateQty(item.id, 1)}
                    >
                      +
                    </button>
                  </div>
                  <div className="text-[#ffffff] font-semibold text-sm">
                    ${Number(item.precio_base).toFixed(2)}
                  </div>
                  <button
                    className="text-[#888] hover:text-red-400 transition-colors bg-transparent border-none"
                    onClick={() => removeItem(item.id)}
                    title="Eliminar"
                  >
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
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      <line x1="10" y1="11" x2="10" y2="17" />
                      <line x1="14" y1="11" x2="14" y2="17" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            {/* Cupón */}
            <div className="bg-[#141414] border border-[#2a2a2a] p-8 mb-6">
              <label className="block text-xs uppercase tracking-[1.5px] text-[#888] font-[family-name:var(--font-heading)] mb-4">
                Cupón de Descuento
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={cupon}
                  onChange={(e) => setCupon(e.target.value.toUpperCase())}
                  placeholder="Código de cupón"
                  disabled={cuponValido}
                  className="flex-1 px-4 py-3 bg-[#1a1a1a] border border-[#2a2a2a] text-[#f5f5f5] text-sm focus:outline-none focus:border-[#888] uppercase"
                />
                {!cuponValido ? (
                  <button
                    type="button"
                    onClick={validarCupon}
                    className="px-6 py-3 bg-[#ffffff] text-[#0a0a0a] text-[0.75rem] uppercase tracking-[2px] font-[family-name:var(--font-heading)] font-semibold transition-all hover:bg-[#d4d4d4] border-none cursor-pointer"
                  >
                    Aplicar
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setCupon("");
                      setCuponValido(false);
                      setDescuento(0);
                      setCuponMsg("");
                    }}
                    className="px-6 py-3 bg-red-500 text-white text-[0.75rem] uppercase tracking-[2px] font-[family-name:var(--font-heading)] font-semibold transition-all hover:bg-red-600 border-none cursor-pointer"
                  >
                    Remover
                  </button>
                )}
              </div>
              {cuponMsg && (
                <p
                  className={`text-xs mt-2 ${cuponValido ? "text-green-400" : "text-red-400"}`}
                >
                  {cuponMsg}
                </p>
              )}
            </div>

            <div className="bg-[#141414] border border-[#2a2a2a] p-8 h-fit">
              <h2 className="font-[family-name:var(--font-heading)] text-lg uppercase tracking-[2px] mb-6">
                Resumen del Pedido
              </h2>
              <div className="flex justify-between text-sm mb-3">
                <span className="text-[#888]">Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm mb-3">
                <span className="text-[#888]">Envío</span>
                <span>
                  {envioGratis ? "Gratis" : `$${costoEnvio.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-sm mb-3">
                <span className="text-[#888]">Impuestos</span>
                <span>${impuestos.toFixed(2)}</span>
              </div>
              {descuento > 0 && (
                <div className="flex justify-between text-sm mb-3">
                  <span className="text-green-400">Descuento</span>
                  <span className="text-green-400">
                    -$${descuento.toFixed(2)}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-lg font-semibold border-t border-[#2a2a2a] pt-4 mb-6">
                <span>Total</span>
                <span className="text-[#ffffff]">${total.toFixed(2)}</span>
              </div>
              <button
                className="w-full bg-[#ffffff] text-[#0a0a0a] py-4 text-[0.75rem] uppercase tracking-[2px] font-[family-name:var(--font-heading)] font-semibold transition-all hover:bg-[#d4d4d4] mb-4"
                onClick={() => setShowBeta(true)}
              >
                Finalizar Compra
              </button>
              <Link
                href="/productos"
                className="block w-full text-center border border-[#888] text-[#888] py-3 text-[0.75rem] uppercase tracking-[2px] font-[family-name:var(--font-heading)] transition-all hover:border-white hover:text-white"
              >
                Seguir Comprando
              </Link>
            </div>
          </>
        )}
      </div>

      {/* Beta Modal */}
      {showBeta && (
        <div
          className="fixed inset-0 bg-black/80 z-[10000] flex items-center justify-center p-6"
          onClick={() => setShowBeta(false)}
        >
          <div
            className="bg-[#141414] border border-[#2a2a2a] p-8 max-w-[400px] w-full text-center relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 text-[#888] hover:text-white text-2xl bg-transparent border-none"
              onClick={() => setShowBeta(false)}
            >
              &times;
            </button>
            <h3 className="font-[family-name:var(--font-heading)] text-xl mb-4">
              Finalizar Compra
            </h3>
            <p className="text-[#888] text-sm mb-6">
              Selecciona un método de pago disponible. El procesamiento de pagos
              se activará próximamente.
            </p>
            {paymentMsg && (
              <div className="bg-[#2a1a1a] border border-red-900/40 text-red-300 text-sm px-4 py-3 rounded mb-6">
                {paymentMsg}
              </div>
            )}
            {loadingPayments ? (
              <div className="text-[#888] text-sm mb-6">
                Cargando métodos...
              </div>
            ) : paymentMethods.length === 0 ? (
              <div className="text-[#888] text-sm mb-6">
                No hay métodos de pago configurados.
              </div>
            ) : (
              <div className="flex flex-col gap-3 mb-6">
                {paymentMethods.map((m) => (
                  <button
                    key={m.id}
                    className="flex items-center gap-3 w-full text-left border border-[#2a2a2a] rounded px-4 py-3 text-sm text-[#f5f5f5] hover:border-[#888] hover:bg-[#1a1a1a] transition-colors bg-transparent"
                    onClick={() =>
                      setPaymentMsg("Método de pago aún no disponible")
                    }
                  >
                    {m.imagen_url ? (
                      <img
                        src={m.imagen_url}
                        alt={m.nombre}
                        className="w-8 h-8 object-contain"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-[#2a2a2a] rounded flex items-center justify-center text-xs text-[#888]">
                        P
                      </div>
                    )}
                    <div>
                      <div className="font-medium">{m.nombre}</div>
                      {m.descripcion && (
                        <div className="text-xs text-[#888]">
                          {m.descripcion}
                        </div>
                      )}
                      {m.comision_porcentaje ? (
                        <div className="text-xs text-[#888]">
                          Comisión: {m.comision_porcentaje}%
                        </div>
                      ) : null}
                    </div>
                  </button>
                ))}
              </div>
            )}
            <button
              className="w-full bg-[#ffffff] text-[#0a0a0a] py-3 text-[0.75rem] uppercase tracking-[2px] font-[family-name:var(--font-heading)] font-semibold transition-all hover:bg-[#d4d4d4]"
              onClick={() => setShowBeta(false)}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
