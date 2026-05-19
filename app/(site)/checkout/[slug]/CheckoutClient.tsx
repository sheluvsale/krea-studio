"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Truck,
  MapPin,
  CreditCard,
  FileText,
  AlertTriangle,
} from "lucide-react";

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
  const router = useRouter();
  const [cantidad, setCantidad] = useState(1);
  const [selectedTalla, setSelectedTalla] = useState("");
  const [paymentMsg, setPaymentMsg] = useState("");
  const [processing, setProcessing] = useState(false);
  const [cupon, setCupon] = useState("");
  const [cuponValido, setCuponValido] = useState(false);
  const [descuento, setDescuento] = useState(0);
  const [cuponMsg, setCuponMsg] = useState("");

  // Dirección simulada (en producción vendría de direcciones guardadas)
  const [direccion, setDireccion] = useState({
    nombre: "",
    telefono: "",
    calle: "",
    ciudad: "",
    codigoPostal: "",
  });
  const [notas, setNotas] = useState("");

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
    } catch {
      setCuponValido(false);
      setDescuento(0);
      setCuponMsg("Error al validar cupón.");
    }
  };

  const handleCheckout = async () => {
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
    if (
      !direccion.nombre.trim() ||
      !direccion.calle.trim() ||
      !direccion.ciudad.trim()
    ) {
      setPaymentMsg("Completa la dirección de envío.");
      return;
    }

    setProcessing(true);
    setPaymentMsg("");

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          modo: "directo",
          producto_id: producto.id,
          cantidad,
          talla: selectedTalla || null,
          direccion_id: null,
          notas: notas.trim() || null,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        router.push(
          `/dashboard/pedidos?success=1&pedido=${data.numero_pedido}`,
        );
      } else {
        setPaymentMsg(data.error || "Error al procesar el pedido.");
        setProcessing(false);
      }
    } catch {
      setPaymentMsg("Error de conexión. Inténtalo de nuevo.");
      setProcessing(false);
    }
  };

  const formatAddress = () => {
    const parts = [
      direccion.calle,
      direccion.ciudad,
      direccion.codigoPostal,
    ].filter(Boolean);
    return parts.join(", ");
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
          {/* Left Column */}
          <div className="space-y-6">
            {/* Product */}
            <div className="bg-[#141414] border border-[#2a2a2a] p-5 sm:p-6 lg:p-8">
              <div className="flex gap-4 sm:gap-6">
                <div className="w-20 h-20 sm:w-28 sm:h-28 lg:w-32 lg:h-32 flex-shrink-0 overflow-hidden bg-[#1a1a1a]">
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
                <div className="flex-1 min-w-0">
                  <h2 className="font-[family-name:var(--font-heading)] text-base sm:text-lg mb-1 truncate">
                    {producto.nombre}
                  </h2>
                  <p className="text-[#888] text-xs sm:text-sm mb-2">
                    {producto.categoria_nombre || ""}{" "}
                    {selectedTalla ? `· Talla ${selectedTalla}` : ""}
                  </p>
                  <div className="text-[#ffffff] font-semibold text-sm sm:text-base">
                    ${Number(producto.precio_base).toFixed(2)} × {cantidad}
                  </div>
                </div>
              </div>
            </div>

            {/* Talla */}
            {tallas.length > 0 && (
              <div className="bg-[#141414] border border-[#2a2a2a] p-5 sm:p-6 lg:p-8">
                <label className="block text-xs uppercase tracking-[1.5px] text-[#888] font-[family-name:var(--font-heading)] mb-4">
                  Selecciona tu talla
                </label>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {tallas.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setSelectedTalla(t)}
                      className={`min-w-[48px] sm:min-w-[56px] h-12 sm:h-14 px-3 sm:px-4 border bg-[#1a1a1a] text-[#f5f5f5] font-[family-name:var(--font-heading)] text-sm transition-all hover:border-[#888] ${
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
            <div className="bg-[#141414] border border-[#2a2a2a] p-5 sm:p-6 lg:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
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
                  className="w-10 h-10 bg-transparent border-none text-[#f5f5f5] text-lg hover:bg-[#1a1a1a] transition-colors cursor-pointer"
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
                  className="w-10 h-10 bg-transparent border-none text-[#f5f5f5] text-lg hover:bg-[#1a1a1a] transition-colors cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>

            {/* Dirección */}
            <div className="bg-[#141414] border border-[#2a2a2a] p-5 sm:p-6 lg:p-8">
              <div className="flex items-center gap-2 mb-4">
                <MapPin size={14} strokeWidth={1.5} className="text-[#888]" />
                <label className="text-xs uppercase tracking-[1.5px] text-[#888] font-[family-name:var(--font-heading)]">
                  Dirección de Envío
                </label>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Nombre completo"
                  value={direccion.nombre}
                  onChange={(e) =>
                    setDireccion({ ...direccion, nombre: e.target.value })
                  }
                  className="px-4 py-3 bg-[#1a1a1a] border border-[#2a2a2a] text-[#f5f5f5] text-sm focus:outline-none focus:border-[#888] placeholder:text-[#555]"
                />
                <input
                  type="text"
                  placeholder="Teléfono"
                  value={direccion.telefono}
                  onChange={(e) =>
                    setDireccion({ ...direccion, telefono: e.target.value })
                  }
                  className="px-4 py-3 bg-[#1a1a1a] border border-[#2a2a2a] text-[#f5f5f5] text-sm focus:outline-none focus:border-[#888] placeholder:text-[#555]"
                />
                <input
                  type="text"
                  placeholder="Calle y número"
                  value={direccion.calle}
                  onChange={(e) =>
                    setDireccion({ ...direccion, calle: e.target.value })
                  }
                  className="px-4 py-3 bg-[#1a1a1a] border border-[#2a2a2a] text-[#f5f5f5] text-sm focus:outline-none focus:border-[#888] placeholder:text-[#555] sm:col-span-2"
                />
                <input
                  type="text"
                  placeholder="Ciudad"
                  value={direccion.ciudad}
                  onChange={(e) =>
                    setDireccion({ ...direccion, ciudad: e.target.value })
                  }
                  className="px-4 py-3 bg-[#1a1a1a] border border-[#2a2a2a] text-[#f5f5f5] text-sm focus:outline-none focus:border-[#888] placeholder:text-[#555]"
                />
                <input
                  type="text"
                  placeholder="Código Postal"
                  value={direccion.codigoPostal}
                  onChange={(e) =>
                    setDireccion({ ...direccion, codigoPostal: e.target.value })
                  }
                  className="px-4 py-3 bg-[#1a1a1a] border border-[#2a2a2a] text-[#f5f5f5] text-sm focus:outline-none focus:border-[#888] placeholder:text-[#555]"
                />
              </div>
            </div>

            {/* Notas */}
            <div className="bg-[#141414] border border-[#2a2a2a] p-5 sm:p-6 lg:p-8">
              <div className="flex items-center gap-2 mb-3">
                <FileText size={14} strokeWidth={1.5} className="text-[#888]" />
                <label className="text-xs uppercase tracking-[1.5px] text-[#888] font-[family-name:var(--font-heading)]">
                  Notas del Pedido
                </label>
              </div>
              <textarea
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
                placeholder="Instrucciones especiales, referencias de entrega, etc."
                rows={3}
                className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#2a2a2a] text-[#f5f5f5] text-sm focus:outline-none focus:border-[#888] resize-none placeholder:text-[#555]"
              />
            </div>

            {/* Cupón */}
            <div className="bg-[#141414] border border-[#2a2a2a] p-5 sm:p-6 lg:p-8">
              <label className="block text-xs uppercase tracking-[1.5px] text-[#888] font-[family-name:var(--font-heading)] mb-4">
                Cupón de Descuento
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={cupon}
                  onChange={(e) => setCupon(e.target.value.toUpperCase())}
                  placeholder="CÓDIGO"
                  disabled={cuponValido}
                  className="flex-1 px-4 py-3 bg-[#1a1a1a] border border-[#2a2a2a] text-[#f5f5f5] text-sm focus:outline-none focus:border-[#888] uppercase tracking-wider placeholder:text-[#555]"
                />
                {!cuponValido ? (
                  <button
                    type="button"
                    onClick={validarCupon}
                    className="px-6 py-3 bg-[#ffffff] text-[#0a0a0a] text-[0.75rem] uppercase tracking-[2px] font-[family-name:var(--font-heading)] font-semibold transition-all hover:bg-[#d4d4d4] border-none cursor-pointer whitespace-nowrap"
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
                    className="px-6 py-3 bg-red-500/10 text-red-400 border border-red-500/20 text-[0.75rem] uppercase tracking-[2px] font-[family-name:var(--font-heading)] font-semibold transition-all hover:bg-red-500/20 border-solid cursor-pointer whitespace-nowrap"
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

            {/* Política de devoluciones */}
            <div className="bg-[#141414] border border-[#2a2a2a] p-5 sm:p-6 lg:p-8">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle
                  size={14}
                  strokeWidth={1.5}
                  className="text-yellow-500/70"
                />
                <h3 className="text-xs uppercase tracking-[1.5px] text-[#888] font-[family-name:var(--font-heading)]">
                  Política de Devoluciones
                </h3>
              </div>
              <div className="text-[#888] text-sm space-y-2 leading-relaxed">
                <p>
                  <strong className="text-[#f5f5f5]">
                    Productos propios de la tienda:
                  </strong>{" "}
                  Aplica devolución dentro de los 7 días posteriores a la
                  entrega, siempre que la prenda esté sin usar y con etiquetas
                  originales.
                </p>
                <p>
                  <strong className="text-[#f5f5f5]">
                    Prendas personalizadas / prensa:
                  </strong>{" "}
                  Si la prenda salió defectuosa, puedes reportarla para revisión
                  manual. No garantizamos reembolso automático — cada caso se
                  evalúa individualmente.
                </p>
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="bg-[#141414] border border-[#2a2a2a] p-5 sm:p-6 lg:p-8 h-fit lg:sticky lg:top-24">
            <h2 className="font-[family-name:var(--font-heading)] text-lg uppercase tracking-[2px] mb-6 pb-4 border-b border-[#2a2a2a]">
              Resumen del Pedido
            </h2>

            <div className="flex justify-between text-sm mb-3">
              <span className="text-[#888]">Subtotal</span>
              <span className="text-[#f5f5f5]">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm mb-3">
              <span className="text-[#888]">Envío</span>
              <span
                className={envio === 0 ? "text-green-400" : "text-[#f5f5f5]"}
              >
                {envio === 0 ? "Gratis" : `$${envio.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between text-sm mb-3">
              <span className="text-[#888]">Impuestos (16%)</span>
              <span className="text-[#f5f5f5]">${impuestos.toFixed(2)}</span>
            </div>
            {descuento > 0 && (
              <div className="flex justify-between text-sm mb-3">
                <span className="text-green-400">Descuento</span>
                <span className="text-green-400">-${descuento.toFixed(2)}</span>
              </div>
            )}

            {envio === 0 && (
              <div className="flex items-center gap-2 text-green-400 text-xs mb-4 bg-green-500/5 border border-green-500/10 p-2">
                <Truck size={14} strokeWidth={1.5} />
                <span>¡Envío gratis aplicado!</span>
              </div>
            )}

            <div className="flex justify-between text-lg font-semibold border-t border-[#2a2a2a] pt-4 mb-6">
              <span className="text-[#f5f5f5]">Total</span>
              <span className="text-[#ffffff]">${total.toFixed(2)}</span>
            </div>

            {formatAddress() && (
              <div className="mb-4 text-xs text-[#888]">
                <p className="uppercase tracking-[1px] mb-1">Enviar a:</p>
                <p className="text-[#ccc]">{direccion.nombre || "—"}</p>
                <p>{formatAddress()}</p>
              </div>
            )}

            {paymentMsg && (
              <div className="bg-[#2a1a1a] border border-red-900/40 text-red-300 text-sm px-4 py-3 mb-4">
                {paymentMsg}
              </div>
            )}

            <button
              type="button"
              onClick={handleCheckout}
              disabled={processing}
              className="w-full bg-[#ffffff] text-[#0a0a0a] py-4 text-[0.75rem] uppercase tracking-[2px] font-[family-name:var(--font-heading)] font-semibold transition-all hover:bg-[#d4d4d4] disabled:opacity-50 mb-4 cursor-pointer"
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
