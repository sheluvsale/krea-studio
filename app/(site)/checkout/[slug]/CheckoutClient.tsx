"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

interface Producto {
  id: number;
  nombre: string;
  slug: string;
  descripcion: string;
  precio_base: number;
  precio_comparacion: number;
  categoria_nombre: string;
  marca_nombre: string;
  sku: string;
  peso: number;
}

interface Variante {
  id: number;
  atributos: string;
  stock: number;
}

interface Props {
  producto: Producto;
  variantes: Variante[];
  isLoggedIn: boolean;
  userRol: string;
}

export default function CheckoutClient({
  producto,
  variantes,
  isLoggedIn,
  userRol,
}: Props) {
  const [cantidad, setCantidad] = useState(1);
  const [selectedTalla, setSelectedTalla] = useState("");
  const [paymentMsg, setPaymentMsg] = useState("");
  const [processing, setProcessing] = useState(false);
  const [cupon, setCupon] = useState("");
  const [cuponValido, setCuponValido] = useState(false);
  const [descuento, setDescuento] = useState(0);
  const [cuponMsg, setCuponMsg] = useState("");

  const tallas: string[] = [];
  variantes.forEach((v) => {
    if (v.atributos) {
      v.atributos.split(",").forEach((attr) => {
        if (
          "XS,S,M,L,XL,XXL".split(",").includes(attr) &&
          !tallas.includes(attr)
        ) {
          tallas.push(attr);
        }
      });
    }
  });

  const subtotal = Number(producto.precio_base) * cantidad;
  const envio = subtotal >= 3000 ? 0 : 150;
  const impuestos = subtotal * 0.16;
  const total = subtotal + envio + impuestos - descuento;

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
          total: subtotal + envio + impuestos,
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

  const handleCheckout = () => {
    if (!isLoggedIn) {
      setPaymentMsg("Debes iniciar sesión para continuar.");
      return;
    }
    if (userRol === "admin") {
      setPaymentMsg("Los administradores no pueden realizar compras.");
      return;
    }
    if (tallas.length > 0 && !selectedTalla) {
      setPaymentMsg("Selecciona una talla.");
      return;
    }
    setProcessing(true);
    setPaymentMsg("");
    setTimeout(() => {
      setProcessing(false);
      setPaymentMsg("Método de pago aún no disponible");
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-[100px] pb-16">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="flex items-center gap-3 mb-8">
          <h1 className="font-[family-name:var(--font-heading)] text-2xl md:text-3xl font-semibold tracking-[-1px]">
            Checkout
          </h1>
          <span className="text-[#888] text-sm">|</span>
          <span className="text-[#888] text-sm uppercase tracking-[2px]">
            Finaliza tu compra
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8 lg:gap-12">
          {/* Product Summary */}
          <div className="space-y-6">
            <div className="bg-[#141414] border border-[#2a2a2a] p-6 lg:p-8 flex gap-6">
              <div className="w-28 h-28 lg:w-32 lg:h-32 flex-shrink-0 overflow-hidden bg-[#1a1a1a]">
                <Image
                  src={`/images/products/${producto.slug}.jpg`}
                  alt={producto.nombre}
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.opacity = "0";
                  }}
                />
              </div>
              <div>
                <h2 className="font-[family-name:var(--font-heading)] text-lg mb-1">
                  {producto.nombre}
                </h2>
                <p className="text-[#888] text-sm mb-2">
                  {producto.categoria_nombre || ""}
                </p>
                <div className="text-[#ffffff] font-semibold">
                  ${Number(producto.precio_base).toFixed(2)}
                </div>
              </div>
            </div>

            {/* Cupón */}
            <div className="bg-[#141414] border border-[#2a2a2a] p-6 lg:p-8">
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

            {/* Talla */}
            {tallas.length > 0 && (
              <div className="bg-[#141414] border border-[#2a2a2a] p-6 lg:p-8">
                <label className="block text-xs uppercase tracking-[1.5px] text-[#888] font-[family-name:var(--font-heading)] mb-4">
                  Selecciona tu talla
                </label>
                <div className="flex flex-wrap gap-3">
                  {tallas.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setSelectedTalla(t)}
                      className={`min-w-[56px] h-14 px-4 border bg-[#1a1a1a] text-[#f5f5f5] font-[family-name:var(--font-heading)] text-sm transition-all hover:border-[#888] ${
                        selectedTalla === t
                          ? "border-[#ffffff] text-[#ffffff] bg-[#2a2a2a]"
                          : "border-[#2a2a2a]"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                {tallas.length > 0 && !selectedTalla && (
                  <p className="text-[#888] text-xs mt-3">
                    Selecciona una talla para continuar
                  </p>
                )}
              </div>
            )}

            {/* Cantidad */}
            <div className="bg-[#141414] border border-[#2a2a2a] p-6 lg:p-8 flex items-center justify-between">
              <div>
                <label className="text-xs uppercase tracking-[1.5px] text-[#888] font-[family-name:var(--font-heading)] block mb-1">
                  Cantidad
                </label>
                <p className="text-[#666] text-xs">
                  Máximo 10 unidades por producto
                </p>
              </div>
              <div className="flex items-center border border-[#2a2a2a]">
                <button
                  type="button"
                  onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                  className="w-10 h-10 bg-transparent border-none text-[#f5f5f5] text-lg hover:bg-[#1a1a1a] transition-colors"
                >
                  −
                </button>
                <input
                  type="number"
                  value={cantidad}
                  readOnly
                  className="w-12 h-10 bg-transparent border-none text-center text-[#f5f5f5] font-[family-name:var(--font-heading)] [appearance:none]"
                />
                <button
                  type="button"
                  onClick={() => setCantidad(Math.min(10, cantidad + 1))}
                  className="w-10 h-10 bg-transparent border-none text-[#f5f5f5] text-lg hover:bg-[#1a1a1a] transition-colors"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-[#141414] border border-[#2a2a2a] p-6 lg:p-8 h-fit lg:sticky lg:top-24">
            <h2 className="font-[family-name:var(--font-heading)] text-lg uppercase tracking-[2px] mb-6 pb-4 border-b border-[#2a2a2a]">
              Resumen del Pedido
            </h2>
            <div className="flex justify-between text-sm mb-3">
              <span className="text-[#888]">Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm mb-3">
              <span className="text-[#888]">Envío</span>
              <span>{envio === 0 ? "Gratis" : `$${envio.toFixed(2)}`}</span>
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

            {paymentMsg && (
              <div className="bg-[#2a1a1a] border border-red-900/40 text-red-300 text-sm px-4 py-3 mb-4">
                {paymentMsg}
              </div>
            )}

            <button
              type="button"
              onClick={handleCheckout}
              disabled={processing}
              className="w-full bg-[#ffffff] text-[#0a0a0a] py-4 text-[0.75rem] uppercase tracking-[2px] font-[family-name:var(--font-heading)] font-semibold transition-all hover:bg-[#d4d4d4] disabled:opacity-50 mb-4"
            >
              {processing ? "Procesando..." : "Finalizar Compra"}
            </button>

            <Link
              href={`/producto/${producto.slug}`}
              className="block w-full text-center border border-[#888] text-[#888] py-3 text-[0.75rem] uppercase tracking-[2px] font-[family-name:var(--font-heading)] transition-all hover:border-white hover:text-white"
            >
              Volver al Producto
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
