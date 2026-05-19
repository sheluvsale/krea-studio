"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Truck, MapPin, FileText, ArrowLeft, Package, Tag } from "lucide-react";

interface CartItem {
  id: number;
  nombre: string;
  slug: string;
  precio_base: number;
  cantidad: number;
  talla: string;
  imagen: string;
}

export default function CheckoutCartPage() {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [msg, setMsg] = useState("");
  const [cupon, setCupon] = useState("");
  const [cuponValido, setCuponValido] = useState(false);
  const [descuento, setDescuento] = useState(0);
  const [cuponMsg, setCuponMsg] = useState("");

  const [direccion, setDireccion] = useState({
    nombre: "",
    telefono: "",
    calle: "",
    ciudad: "",
    codigoPostal: "",
  });
  const [notas, setNotas] = useState("");

  const ENVIO_GRATIS_MINIMO = 3000;
  const COSTO_ENVIO = 150;

  useEffect(() => {
    fetch("/api/cart")
      .then((r) => r.json())
      .then((d) => {
        setItems(d.items || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const subtotal = items.reduce((s, i) => s + Number(i.precio_base) * i.cantidad, 0);
  const envio = subtotal >= ENVIO_GRATIS_MINIMO ? 0 : COSTO_ENVIO;
  const impuestos = subtotal * 0.16;
  const total = subtotal + envio + impuestos - descuento;

  const validarCupon = async () => {
    if (!cupon.trim()) {
      setCuponMsg("Ingresa un código.");
      return;
    }
    try {
      const res = await fetch("/api/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ codigo: cupon, total: subtotal + envio + impuestos }),
      });
      const data = await res.json();
      if (res.ok) {
        setCuponValido(true);
        setDescuento(Number(data.descuento));
        setCuponMsg("Cupón aplicado.");
      } else {
        setCuponValido(false);
        setDescuento(0);
        setCuponMsg(data.error || "Cupón inválido.");
      }
    } catch {
      setCuponMsg("Error al validar cupón.");
    }
  };

  const handleCheckout = async () => {
    if (!direccion.nombre.trim() || !direccion.calle.trim() || !direccion.ciudad.trim()) {
      setMsg("Completa la dirección de envío.");
      return;
    }
    setProcessing(true);
    setMsg("");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ modo: "carrito", notas: notas.trim() || null }),
      });
      const data = await res.json();
      if (res.ok) {
        router.push(`/dashboard/pedidos?success=1&pedido=${data.numero_pedido}`);
      } else {
        setMsg(data.error || "Error al procesar.");
        setProcessing(false);
      }
    } catch {
      setMsg("Error de conexión.");
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] pt-[100px] pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1200px] mx-auto">
          <div className="h-8 w-48 bg-[#1a1a1a] animate-pulse mb-6" />
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-24 bg-[#141414] border border-[#2a2a2a] animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] pt-[100px] pb-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center mx-auto mb-6">
            <Package size={28} strokeWidth={1.5} className="text-[#888]" />
          </div>
          <h2 className="font-[family-name:var(--font-heading)] text-xl mb-2">Tu carrito está vacío</h2>
          <p className="text-[#888] mb-6">No hay productos para checkout.</p>
          <Link href="/productos" className="inline-block bg-[#ffffff] text-[#0a0a0a] px-8 py-3 text-[0.75rem] uppercase tracking-[2px] font-[family-name:var(--font-heading)] font-semibold hover:bg-[#d4d4d4]">
            Ver Productos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-[100px] pb-16">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="flex items-center gap-3 mb-8">
          <Link href="/cart" className="text-[#888] hover:text-[#f5f5f5] transition-colors">
            <ArrowLeft size={20} strokeWidth={1.5} />
          </Link>
          <h1 className="font-[family-name:var(--font-heading)] text-2xl md:text-3xl font-semibold tracking-[-1px]">
            Checkout
          </h1>
          <span className="text-[#888] text-sm">|</span>
          <span className="text-[#888] text-sm uppercase tracking-[2px]">
            {items.length} {items.length === 1 ? "producto" : "productos"}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8 lg:gap-12">
          {/* Left */}
          <div className="space-y-6">
            {/* Items */}
            <div className="bg-[#141414] border border-[#2a2a2a] p-5 sm:p-6 lg:p-8 space-y-4">
              <h2 className="font-[family-name:var(--font-heading)] text-sm uppercase tracking-[2px] text-[#888] mb-4">
                Productos
              </h2>
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 items-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 overflow-hidden bg-[#1a1a1a] border border-[#2a2a2a]">
                    <img
                      src={item.imagen || "/images/products/placeholder.jpg"}
                      alt={item.nombre}
                      className="w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).src = "/images/products/placeholder.jpg"; }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-[family-name:var(--font-heading)] text-sm truncate">{item.nombre}</h3>
                    <p className="text-[#888] text-xs">Cantidad: {item.cantidad} {item.talla ? `· Talla ${item.talla}` : ""}</p>
                  </div>
                  <div className="text-[#f5f5f5] font-semibold text-sm">
                    ${(Number(item.precio_base) * item.cantidad).toFixed(2)}
                  </div>
                </div>
              ))}
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
                <input type="text" placeholder="Nombre completo" value={direccion.nombre} onChange={(e) => setDireccion({ ...direccion, nombre: e.target.value })} className="px-4 py-3 bg-[#1a1a1a] border border-[#2a2a2a] text-[#f5f5f5] text-sm focus:outline-none focus:border-[#888] placeholder:text-[#555]" />
                <input type="text" placeholder="Teléfono" value={direccion.telefono} onChange={(e) => setDireccion({ ...direccion, telefono: e.target.value })} className="px-4 py-3 bg-[#1a1a1a] border border-[#2a2a2a] text-[#f5f5f5] text-sm focus:outline-none focus:border-[#888] placeholder:text-[#555]" />
                <input type="text" placeholder="Calle y número" value={direccion.calle} onChange={(e) => setDireccion({ ...direccion, calle: e.target.value })} className="px-4 py-3 bg-[#1a1a1a] border border-[#2a2a2a] text-[#f5f5f5] text-sm focus:outline-none focus:border-[#888] placeholder:text-[#555] sm:col-span-2" />
                <input type="text" placeholder="Ciudad" value={direccion.ciudad} onChange={(e) => setDireccion({ ...direccion, ciudad: e.target.value })} className="px-4 py-3 bg-[#1a1a1a] border border-[#2a2a2a] text-[#f5f5f5] text-sm focus:outline-none focus:border-[#888] placeholder:text-[#555]" />
                <input type="text" placeholder="Código Postal" value={direccion.codigoPostal} onChange={(e) => setDireccion({ ...direccion, codigoPostal: e.target.value })} className="px-4 py-3 bg-[#1a1a1a] border border-[#2a2a2a] text-[#f5f5f5] text-sm focus:outline-none focus:border-[#888] placeholder:text-[#555]" />
              </div>
            </div>

            {/* Notas */}
            <div className="bg-[#141414] border border-[#2a2a2a] p-5 sm:p-6 lg:p-8">
              <div className="flex items-center gap-2 mb-3">
                <FileText size={14} strokeWidth={1.5} className="text-[#888]" />
                <label className="text-xs uppercase tracking-[1.5px] text-[#888] font-[family-name:var(--font-heading)]">Notas del Pedido</label>
              </div>
              <textarea value={notas} onChange={(e) => setNotas(e.target.value)} placeholder="Instrucciones especiales..." rows={3} className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#2a2a2a] text-[#f5f5f5] text-sm focus:outline-none focus:border-[#888] resize-none placeholder:text-[#555]" />
            </div>

            {/* Cupón */}
            <div className="bg-[#141414] border border-[#2a2a2a] p-5 sm:p-6 lg:p-8">
              <div className="flex items-center gap-2 mb-4">
                <Tag size={14} strokeWidth={1.5} className="text-[#888]" />
                <label className="text-xs uppercase tracking-[1.5px] text-[#888] font-[family-name:var(--font-heading)]">Cupón de Descuento</label>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <input type="text" value={cupon} onChange={(e) => setCupon(e.target.value.toUpperCase())} placeholder="CÓDIGO" disabled={cuponValido} className="flex-1 px-4 py-3 bg-[#1a1a1a] border border-[#2a2a2a] text-[#f5f5f5] text-sm focus:outline-none focus:border-[#888] uppercase placeholder:text-[#555]" />
                {!cuponValido ? (
                  <button onClick={validarCupon} className="px-6 py-3 bg-[#ffffff] text-[#0a0a0a] text-[0.75rem] uppercase tracking-[2px] font-[family-name:var(--font-heading)] font-semibold hover:bg-[#d4d4d4] cursor-pointer whitespace-nowrap">Aplicar</button>
                ) : (
                  <button onClick={() => { setCupon(""); setCuponValido(false); setDescuento(0); setCuponMsg(""); }} className="px-6 py-3 bg-red-500/10 text-red-400 border border-red-500/20 text-[0.75rem] uppercase tracking-[2px] font-[family-name:var(--font-heading)] font-semibold hover:bg-red-500/20 cursor-pointer whitespace-nowrap">Remover</button>
                )}
              </div>
              {cuponMsg && <p className={`text-xs mt-3 ${cuponValido ? "text-green-400" : "text-red-400"}`}>{cuponMsg}</p>}
            </div>
          </div>

          {/* Sidebar */}
          <div className="bg-[#141414] border border-[#2a2a2a] p-5 sm:p-6 lg:p-8 h-fit lg:sticky lg:top-24">
            <h2 className="font-[family-name:var(--font-heading)] text-lg uppercase tracking-[2px] mb-6 pb-4 border-b border-[#2a2a2a]">Resumen</h2>
            <div className="flex justify-between text-sm mb-3">
              <span className="text-[#888]">Subtotal ({items.reduce((a, i) => a + i.cantidad, 0)} items)</span>
              <span className="text-[#f5f5f5]">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm mb-3">
              <span className="text-[#888]">Envío</span>
              <span className={envio === 0 ? "text-green-400" : "text-[#f5f5f5]"}>{envio === 0 ? "Gratis" : `$${envio.toFixed(2)}`}</span>
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
            {msg && (
              <div className="bg-[#2a1a1a] border border-red-900/40 text-red-300 text-sm px-4 py-3 mb-4">{msg}</div>
            )}
            <button onClick={handleCheckout} disabled={processing} className="w-full bg-[#ffffff] text-[#0a0a0a] py-4 text-[0.75rem] uppercase tracking-[2px] font-[family-name:var(--font-heading)] font-semibold hover:bg-[#d4d4d4] disabled:opacity-50 mb-4 cursor-pointer">
              {processing ? "Procesando..." : "Finalizar Compra"}
            </button>
            <Link href="/cart" className="block w-full text-center border border-[#888] text-[#888] py-3 text-[0.75rem] uppercase tracking-[2px] font-[family-name:var(--font-heading)] hover:border-white hover:text-white">
              Volver al Carrito
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
