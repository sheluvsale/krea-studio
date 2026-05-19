"use client";

import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import {
  ShoppingBag,
  Trash2,
  Minus,
  Plus,
  Truck,
  Tag,
  ArrowRight,
  Package,
} from "lucide-react";

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
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutMsg, setCheckoutMsg] = useState("");
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

  const handleCheckout = () => {
    if (!user?.isLoggedIn) {
      setCheckoutMsg("Debes iniciar sesión para finalizar la compra.");
      return;
    }
    if (items.length === 0) {
      setCheckoutMsg("Tu carrito está vacío.");
      return;
    }
    window.location.href = "/checkout";
  };

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
  const progresoEnvio = Math.min((subtotal / ENVIO_GRATIS_MINIMO) * 100, 100);
  const faltanteEnvio = Math.max(ENVIO_GRATIS_MINIMO - subtotal, 0);

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
      <div className="min-h-screen bg-[#0a0a0a] pt-32 pb-20 px-[5%]">
        <div className="max-w-[1200px] mx-auto text-center">
          <ShoppingBag
            size={32}
            strokeWidth={1.5}
            className="text-[#333] mx-auto mb-4"
          />
          <h1 className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl font-semibold tracking-[-1px] mb-2">
            Carrito
          </h1>
          <p className="text-[#888]">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-32 pb-20 px-[5%]">
      {/* Header */}
      <div className="max-w-[1200px] mx-auto mb-12 reveal">
        <div className="flex items-center gap-3 mb-2">
          <ShoppingBag size={24} strokeWidth={1.5} className="text-[#888]" />
          <h1 className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl font-semibold tracking-[-1px]">
            Tu Carrito
          </h1>
        </div>
        <p className="text-[#888] text-sm">
          {items.length > 0
            ? `${items.length} ${items.length === 1 ? "producto" : "productos"} en tu carrito`
            : "Revisa tus productos antes de finalizar tu compra"}
        </p>
      </div>

      <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 reveal">
        {!user?.isLoggedIn ? (
          <div className="lg:col-span-2 max-w-[560px] mx-auto text-center">
            <div className="bg-[#141414] border border-[#2a2a2a] p-12">
              <div className="w-14 h-14 bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center mx-auto mb-6">
                <ShoppingBag
                  size={24}
                  strokeWidth={1.5}
                  className="text-[#888]"
                />
              </div>
              <h2 className="font-[family-name:var(--font-heading)] text-xl mb-3">
                Inicia sesión para ver tu carrito
              </h2>
              <p className="text-[#888] mb-8 max-w-sm mx-auto">
                Accede a tu cuenta para gestionar tus productos y finalizar
                compras.
              </p>
              <Link
                href="/login"
                className="inline-block bg-[#ffffff] text-[#0a0a0a] px-10 py-3.5 text-[0.75rem] uppercase tracking-[2px] font-[family-name:var(--font-heading)] font-semibold transition-all hover:bg-[#d4d4d4]"
              >
                Iniciar Sesión
              </Link>
              <p className="mt-8 text-[#888] text-sm">
                ¿No tienes cuenta?{" "}
                <Link
                  href="/signup"
                  className="text-[#ffffff] hover:text-[#d4d4d4] underline underline-offset-4"
                >
                  Regístrate aquí
                </Link>
              </p>
            </div>
          </div>
        ) : items.length === 0 ? (
          <div className="lg:col-span-2 max-w-[560px] mx-auto text-center">
            <div className="bg-[#141414] border border-[#2a2a2a] p-12">
              <div className="w-14 h-14 bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center mx-auto mb-6">
                <Package size={24} strokeWidth={1.5} className="text-[#888]" />
              </div>
              <h2 className="font-[family-name:var(--font-heading)] text-xl mb-3">
                Tu carrito está vacío
              </h2>
              <p className="text-[#888] mb-8 max-w-sm mx-auto">
                Explora nuestra colección y encuentra algo que te inspire.
              </p>
              <Link
                href="/productos"
                className="inline-block bg-[#ffffff] text-[#0a0a0a] px-10 py-3.5 text-[0.75rem] uppercase tracking-[2px] font-[family-name:var(--font-heading)] font-semibold transition-all hover:bg-[#d4d4d4]"
              >
                Ver Productos
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Items Column */}
            <div className="space-y-3">
              {/* Progress bar for free shipping */}
              {!envioGratis && (
                <div className="bg-[#141414] border border-[#2a2a2a] p-5 mb-2">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Truck
                        size={14}
                        strokeWidth={1.5}
                        className="text-[#888]"
                      />
                      <span className="text-[0.7rem] uppercase tracking-[1.5px] text-[#888] font-[family-name:var(--font-heading)]">
                        Envío gratis
                      </span>
                    </div>
                    <span className="text-xs text-[#888]">
                      Te faltan{" "}
                      <strong className="text-[#f5f5f5]">
                        ${faltanteEnvio.toFixed(0)}
                      </strong>{" "}
                      para envío gratis
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-[#1a1a1a] overflow-hidden">
                    <div
                      className="h-full bg-[#ffffff] transition-all duration-500"
                      style={{ width: `${progresoEnvio}%` }}
                    />
                  </div>
                </div>
              )}
              {envioGratis && (
                <div className="bg-green-500/5 border border-green-500/20 p-5 mb-2 flex items-center gap-3">
                  <Truck
                    size={16}
                    strokeWidth={1.5}
                    className="text-green-400"
                  />
                  <span className="text-sm text-green-400 font-[family-name:var(--font-heading)]">
                    ¡Felicidades! Tienes envío gratis en este pedido
                  </span>
                </div>
              )}

              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#141414] border border-[#2a2a2a] p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5 group hover:border-[#3a3a3a] transition-colors"
                >
                  <Link
                    href={`/producto/${item.slug}`}
                    className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0"
                  >
                    <div className="w-16 h-20 sm:w-20 sm:h-24 flex-shrink-0 overflow-hidden bg-[#1a1a1a] border border-[#2a2a2a]">
                      <img
                        src={item.imagen || "/images/products/placeholder.jpg"}
                        alt={item.nombre}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "/images/products/placeholder.jpg";
                        }}
                      />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-[family-name:var(--font-heading)] text-sm truncate text-[#f5f5f5] group-hover:text-white transition-colors">
                        {item.nombre}
                      </h3>
                      <p className="text-[#888] text-xs mt-1">
                        Talla:{" "}
                        <span className="text-[#aaa]">
                          {item.talla || "N/A"}
                        </span>{" "}
                        · Color:{" "}
                        <span className="text-[#aaa]">
                          {item.color || "N/A"}
                        </span>
                      </p>
                      <p className="text-[#888] text-xs mt-1">
                        ${Number(item.precio_base).toFixed(2)} c/u
                      </p>
                    </div>
                  </Link>

                  <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 mt-1 sm:mt-0">
                    {/* Quantity */}
                    <div className="flex items-center">
                      <button
                        className="w-8 h-8 flex items-center justify-center bg-[#1a1a1a] border border-[#2a2a2a] text-[#888] hover:text-[#f5f5f5] hover:border-[#888] transition-colors"
                        onClick={() => updateQty(item.id, -1)}
                        disabled={item.cantidad <= 1}
                      >
                        <Minus size={12} strokeWidth={2} />
                      </button>
                      <span className="w-10 text-center text-sm font-[family-name:var(--font-heading)] text-[#f5f5f5]">
                        {item.cantidad}
                      </span>
                      <button
                        className="w-8 h-8 flex items-center justify-center bg-[#1a1a1a] border border-[#2a2a2a] text-[#888] hover:text-[#f5f5f5] hover:border-[#888] transition-colors"
                        onClick={() => updateQty(item.id, 1)}
                      >
                        <Plus size={12} strokeWidth={2} />
                      </button>
                    </div>

                    {/* Price */}
                    <div className="text-[#ffffff] font-semibold text-sm w-20 text-right font-[family-name:var(--font-heading)]">
                      ${(Number(item.precio_base) * item.cantidad).toFixed(2)}
                    </div>

                    {/* Remove */}
                    <button
                      className="text-[#555] hover:text-red-400 transition-colors bg-transparent border-none p-1"
                      onClick={() => removeItem(item.id)}
                      title="Eliminar"
                    >
                      <Trash2 size={16} strokeWidth={1.5} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Sidebar */}
            <div className="space-y-4 h-fit">
              {/* Coupon */}
              <div className="bg-[#141414] border border-[#2a2a2a] p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Tag size={14} strokeWidth={1.5} className="text-[#888]" />
                  <label className="text-[0.7rem] uppercase tracking-[1.5px] text-[#888] font-[family-name:var(--font-heading)]">
                    Cupón de Descuento
                  </label>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={cupon}
                    onChange={(e) => setCupon(e.target.value.toUpperCase())}
                    placeholder="CÓDIGO"
                    disabled={cuponValido}
                    className="flex-1 px-4 py-3 bg-[#1a1a1a] border border-[#2a2a2a] text-[#f5f5f5] text-sm focus:outline-none focus:border-[#888] uppercase tracking-wider placeholder:text-[#444]"
                  />
                  {!cuponValido ? (
                    <button
                      type="button"
                      onClick={validarCupon}
                      className="px-5 py-3 bg-[#ffffff] text-[#0a0a0a] text-[0.7rem] uppercase tracking-[2px] font-[family-name:var(--font-heading)] font-semibold transition-all hover:bg-[#d4d4d4] border-none cursor-pointer whitespace-nowrap"
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
                      className="px-5 py-3 bg-red-500/10 text-red-400 border border-red-500/20 text-[0.7rem] uppercase tracking-[2px] font-[family-name:var(--font-heading)] font-semibold transition-all hover:bg-red-500/20 border-solid cursor-pointer whitespace-nowrap"
                    >
                      Remover
                    </button>
                  )}
                </div>
                {cuponMsg && (
                  <p
                    className={`text-xs mt-3 ${cuponValido ? "text-green-400" : "text-red-400"}`}
                  >
                    {cuponMsg}
                  </p>
                )}
              </div>

              {/* Order Summary */}
              <div className="bg-[#141414] border border-[#2a2a2a] p-6">
                <h2 className="font-[family-name:var(--font-heading)] text-sm uppercase tracking-[2px] mb-6 text-[#f5f5f5]">
                  Resumen del Pedido
                </h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#888]">
                      Subtotal ({items.reduce((a, i) => a + i.cantidad, 0)}{" "}
                      items)
                    </span>
                    <span className="text-[#f5f5f5]">
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#888]">Envío</span>
                    <span
                      className={
                        envioGratis ? "text-green-400" : "text-[#f5f5f5]"
                      }
                    >
                      {envioGratis ? "Gratis" : `$${costoEnvio.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#888]">Impuestos (16%)</span>
                    <span className="text-[#f5f5f5]">
                      ${impuestos.toFixed(2)}
                    </span>
                  </div>
                  {descuento > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-green-400">Descuento</span>
                      <span className="text-green-400">
                        -${descuento.toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>

                <div className="h-px bg-[#2a2a2a] mb-6" />

                <div className="flex justify-between mb-6">
                  <span className="font-[family-name:var(--font-heading)] text-base font-semibold tracking-[-0.3px] text-[#f5f5f5]">
                    Total
                  </span>
                  <span className="font-[family-name:var(--font-heading)] text-xl font-semibold tracking-[-0.5px] text-[#ffffff]">
                    ${total.toFixed(2)}
                  </span>
                </div>

                <button
                  className="w-full bg-[#ffffff] text-[#0a0a0a] py-4 text-[0.75rem] uppercase tracking-[2px] font-[family-name:var(--font-heading)] font-semibold transition-all hover:bg-[#d4d4d4] mb-3 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                  onClick={handleCheckout}
                  disabled={checkoutLoading || items.length === 0}
                >
                  {checkoutLoading ? (
                    <span className="animate-pulse">Procesando...</span>
                  ) : (
                    <>
                      Finalizar Compra
                      <ArrowRight size={14} strokeWidth={2} />
                    </>
                  )}
                </button>

                {checkoutMsg && (
                  <p className="text-red-400 text-xs text-center mb-3 bg-red-500/5 border border-red-500/10 py-2">
                    {checkoutMsg}
                  </p>
                )}

                <Link
                  href="/productos"
                  className="block w-full text-center border border-[#2a2a2a] text-[#888] py-3 text-[0.7rem] uppercase tracking-[2px] font-[family-name:var(--font-heading)] transition-all hover:border-[#888] hover:text-[#f5f5f5]"
                >
                  Seguir Comprando
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
