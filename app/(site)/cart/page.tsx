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
  const total = subtotal + costoEnvio + impuestos;

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
              <div className="flex justify-between text-sm mb-6">
                <span className="text-[#888]">Impuestos</span>
                <span>${impuestos.toFixed(2)}</span>
              </div>
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
            <div className="text-4xl mb-4">🚧</div>
            <h3 className="font-[family-name:var(--font-heading)] text-xl mb-2">
              Proyecto Beta
            </h3>
            <p className="text-[#888] text-sm mb-6">
              La opción de pago no está disponible. Estamos trabajando para
              habilitar esta función pronto.
            </p>
            <button
              className="bg-[#ffffff] text-[#0a0a0a] px-8 py-3 text-[0.75rem] uppercase tracking-[2px] font-[family-name:var(--font-heading)] font-semibold transition-all hover:bg-[#d4d4d4]"
              onClick={() => setShowBeta(false)}
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
