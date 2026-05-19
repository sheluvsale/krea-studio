"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Search,
  Filter,
  ArrowLeft,
  MessageCircle,
  XCircle,
  Package,
  ChevronDown,
  ChevronUp,
  History,
  ShieldAlert,
} from "lucide-react";
import OrderChat from "../../../components/OrderChat";

interface Pedido {
  id: number;
  numero_pedido: string;
  total: number;
  estado: string;
  subtotal: number;
  creado_en: string;
}

const statusStyles: Record<string, string> = {
  entregado: "bg-green-500/10 text-green-400 border-green-500/20",
  enviado: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  procesando: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  cancelado: "bg-red-500/10 text-red-400 border-red-500/20",
  pendiente: "bg-krea-bg-tertiary text-krea-text-secondary border-krea-border",
};

export default function PedidosPage() {
  const router = useRouter();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("");
  const [expandido, setExpandido] = useState<number | null>(null);
  const [cancelando, setCancelando] = useState<number | null>(null);
  const [cancelError, setCancelError] = useState("");
  const [cancelSuccess, setCancelSuccess] = useState("");
  const [historialModal, setHistorialModal] = useState<{
    open: boolean;
    pedidoId: number;
    historial: Record<string, unknown>[];
  }>({ open: false, pedidoId: 0, historial: [] });
  const [devolucionesOpen, setDevolucionesOpen] = useState(false);

  const fetchPedidos = async () => {
    try {
      const params = new URLSearchParams();
      if (estadoFiltro) params.set("estado", estadoFiltro);
      if (busqueda.trim()) params.set("q", busqueda.trim());
      const res = await fetch(`/api/pedidos?${params.toString()}`);
      const data = await res.json();
      setPedidos(data.pedidos || []);
    } catch {
      setPedidos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPedidos();
  }, [estadoFiltro]);

  const handleBuscar = () => {
    setLoading(true);
    fetchPedidos();
  };

  const puedeCancelar = (pedido: Pedido) => {
    if (pedido.estado === "cancelado") return false;
    const creado = new Date(pedido.creado_en);
    const ahora = new Date();
    const diffMs = ahora.getTime() - creado.getTime();
    return diffMs <= 60 * 60 * 1000;
  };

  const cancelarPedido = async (pedidoId: number) => {
    setCancelando(pedidoId);
    setCancelError("");
    setCancelSuccess("");
    try {
      const res = await fetch("/api/pedidos/cancelar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pedido_id: pedidoId }),
      });
      const data = await res.json();
      if (res.ok) {
        setCancelSuccess("Pedido cancelado correctamente.");
        fetchPedidos();
      } else {
        setCancelError(data.error || "Error al cancelar.");
      }
    } catch {
      setCancelError("Error de conexión.");
    } finally {
      setCancelando(null);
    }
  };

  const verHistorial = async (pedidoId: number) => {
    const res = await fetch(`/api/pedidos/historial?pedido_id=${pedidoId}`);
    const data = await res.json();
    setHistorialModal({
      open: true,
      pedidoId,
      historial: data.historial || [],
    });
  };

  const formatPrice = (amount: number) => `$${Number(amount).toFixed(2)}`;

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("es-MX", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const estados = [
    "pendiente",
    "procesando",
    "enviado",
    "entregado",
    "cancelado",
  ];

  return (
    <div className="min-h-screen bg-krea-bg pt-32 pb-20 px-[5%]">
      <div className="max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 reveal">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="text-krea-text-secondary hover:text-krea-text transition-colors"
            >
              <ArrowLeft size={20} strokeWidth={1.5} />
            </Link>
            <div>
              <h1 className="font-[family-name:var(--font-heading)] text-2xl md:text-3xl font-semibold tracking-[-0.5px]">
                Mis Pedidos
              </h1>
              <p className="text-krea-text-secondary text-sm">
                {pedidos.length} {pedidos.length === 1 ? "pedido" : "pedidos"}{" "}
                registrados
              </p>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8 reveal">
          <div className="flex-1 flex gap-2">
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleBuscar()}
              placeholder="Buscar por número de pedido..."
              className="flex-1 px-4 py-3 bg-krea-bg-secondary border border-krea-border text-krea-text text-sm focus:outline-none focus:border-krea-text-secondary placeholder:text-krea-text-secondary/30"
            />
            <button
              onClick={handleBuscar}
              className="px-4 py-3 bg-krea-bg-secondary border border-krea-border text-krea-text-secondary hover:text-krea-text hover:border-krea-text-secondary transition-colors"
            >
              <Search size={18} strokeWidth={1.5} />
            </button>
          </div>
          <div className="relative">
            <select
              value={estadoFiltro}
              onChange={(e) => setEstadoFiltro(e.target.value)}
              className="appearance-none px-4 py-3 pr-10 bg-krea-bg-secondary border border-krea-border text-krea-text text-sm focus:outline-none focus:border-krea-text-secondary cursor-pointer"
            >
              <option value="">Todos los estados</option>
              {estados.map((e) => (
                <option key={e} value={e}>
                  {e.charAt(0).toUpperCase() + e.slice(1)}
                </option>
              ))}
            </select>
            <Filter
              size={14}
              strokeWidth={1.5}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-krea-text-secondary pointer-events-none"
            />
          </div>
        </div>

        {/* Mensajes */}
        {cancelSuccess && (
          <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 text-green-400 text-sm reveal">
            {cancelSuccess}
          </div>
        )}
        {cancelError && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm reveal">
            {cancelError}
          </div>
        )}

        {/* Lista */}
        {loading ? (
          <div className="space-y-3 reveal">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-krea-bg-secondary border border-krea-border h-16 animate-pulse"
              />
            ))}
          </div>
        ) : pedidos.length === 0 ? (
          <div className="bg-krea-bg-secondary border border-krea-border p-12 text-center reveal">
            <div className="w-14 h-14 bg-krea-bg-tertiary border border-krea-border flex items-center justify-center mx-auto mb-6">
              <Package
                size={24}
                strokeWidth={1.5}
                className="text-krea-text-secondary"
              />
            </div>
            <h3 className="font-[family-name:var(--font-heading)] text-xl mb-2">
              No tienes pedidos
            </h3>
            <p className="text-krea-text-secondary mb-6 max-w-sm mx-auto">
              Cuando realices tu primera compra, aparecerá aquí.
            </p>
            <Link
              href="/productos"
              className="inline-block bg-foreground text-background px-10 py-3.5 text-[0.75rem] uppercase tracking-[2px] font-[family-name:var(--font-heading)] font-semibold transition-all hover:bg-foreground/90"
            >
              Ver Productos
            </Link>
          </div>
        ) : (
          <div className="space-y-3 reveal">
            {pedidos.map((p) => {
              const exp = expandido === p.id;
              const cancelable = puedeCancelar(p);

              return (
                <div
                  key={p.id}
                  className="bg-krea-bg-secondary border border-krea-border hover:border-krea-text-secondary/30 transition-colors"
                >
                  <button
                    onClick={() => setExpandido(exp ? null : p.id)}
                    className="w-full text-left p-4 flex items-center gap-4 flex-wrap sm:flex-nowrap bg-transparent border-none cursor-pointer"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-[family-name:var(--font-heading)] text-sm font-medium">
                          #{p.numero_pedido}
                        </span>
                        <span
                          className={`inline-block text-[0.6rem] uppercase tracking-[1.5px] font-semibold px-2 py-0.5 border ${
                            statusStyles[p.estado] || statusStyles.pendiente
                          }`}
                        >
                          {p.estado?.charAt(0).toUpperCase() +
                            p.estado?.slice(1)}
                        </span>
                      </div>
                      <p className="text-krea-text-secondary text-xs">
                        {formatDate(p.creado_en)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-[family-name:var(--font-heading)] font-semibold text-sm">
                        {formatPrice(Number(p.total))}
                      </p>
                      <p className="text-krea-text-secondary text-[10px] uppercase tracking-[1.5px]">
                        {formatPrice(Number(p.subtotal))} sin envío
                      </p>
                    </div>
                    <div className="shrink-0">
                      {exp ? (
                        <ChevronUp
                          size={18}
                          strokeWidth={1.5}
                          className="text-krea-text-secondary"
                        />
                      ) : (
                        <ChevronDown
                          size={18}
                          strokeWidth={1.5}
                          className="text-krea-text-secondary"
                        />
                      )}
                    </div>
                  </button>

                  {exp && (
                    <div className="px-4 pb-4 border-t border-krea-border pt-4">
                      <div className="flex flex-wrap gap-2">
                        <OrderChat
                          pedidoId={p.id}
                          pedidoNumero={p.numero_pedido}
                          triggerLabel="Abrir Chat"
                        />
                        <button
                          onClick={() => verHistorial(p.id)}
                          className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[1.5px] font-[family-name:var(--font-heading)] font-medium text-krea-text-secondary hover:text-krea-accent transition-colors border border-krea-border hover:border-krea-accent px-3 py-1.5 bg-transparent cursor-pointer"
                        >
                          <History size={14} strokeWidth={1.5} />
                          Historial
                        </button>
                        {cancelable && (
                          <button
                            onClick={() => cancelarPedido(p.id)}
                            disabled={cancelando === p.id}
                            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[1.5px] font-[family-name:var(--font-heading)] font-medium text-red-400 hover:text-red-300 transition-colors border border-red-500/20 hover:border-red-400 px-3 py-1.5 bg-transparent cursor-pointer disabled:opacity-50"
                          >
                            <XCircle size={14} strokeWidth={1.5} />
                            {cancelando === p.id
                              ? "Cancelando..."
                              : "Cancelar Pedido"}
                          </button>
                        )}
                        <button
                          onClick={() => setDevolucionesOpen(true)}
                          className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[1.5px] font-[family-name:var(--font-heading)] font-medium text-yellow-500/70 hover:text-yellow-400 transition-colors border border-yellow-500/20 hover:border-yellow-400 px-3 py-1.5 bg-transparent cursor-pointer"
                        >
                          <ShieldAlert size={14} strokeWidth={1.5} />
                          Devoluciones
                        </button>
                      </div>
                      {!cancelable && p.estado !== "cancelado" && (
                        <p className="text-[10px] text-krea-text-secondary/50 mt-2 uppercase tracking-[1px]">
                          El periodo de cancelación (1 hora) ha expirado.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal Historial */}
      {historialModal.open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/70"
            onClick={() =>
              setHistorialModal({ open: false, pedidoId: 0, historial: [] })
            }
          />
          <div className="relative bg-krea-bg-secondary border border-krea-border p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto">
            <h3 className="font-[family-name:var(--font-heading)] text-lg mb-4">
              Historial de Cambios
            </h3>
            {historialModal.historial.length === 0 ? (
              <p className="text-krea-text-secondary text-sm">
                No hay cambios registrados.
              </p>
            ) : (
              <div className="space-y-3">
                {historialModal.historial.map((h) => (
                  <div
                    key={String(h.id)}
                    className="bg-krea-bg-tertiary border border-krea-border p-3"
                  >
                    <div className="flex items-center gap-2 text-xs mb-1">
                      <span className="text-krea-text-secondary">
                        {String(h.estado_anterior)}
                      </span>
                      <span>→</span>
                      <span className="text-krea-text font-medium">
                        {String(h.estado_nuevo)}
                      </span>
                      <span className="text-krea-text-secondary/50 ml-auto">
                        {h.creado_en
                          ? new Date(String(h.creado_en)).toLocaleString(
                              "es-MX",
                            )
                          : ""}
                      </span>
                    </div>
                    <p className="text-sm text-krea-text">
                      {String(h.justificacion)}
                    </p>
                    <p className="text-[10px] text-krea-text-secondary/50 mt-1 uppercase tracking-[1px]">
                      {String(h.origen || "")}
                    </p>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-4 text-right">
              <button
                onClick={() =>
                  setHistorialModal({ open: false, pedidoId: 0, historial: [] })
                }
                className="px-4 py-2 text-xs uppercase tracking-[1.5px] font-[family-name:var(--font-heading)] text-krea-text-secondary hover:text-krea-text bg-transparent border border-krea-border cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Devoluciones */}
      {devolucionesOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/70"
            onClick={() => setDevolucionesOpen(false)}
          />
          <div className="relative bg-krea-bg-secondary border border-krea-border p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto">
            <h3 className="font-[family-name:var(--font-heading)] text-lg mb-4">
              Política de Devoluciones
            </h3>
            <div className="text-sm space-y-4 text-krea-text-secondary leading-relaxed">
              <div className="bg-krea-bg-tertiary border border-krea-border p-4">
                <h4 className="text-krea-text font-medium mb-2">
                  Productos propios de la tienda
                </h4>
                <p>
                  Aplica devolución dentro de los 7 días posteriores a la
                  entrega, siempre que la prenda esté sin usar y con etiquetas
                  originales.
                </p>
              </div>
              <div className="bg-krea-bg-tertiary border border-krea-border p-4">
                <h4 className="text-krea-text font-medium mb-2">
                  Prendas personalizadas / prensa
                </h4>
                <p>
                  Si la prenda salió defectuosa, puedes reportarla para revisión
                  manual. No garantizamos reembolso automático — cada caso se
                  evalúa individualmente.
                </p>
              </div>
            </div>
            <div className="mt-4 text-right">
              <button
                onClick={() => setDevolucionesOpen(false)}
                className="px-4 py-2 text-xs uppercase tracking-[1.5px] font-[family-name:var(--font-heading)] text-krea-text-secondary hover:text-krea-text bg-transparent border border-krea-border cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
