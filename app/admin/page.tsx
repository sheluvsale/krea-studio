"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Mail,
  Tags,
  Ticket,
  Star,
  Store,
  Palette,
  LogOut,
  Menu,
  Search,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  ArrowUpRight,
} from "lucide-react";
import MobileWarning from "@/components/MobileWarning";
import OrderChat from "../../components/OrderChat";

interface AdminData {
  nombre: string;
  rol: string;
  totalProductos: number;
  totalPedidos: number;
  totalUsuarios: number;
  ingresosTotales: number;
  pedidosRecientes: {
    id: number;
    numero_pedido: string;
    total: number;
    estado: string;
    creado_en: string;
    nombre: string;
    apellido: string;
  }[];
  stockBajo: { nombre: string; stock: number }[];
  productosTop: {
    nombre: string;
    total_vendido: number;
    total_ingresos: number;
  }[];
  pedidosPorEstado: { estado: string; cantidad: number }[];
  ventasMensuales: {
    mes_label: string;
    total_pedidos: number;
    total_ventas: number;
  }[];
  tendencias?: {
    productos: string;
    pedidos: string;
    usuarios: string;
    ingresos: string;
  };
}

type TabKey =
  | "resumen"
  | "productos"
  | "pedidos"
  | "usuarios"
  | "contactos"
  | "categorias"
  | "cupones"
  | "resenas";

const navItems: { key: TabKey; label: string; icon: React.ElementType }[] = [
  { key: "resumen", label: "Resumen", icon: LayoutDashboard },
  { key: "productos", label: "Productos", icon: Package },
  { key: "pedidos", label: "Pedidos", icon: ShoppingCart },
  { key: "usuarios", label: "Usuarios", icon: Users },
  { key: "contactos", label: "Contactos", icon: Mail },
  { key: "categorias", label: "Categorías", icon: Tags },
  { key: "cupones", label: "Cupones", icon: Ticket },
  { key: "resenas", label: "Reseñas", icon: Star },
];

const statusColors: Record<string, string> = {
  pendiente: "#f59e0b",
  procesando: "#3b82f6",
  enviado: "#8b5cf6",
  entregado: "#22c55e",
  cancelado: "#ef4444",
};

export default function AdminDashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<TabKey>("resumen");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    document.documentElement.classList.add("no-custom-cursor");
    return () => {
      document.documentElement.classList.remove("no-custom-cursor");
    };
  }, []);

  useEffect(() => {
    fetch("/api/admin/dashboard")
      .then((r) => {
        if (r.status === 401) {
          router.push("/login");
          return null;
        }
        return r.json();
      })
      .then((d) => {
        if (d && !d.error) setData(d);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [router]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-[#1f1f1f] border-t-white rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#888] text-sm tracking-wide">
            Cargando panel de administración...
          </p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const maxVentas = Math.max(
    ...data.ventasMensuales.map((v) => Number(v.total_ventas) || 0),
    1,
  );

  return (
    <>
      <MobileWarning />
      <div className="min-h-screen bg-[#080808] text-[#e5e5e5] flex">
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/60 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed lg:static inset-y-0 left-0 z-50 w-[260px] bg-[#0c0c0c] border-r border-[#1f1f1f] flex flex-col transition-transform duration-300 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
        >
          {/* Logo */}
          <div className="h-16 flex items-center px-6 border-b border-[#1f1f1f]">
            <Link href="/" className="hover:opacity-80 transition-opacity">
              <Image
                src="/images/logo/Krea-blanco-sinfondo.png"
                alt="Krea"
                width={100}
                height={36}
                className="h-11 w-auto"
                priority
              />
            </Link>
          </div>

          {/* Nav */}
          <nav className="flex-1 py-4 px-3 overflow-y-auto">
            <p className="px-3 text-[10px] uppercase tracking-[2px] text-[#555] font-semibold mb-2">
              Principal
            </p>
            <ul className="flex flex-col gap-1 mb-6">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = tab === item.key;
                return (
                  <li key={item.key}>
                    <button
                      onClick={() => {
                        setTab(item.key);
                        setSidebarOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-all border-none cursor-pointer font-medium ${
                        active
                          ? "bg-[#1a1a1a] text-white"
                          : "text-[#888] hover:text-white hover:bg-[#111]"
                      }`}
                    >
                      {React.createElement(Icon, {
                        size: 18,
                        strokeWidth: 1.5,
                      })}
                      {item.label}
                    </button>
                  </li>
                );
              })}
            </ul>

            <p className="px-3 text-[10px] uppercase tracking-[2px] text-[#555] font-semibold mb-2">
              Enlaces
            </p>
            <ul className="flex flex-col gap-1">
              <li>
                <Link
                  href="/designer"
                  target="_blank"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-[#888] hover:text-white hover:bg-[#111] transition-all"
                >
                  <Palette size={18} strokeWidth={1.5} />
                  Crear Ropa
                </Link>
              </li>
              <li>
                <Link
                  href="/productos"
                  target="_blank"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-[#888] hover:text-white hover:bg-[#111] transition-all"
                >
                  <Store size={18} strokeWidth={1.5} />
                  Ver Tienda
                </Link>
              </li>
            </ul>
          </nav>

          {/* User */}
          <div className="p-4 border-t border-[#1f1f1f]">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-full bg-[#1f1f1f] flex items-center justify-center text-xs font-bold text-white">
                {data.nombre?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{data.nombre}</p>
                <p className="text-xs text-[#666] capitalize">{data.rol}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-md text-xs text-[#888] hover:text-red-400 hover:bg-[#1a1a1a] transition-all border-none cursor-pointer bg-transparent"
            >
              <LogOut size={14} strokeWidth={1.5} />
              Cerrar Sesión
            </button>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 flex flex-col min-w-0">
          {/* Top bar */}
          <header className="h-16 flex items-center justify-between px-6 border-b border-[#1f1f1f] bg-[#0c0c0c]/80 backdrop-blur-md sticky top-0 z-30">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 -ml-2 text-[#888] hover:text-white bg-transparent border-none cursor-pointer"
              >
                <Menu size={20} />
              </button>
              <h1 className="font-[family-name:var(--font-heading)] text-lg font-semibold tracking-[-0.5px]">
                {navItems.find((n) => n.key === tab)?.label}
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666]"
                />
                <input
                  type="text"
                  placeholder="Buscar..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="pl-10 pr-10 py-2 bg-[#1a1a1a] border border-[#1f1f1f] text-[#f5f5f5] text-sm rounded-lg focus:outline-none focus:border-[#888] w-48 sm:w-64 cursor-text"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666] hover:text-white bg-transparent border-none cursor-pointer"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {tab === "resumen" && (
              <div className="space-y-6">
                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                  <StatCard
                    icon={Package}
                    label="Productos"
                    value={data.totalProductos}
                    color="#3b82f6"
                    trend={data.tendencias?.productos || "0%"}
                  />
                  <StatCard
                    icon={ShoppingCart}
                    label="Pedidos"
                    value={data.totalPedidos}
                    color="#22c55e"
                    trend={data.tendencias?.pedidos || "0%"}
                  />
                  <StatCard
                    icon={Users}
                    label="Clientes"
                    value={data.totalUsuarios}
                    color="#8b5cf6"
                    trend={data.tendencias?.usuarios || "0%"}
                  />
                  <StatCard
                    icon={DollarSign}
                    label="Ingresos"
                    value={`$${Number(data.ingresosTotales || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                    color="#f59e0b"
                    trend={data.tendencias?.ingresos || "0%"}
                  />
                </div>

                {/* Charts row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Ventas chart */}
                  {data.ventasMensuales.length > 0 && (
                    <div className="lg:col-span-2 bg-[#0f0f0f] border border-[#1f1f1f] rounded-xl p-6">
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h3 className="font-[family-name:var(--font-heading)] text-sm font-semibold">
                            Ventas Mensuales
                          </h3>
                          <p className="text-xs text-[#666] mt-0.5">
                            Últimos 6 meses
                          </p>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-[#22c55e] bg-[#22c55e]/10 px-2.5 py-1 rounded-full">
                          <TrendingUp size={14} />
                          <span>+12.5%</span>
                        </div>
                      </div>
                      <div className="flex items-end gap-3 h-[180px]">
                        {data.ventasMensuales.map((v, i) => {
                          const pct = Math.max(
                            8,
                            (Number(v.total_ventas || 0) / maxVentas) * 100,
                          );
                          return (
                            <div
                              key={i}
                              className="flex-1 flex flex-col items-center gap-2 group"
                            >
                              <div className="relative w-full flex justify-center">
                                <div
                                  className="w-full max-w-[40px] rounded-t bg-[#3b82f6]/80 group-hover:bg-[#3b82f6] transition-all relative"
                                  style={{ height: `${pct}%` }}
                                >
                                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#1a1a1a] border border-[#1f1f1f] text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                    ${Number(v.total_ventas || 0).toFixed(0)}
                                  </div>
                                </div>
                              </div>
                              <span className="text-[10px] text-[#666] uppercase tracking-wide">
                                {v.mes_label?.slice(0, 3)}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Pedidos por estado */}
                  <div className="bg-[#0f0f0f] border border-[#1f1f1f] rounded-xl p-6">
                    <h3 className="font-[family-name:var(--font-heading)] text-sm font-semibold mb-5">
                      Pedidos por Estado
                    </h3>
                    {data.pedidosPorEstado.length > 0 ? (
                      <div className="flex flex-col gap-4">
                        {data.pedidosPorEstado.map((p) => (
                          <div
                            key={p.estado}
                            className="flex items-center gap-3"
                          >
                            <span
                              className="w-2 h-2 rounded-full flex-shrink-0"
                              style={{
                                background: statusColors[p.estado] || "#888",
                              }}
                            />
                            <span className="text-sm text-[#aaa] flex-1 capitalize">
                              {p.estado}
                            </span>
                            <div className="flex items-center gap-3">
                              <div className="w-24 h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden">
                                <div
                                  className="h-full rounded-full"
                                  style={{
                                    width: `${Math.min(100, (p.cantidad / Math.max(data.totalPedidos, 1)) * 100)}%`,
                                    background:
                                      statusColors[p.estado] || "#888",
                                  }}
                                />
                              </div>
                              <span className="text-sm font-semibold w-6 text-right">
                                {p.cantidad}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[#888] text-sm">Sin datos</p>
                    )}
                  </div>
                </div>

                {/* Stock bajo + Top productos */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-[#0f0f0f] border border-[#1f1f1f] rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-5">
                      <AlertTriangle size={16} className="text-yellow-500" />
                      <h3 className="font-[family-name:var(--font-heading)] text-sm font-semibold">
                        Stock Bajo
                      </h3>
                    </div>
                    {data.stockBajo.length > 0 ? (
                      <div className="flex flex-col gap-3">
                        {data.stockBajo.map((s, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between py-2 border-b border-[#1a1a1a] last:border-0"
                          >
                            <span className="text-sm text-[#ccc]">
                              {s.nombre}
                            </span>
                            <span
                              className={`text-sm font-semibold px-2 py-0.5 rounded ${s.stock < 5 ? "text-red-400 bg-red-400/10" : "text-yellow-400 bg-yellow-400/10"}`}
                            >
                              {s.stock} uds.
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[#888] text-sm">Todo en buen nivel</p>
                    )}
                  </div>

                  {data.productosTop.length > 0 && (
                    <div className="bg-[#0f0f0f] border border-[#1f1f1f] rounded-xl p-6">
                      <div className="flex items-center gap-2 mb-5">
                        <TrendingUp size={16} className="text-green-500" />
                        <h3 className="font-[family-name:var(--font-heading)] text-sm font-semibold">
                          Top Productos
                        </h3>
                      </div>
                      <div className="flex flex-col gap-3">
                        {data.productosTop.map((p, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-3 py-2 border-b border-[#1a1a1a] last:border-0"
                          >
                            <span className="w-6 h-6 rounded-full bg-[#1a1a1a] flex items-center justify-center text-xs font-bold text-[#888]">
                              {i + 1}
                            </span>
                            <span className="text-sm text-[#ccc] flex-1 truncate">
                              {p.nombre}
                            </span>
                            <span className="text-xs text-[#666]">
                              {p.total_vendido} vend.
                            </span>
                            <span className="text-sm font-semibold text-green-400">
                              ${Number(p.total_ingresos || 0).toFixed(0)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Pedidos recientes */}
                <div className="bg-[#0f0f0f] border border-[#1f1f1f] rounded-xl overflow-hidden">
                  <div className="px-6 py-4 border-b border-[#1f1f1f] flex items-center justify-between">
                    <h3 className="font-[family-name:var(--font-heading)] text-sm font-semibold">
                      Pedidos Recientes
                    </h3>
                    <button
                      onClick={() => setTab("pedidos")}
                      className="text-xs text-[#3b82f6] hover:text-[#60a5fa] flex items-center gap-1 bg-transparent border-none cursor-pointer"
                    >
                      Ver todos <ArrowUpRight size={14} />
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-[#1f1f1f]">
                          {[
                            "Pedido",
                            "Cliente",
                            "Total",
                            "Estado",
                            "Fecha",
                          ].map((h) => (
                            <th
                              key={h}
                              className="text-left px-6 py-3 text-[10px] uppercase tracking-[1.5px] text-[#666] font-semibold"
                            >
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {data.pedidosRecientes.map((p) => (
                          <tr
                            key={p.id}
                            className="border-b border-[#1a1a1a] hover:bg-[#111] transition-colors"
                          >
                            <td className="px-6 py-3 font-mono text-xs text-[#888]">
                              #{p.numero_pedido}
                            </td>
                            <td className="px-6 py-3 text-[#ccc]">
                              {p.nombre} {p.apellido}
                            </td>
                            <td className="px-6 py-3 font-semibold">
                              ${Number(p.total).toFixed(2)}
                            </td>
                            <td className="px-6 py-3">
                              <span
                                className="inline-flex items-center gap-1.5 text-xs px-2 py-1 rounded-full capitalize"
                                style={{
                                  color: statusColors[p.estado] || "#888",
                                  background:
                                    `${statusColors[p.estado]}15` || "#1a1a1a",
                                }}
                              >
                                <span
                                  className="w-1.5 h-1.5 rounded-full"
                                  style={{
                                    background:
                                      statusColors[p.estado] || "#888",
                                  }}
                                />
                                {p.estado}
                              </span>
                            </td>
                            <td className="px-6 py-3 text-[#888] text-xs">
                              {new Date(p.creado_en).toLocaleDateString(
                                "es-MX",
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {tab === "productos" && (
              <AdminProductos searchQuery={searchQuery} />
            )}
            {tab === "pedidos" && <AdminPedidos searchQuery={searchQuery} />}
            {tab === "usuarios" && <AdminUsuarios searchQuery={searchQuery} />}
            {tab === "contactos" && (
              <AdminContactos searchQuery={searchQuery} />
            )}
            {tab === "categorias" && (
              <AdminCategorias searchQuery={searchQuery} />
            )}
            {tab === "cupones" && <AdminCupones searchQuery={searchQuery} />}
            {tab === "resenas" && <AdminResenas searchQuery={searchQuery} />}
          </div>
        </main>
      </div>
    </>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
  trend,
}: {
  icon: LucideIcon;
  label: string;
  value: string | number;
  color: string;
  trend?: string;
}) {
  return (
    <div className="bg-[#0f0f0f] border border-[#1f1f1f] rounded-xl p-5 hover:border-[#333] transition-colors">
      <div className="flex items-center justify-between mb-3">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ background: `${color}15` }}
        >
          <Icon size={20} style={{ color }} strokeWidth={1.5} />
        </div>
        {trend && (
          <span className="text-xs text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full font-medium">
            {trend}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold tracking-tight">{value}</p>
      <p className="text-xs text-[#666] mt-1">{label}</p>
    </div>
  );
}

// Confirm Modal Component
function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  variant = "danger",
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
}) {
  const variantStyles = {
    danger: {
      confirm: "bg-red-500 hover:bg-red-600 text-white",
    },
    warning: {
      confirm: "bg-yellow-500 hover:bg-yellow-600 text-black",
    },
    info: {
      confirm: "bg-blue-500 hover:bg-blue-600 text-white",
    },
  };

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className="relative w-full max-w-md bg-[#0f0f0f] border border-[#1f1f1f] rounded-xl shadow-2xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="font-[family-name:var(--font-heading)] text-lg font-semibold mb-4">
          {title}
        </h3>
        <p className="text-[#ccc] text-sm leading-relaxed mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-[#888] hover:text-white border border-[#1f1f1f] hover:border-[#333] rounded-lg transition-all bg-transparent cursor-pointer"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all cursor-pointer ${variantStyles[variant].confirm}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

function AdminProductos({ searchQuery }: { searchQuery: string }) {
  const [productos, setProductos] = useState<Record<string, unknown>[]>([]);
  const [categorias, setCategorias] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Record<string, unknown> | null>(null);
  const [editForm, setEditForm] = useState({
    nombre: "",
    descripcion: "",
    precio_base: "",
    estado: "",
    categoria_id: "",
  });
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    productId: number | null;
  }>({
    isOpen: false,
    productId: null,
  });
  const [imagenes, setImagenes] = useState<Record<string, unknown>[]>([]);
  const [loadingImagenes, setLoadingImagenes] = useState(false);
  const [secciones, setSecciones] = useState<Record<string, unknown>[]>([]);
  const [loadingSecciones, setLoadingSecciones] = useState(false);
  const [nuevaSeccion, setNuevaSeccion] = useState({
    tipo: "texto_libre" as string,
    titulo: "" as string,
    contenido: "" as string,
    orden: 0 as number,
  });

  const filteredProductos = React.useMemo(() => {
    return productos.filter(
      (p) =>
        String(p.nombre).toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(p.categoria_nombre || "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase()),
    );
  }, [productos, searchQuery]);

  const fetchProductos = () => {
    fetch("/api/admin/products")
      .then((r) => r.json())
      .then((d) => setProductos(d.productos || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const fetchCategorias = () => {
    fetch("/api/admin/categories")
      .then((r) => r.json())
      .then((d) => setCategorias(d.categorias || []))
      .catch(() => {});
  };

  useEffect(() => {
    fetchProductos();
    fetchCategorias();
  }, []);

  const openEdit = async (p: Record<string, unknown>) => {
    setEditing(p);
    setEditForm({
      nombre: String(p.nombre || ""),
      descripcion: String(p.descripcion || ""),
      precio_base: String(p.precio_base || ""),
      estado: String(p.estado || "borrador"),
      categoria_id: String(p.categoria_id || ""),
    });

    // Cargar imágenes del producto
    setLoadingImagenes(true);
    try {
      const res = await fetch(`/api/admin/product-images?productoId=${p.id}`);
      const data = await res.json();
      setImagenes(data.imagenes || []);
    } catch (error) {
      console.error("Error loading images:", error);
      setImagenes([]);
    } finally {
      setLoadingImagenes(false);
    }

    // Cargar secciones del producto
    await fetchSecciones(Number(p.id));
  };

  const saveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/admin/products", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: editing?.id,
        nombre: editForm.nombre,
        descripcion: editForm.descripcion,
        precio_base: Number(editForm.precio_base),
        estado: editForm.estado,
        categoria_id: editForm.categoria_id
          ? Number(editForm.categoria_id)
          : null,
      }),
    });
    setEditing(null);
    fetchProductos();
  };

  const eliminar = async (id: number) => {
    setDeleteConfirm({ isOpen: true, productId: id });
  };

  const handleDeleteConfirm = async () => {
    if (deleteConfirm.productId) {
      await fetch(`/api/admin/products?id=${deleteConfirm.productId}`, {
        method: "DELETE",
      });
      fetchProductos();
    }
    setDeleteConfirm({ isOpen: false, productId: null });
  };

  const agregarImagen = async (url: string) => {
    if (!editing?.id) return;
    try {
      await fetch("/api/admin/product-images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productoId: editing.id,
          url_imagen: url,
          es_principal: imagenes.length === 0, // Primera imagen es principal
        }),
      });
      // Recargar imágenes
      const res = await fetch(
        `/api/admin/product-images?productoId=${editing.id}`,
      );
      const data = await res.json();
      setImagenes(data.imagenes || []);
    } catch (error) {
      console.error("Error adding image:", error);
    }
  };

  const eliminarImagen = async (imagenId: number) => {
    try {
      await fetch(`/api/admin/product-images?id=${imagenId}`, {
        method: "DELETE",
      });
      // Recargar imágenes
      if (editing?.id) {
        const res = await fetch(
          `/api/admin/product-images?productoId=${editing.id}`,
        );
        const data = await res.json();
        setImagenes(data.imagenes || []);
      }
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  const establecerPrincipal = async (imagenId: number) => {
    try {
      await fetch("/api/admin/product-images", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: imagenId, es_principal: true }),
      });
      // Recargar imágenes
      if (editing?.id) {
        const res = await fetch(
          `/api/admin/product-images?productoId=${editing.id}`,
        );
        const data = await res.json();
        setImagenes(data.imagenes || []);
      }
    } catch (error) {
      console.error("Error setting principal image:", error);
    }
  };

  // ── Secciones personalizables ──
  const fetchSecciones = async (productoId: number) => {
    setLoadingSecciones(true);
    try {
      const res = await fetch(
        `/api/admin/product-sections?producto_id=${productoId}`,
      );
      const data = await res.json();
      setSecciones(data.secciones || []);
    } catch (error) {
      console.error("Error loading sections:", error);
      setSecciones([]);
    } finally {
      setLoadingSecciones(false);
    }
  };

  const agregarSeccion = async () => {
    if (!editing?.id || !nuevaSeccion.titulo.trim()) return;
    try {
      await fetch("/api/admin/product-sections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          producto_id: editing.id,
          tipo: nuevaSeccion.tipo,
          titulo: nuevaSeccion.titulo.trim(),
          contenido: nuevaSeccion.contenido.trim(),
          orden: Number(nuevaSeccion.orden) || 0,
          activo: true,
        }),
      });
      setNuevaSeccion({
        tipo: "texto_libre",
        titulo: "",
        contenido: "",
        orden: 0,
      });
      await fetchSecciones(Number(editing.id));
    } catch (error) {
      console.error("Error adding section:", error);
    }
  };

  const actualizarSeccion = async (
    id: number,
    cambios: Partial<Record<string, unknown>>,
  ) => {
    try {
      await fetch("/api/admin/product-sections", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...cambios }),
      });
      if (editing?.id) await fetchSecciones(Number(editing.id));
    } catch (error) {
      console.error("Error updating section:", error);
    }
  };

  const eliminarSeccion = async (id: number) => {
    try {
      await fetch(`/api/admin/product-sections?id=${id}`, { method: "DELETE" });
      if (editing?.id) await fetchSecciones(Number(editing.id));
    } catch (error) {
      console.error("Error deleting section:", error);
    }
  };

  const cambiarOrdenSeccion = async (id: number, delta: number) => {
    const idx = secciones.findIndex((s) => Number(s.id) === id);
    if (idx < 0) return;
    const nuevaOrden = (Number(secciones[idx].orden) || 0) + delta;
    await actualizarSeccion(id, { orden: nuevaOrden });
  };

  if (loading) return <p className="text-[#888]">Cargando productos...</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-[family-name:var(--font-heading)] text-xl font-semibold">
          Gestión de Productos
        </h2>
        <Link
          href="/designer"
          target="_blank"
          className="inline-block bg-[#ffffff] text-[#0a0a0a] px-6 py-2 text-[0.7rem] uppercase tracking-[2px] font-[family-name:var(--font-heading)] font-semibold transition-all hover:bg-[#d4d4d4]"
        >
          Crear Producto
        </Link>
      </div>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-[#0f0f0f] border border-[#1f1f1f] rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-[family-name:var(--font-heading)] text-lg font-semibold">
                Editar Producto #{String(editing.id)}
              </h3>
              <button
                onClick={() => setEditing(null)}
                className="text-[#888] hover:text-white bg-transparent border-none cursor-pointer"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={saveEdit} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs text-[#888] uppercase tracking-[1.5px] mb-1 font-[family-name:var(--font-heading)]">
                  Nombre
                </label>
                <input
                  type="text"
                  value={editForm.nombre}
                  onChange={(e) =>
                    setEditForm({ ...editForm, nombre: e.target.value })
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      const form = (e.currentTarget as HTMLInputElement).form;
                      if (form) (form.elements[1] as HTMLInputElement)?.focus();
                    }
                  }}
                  className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#1f1f1f] text-[#f5f5f5] text-sm focus:outline-none focus:border-[#888]"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-[#888] uppercase tracking-[1.5px] mb-1 font-[family-name:var(--font-heading)]">
                  Descripción
                </label>
                <textarea
                  value={editForm.descripcion}
                  onChange={(e) =>
                    setEditForm({ ...editForm, descripcion: e.target.value })
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      const form = (e.currentTarget as HTMLTextAreaElement)
                        .form;
                      if (form) (form.elements[2] as HTMLInputElement)?.focus();
                    }
                  }}
                  rows={3}
                  className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#1f1f1f] text-[#f5f5f5] text-sm focus:outline-none focus:border-[#888]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-[#888] uppercase tracking-[1.5px] mb-1 font-[family-name:var(--font-heading)]">
                    Precio
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={editForm.precio_base}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        precio_base: e.currentTarget.value,
                      })
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        (
                          e.currentTarget.form?.elements[3] as HTMLInputElement
                        )?.focus();
                      }
                    }}
                    className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#1f1f1f] text-[#f5f5f5] text-sm focus:outline-none focus:border-[#888]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#888] uppercase tracking-[1.5px] mb-1 font-[family-name:var(--font-heading)]">
                    Estado
                  </label>
                  <select
                    value={editForm.estado}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        estado: e.currentTarget.value,
                      })
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        (
                          e.currentTarget.form?.elements[4] as HTMLInputElement
                        )?.focus();
                      }
                    }}
                    className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#1f1f1f] text-[#f5f5f5] text-sm focus:outline-none focus:border-[#888] cursor-pointer"
                  >
                    {["borrador", "publicado", "pausado", "agotado"].map(
                      (e) => (
                        <option key={e} value={e}>
                          {e.charAt(0).toUpperCase() + e.slice(1)}
                        </option>
                      ),
                    )}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs text-[#888] uppercase tracking-[1.5px] mb-1 font-[family-name:var(--font-heading)]">
                  Categoría
                </label>
                <select
                  value={editForm.categoria_id}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      categoria_id: e.currentTarget.value,
                    })
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      (
                        e.currentTarget.form?.elements[5] as HTMLButtonElement
                      )?.focus();
                    }
                  }}
                  className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#1f1f1f] text-[#f5f5f5] text-sm focus:outline-none focus:border-[#888] cursor-pointer"
                >
                  <option value="">Sin categoría</option>
                  {categorias.map((c) => (
                    <option key={String(c.id)} value={String(c.id)}>
                      {String(c.nombre)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sección de imágenes */}
              <div className="mt-6 pt-6 border-t border-[#1f1f1f]">
                <label className="block text-xs text-[#888] uppercase tracking-[1.5px] mb-3 font-[family-name:var(--font-heading)]">
                  Imágenes del Producto
                </label>
                {loadingImagenes ? (
                  <p className="text-[#888] text-sm">Cargando imágenes...</p>
                ) : (
                  <>
                    <div className="grid grid-cols-4 gap-3 mb-4">
                      {imagenes.map((img: any) => (
                        <div key={String(img.id)} className="relative group">
                          <img
                            src={String(img.url_imagen)}
                            alt="Producto"
                            className="w-full aspect-square object-cover rounded-lg border border-[#1f1f1f]"
                          />
                          {img.es_principal && (
                            <div className="absolute top-2 left-2 bg-[#3b82f6] text-white text-[10px] px-2 py-1 rounded-full uppercase tracking-wider">
                              Principal
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                            {!img.es_principal && (
                              <button
                                onClick={() =>
                                  establecerPrincipal(Number(img.id))
                                }
                                className="p-2 bg-[#3b82f6] text-white rounded-lg hover:bg-[#60a5fa] transition-colors border-none cursor-pointer"
                                title="Establecer como principal"
                              >
                                <svg
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                >
                                  <path d="M5 13l4 4L19 7" />
                                </svg>
                              </button>
                            )}
                            <button
                              onClick={() => eliminarImagen(Number(img.id))}
                              className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors border-none cursor-pointer"
                              title="Eliminar imagen"
                            >
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                <path d="M18 6 6 18M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="URL de imagen"
                        className="flex-1 px-3 py-2 bg-[#1a1a1a] border border-[#1f1f1f] text-[#f5f5f5] text-sm focus:outline-none focus:border-[#888]"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            agregarImagen((e.target as HTMLInputElement).value);
                            (e.target as HTMLInputElement).value = "";
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          const input = e.currentTarget
                            .previousElementSibling as HTMLInputElement;
                          if (input?.value) {
                            agregarImagen(input.value);
                            input.value = "";
                          }
                        }}
                        className="px-4 py-2 bg-[#3b82f6] text-white text-sm rounded-lg hover:bg-[#60a5fa] transition-colors border-none cursor-pointer"
                      >
                        Agregar
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* Secciones personalizables */}
              <div className="mt-6 pt-6 border-t border-[#1f1f1f]">
                <label className="block text-xs text-[#888] uppercase tracking-[1.5px] mb-3 font-[family-name:var(--font-heading)]">
                  Secciones / Bloques del Producto
                </label>
                {loadingSecciones ? (
                  <p className="text-[#888] text-sm">Cargando secciones...</p>
                ) : (
                  <div className="space-y-3">
                    {secciones.map((s) => (
                      <div
                        key={String(s.id)}
                        className="bg-[#1a1a1a] border border-[#1f1f1f] p-3 rounded-lg"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] uppercase tracking-[1px] text-[#888] bg-[#0f0f0f] px-2 py-1 rounded">
                              {String(s.tipo)}
                            </span>
                            <span className="text-xs font-medium text-[#f5f5f5]">
                              {String(s.titulo)}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() =>
                                cambiarOrdenSeccion(Number(s.id), -1)
                              }
                              className="p-1 text-[#888] hover:text-white bg-transparent border-none cursor-pointer"
                              title="Subir"
                            >
                              ↑
                            </button>
                            <button
                              onClick={() =>
                                cambiarOrdenSeccion(Number(s.id), 1)
                              }
                              className="p-1 text-[#888] hover:text-white bg-transparent border-none cursor-pointer"
                              title="Bajar"
                            >
                              ↓
                            </button>
                            <button
                              onClick={() => eliminarSeccion(Number(s.id))}
                              className="p-1 text-red-400 hover:text-red-300 bg-transparent border-none cursor-pointer"
                              title="Eliminar"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                        <textarea
                          value={String(s.contenido || "")}
                          onChange={(e) =>
                            actualizarSeccion(Number(s.id), {
                              contenido: e.target.value,
                            })
                          }
                          rows={2}
                          className="w-full px-3 py-2 bg-[#0f0f0f] border border-[#1f1f1f] text-[#f5f5f5] text-sm focus:outline-none focus:border-[#888] resize-none"
                        />
                        <div className="flex items-center gap-2 mt-2">
                          <input
                            type="checkbox"
                            checked={Boolean(s.activo)}
                            onChange={(e) =>
                              actualizarSeccion(Number(s.id), {
                                activo: e.target.checked,
                              })
                            }
                            id={`activo-${s.id}`}
                            className="accent-[#3b82f6]"
                          />
                          <label
                            htmlFor={`activo-${s.id}`}
                            className="text-xs text-[#888]"
                          >
                            Activo
                          </label>
                        </div>
                      </div>
                    ))}

                    {/* Nueva sección */}
                    <div className="bg-[#1a1a1a] border border-[#1f1f1f] p-3 rounded-lg">
                      <p className="text-xs uppercase tracking-[1.5px] text-[#888] font-[family-name:var(--font-heading)] mb-2">
                        Nueva sección
                      </p>
                      <div className="grid grid-cols-2 gap-2 mb-2">
                        <select
                          value={nuevaSeccion.tipo}
                          onChange={(e) =>
                            setNuevaSeccion({
                              ...nuevaSeccion,
                              tipo: e.target.value,
                            })
                          }
                          className="px-3 py-2 bg-[#0f0f0f] border border-[#1f1f1f] text-[#f5f5f5] text-sm focus:outline-none focus:border-[#888] cursor-pointer"
                        >
                          {[
                            "especificaciones",
                            "materiales",
                            "cuidado",
                            "faq",
                            "galeria",
                            "video",
                            "texto_libre",
                          ].map((t) => (
                            <option key={t} value={t}>
                              {t.replace("_", " ")}
                            </option>
                          ))}
                        </select>
                        <input
                          type="number"
                          placeholder="Orden"
                          value={nuevaSeccion.orden}
                          onChange={(e) =>
                            setNuevaSeccion({
                              ...nuevaSeccion,
                              orden: Number(e.target.value) || 0,
                            })
                          }
                          className="px-3 py-2 bg-[#0f0f0f] border border-[#1f1f1f] text-[#f5f5f5] text-sm focus:outline-none focus:border-[#888]"
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="Título"
                        value={nuevaSeccion.titulo}
                        onChange={(e) =>
                          setNuevaSeccion({
                            ...nuevaSeccion,
                            titulo: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 bg-[#0f0f0f] border border-[#1f1f1f] text-[#f5f5f5] text-sm focus:outline-none focus:border-[#888] mb-2"
                      />
                      <textarea
                        placeholder="Contenido"
                        value={nuevaSeccion.contenido}
                        onChange={(e) =>
                          setNuevaSeccion({
                            ...nuevaSeccion,
                            contenido: e.target.value,
                          })
                        }
                        rows={2}
                        className="w-full px-3 py-2 bg-[#0f0f0f] border border-[#1f1f1f] text-[#f5f5f5] text-sm focus:outline-none focus:border-[#888] resize-none mb-2"
                      />
                      <button
                        type="button"
                        onClick={agregarSeccion}
                        className="w-full px-4 py-2 bg-[#3b82f6] text-white text-sm rounded-lg hover:bg-[#60a5fa] transition-colors border-none cursor-pointer"
                      >
                        Agregar Sección
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-2 mt-6">
                <button
                  type="submit"
                  className="flex-1 bg-[#ffffff] text-[#0a0a0a] px-6 py-2 text-[0.7rem] uppercase tracking-[2px] font-[family-name:var(--font-heading)] font-semibold transition-all hover:bg-[#d4d4d4] border-none cursor-pointer"
                >
                  Guardar
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(null)}
                  className="flex-1 border border-[#888] text-[#888] px-6 py-2 text-[0.7rem] uppercase tracking-[2px] font-[family-name:var(--font-heading)] transition-all hover:border-white hover:text-white bg-transparent cursor-pointer"
                >
                  Cancelar
                </button>
              </div>
            </form>
            <div className="mt-4 pt-4 border-t border-[#1f1f1f]">
              <Link
                href={`/designer?productoId=${String(editing.id)}`}
                target="_blank"
                className="inline-block w-full text-center border border-[#3b82f6] text-[#3b82f6] px-6 py-2 text-[0.7rem] uppercase tracking-[2px] font-[family-name:var(--font-heading)] transition-all hover:bg-[#3b82f6] hover:text-white"
              >
                Editar en Diseñador
              </Link>
            </div>
          </div>
        </div>
      )}

      {filteredProductos.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-[#1f1f1f]">
                {[
                  "ID",
                  "Nombre",
                  "Categoría",
                  "Precio",
                  "Stock",
                  "Estado",
                  "Acciones",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left p-3 text-xs text-[#888] font-[family-name:var(--font-heading)] uppercase tracking-[1.5px]"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredProductos.map((p) => (
                <tr key={String(p.id)} className="border-b border-[#1f1f1f]">
                  <td className="p-3">{String(p.id)}</td>
                  <td className="p-3">{String(p.nombre)}</td>
                  <td className="p-3">{String(p.categoria_nombre || "-")}</td>
                  <td className="p-3">${Number(p.precio_base).toFixed(2)}</td>
                  <td className="p-3">{String(p.stock_total ?? 0)}</td>
                  <td className="p-3">
                    <span
                      className="text-xs uppercase tracking-[1px] font-[family-name:var(--font-heading)]"
                      style={{
                        color:
                          p.estado === "publicado"
                            ? "#22c55e"
                            : p.estado === "borrador"
                              ? "#888"
                              : p.estado === "pausado"
                                ? "#f59e0b"
                                : "#ef4444",
                      }}
                    >
                      {String(p.estado).charAt(0).toUpperCase() +
                        String(p.estado).slice(1)}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-3">
                      <button
                        onClick={() => openEdit(p)}
                        className="text-[#3b82f6] hover:text-[#60a5fa] text-xs uppercase tracking-[1px] font-[family-name:var(--font-heading)] bg-transparent border-none cursor-pointer"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => eliminar(Number(p.id))}
                        className="text-red-400 hover:text-red-300 text-xs uppercase tracking-[1px] font-[family-name:var(--font-heading)] bg-transparent border-none cursor-pointer"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-[#888]">
          {searchQuery ? "No se encontraron resultados." : "No hay productos."}
        </p>
      )}

      <ConfirmModal
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, productId: null })}
        onConfirm={handleDeleteConfirm}
        title="Eliminar Producto"
        message="¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="danger"
      />
    </div>
  );
}

function AdminPedidos({ searchQuery }: { searchQuery: string }) {
  const [pedidos, setPedidos] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [justificacionModal, setJustificacionModal] = useState<{
    open: boolean;
    pedidoId: number;
    nuevoEstado: string;
    justificacion: string;
    error: string;
  }>({
    open: false,
    pedidoId: 0,
    nuevoEstado: "",
    justificacion: "",
    error: "",
  });
  const [historialModal, setHistorialModal] = useState<{
    open: boolean;
    pedidoId: number;
    historial: Record<string, unknown>[];
  }>({ open: false, pedidoId: 0, historial: [] });

  const filteredPedidos = React.useMemo(() => {
    return pedidos.filter(
      (p) =>
        String(p.numero_pedido)
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        String(p.cliente_nombre || "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        String(p.cliente_apellido || "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        String(p.estado).toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [pedidos, searchQuery]);

  useEffect(() => {
    fetch("/api/admin/orders")
      .then((r) => r.json())
      .then((d) => setPedidos(d.pedidos || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const openJustificacion = (id: number, estado: string) => {
    setJustificacionModal({
      open: true,
      pedidoId: id,
      nuevoEstado: estado,
      justificacion: "",
      error: "",
    });
  };

  const submitJustificacion = async () => {
    const { pedidoId, nuevoEstado, justificacion } = justificacionModal;
    if (!justificacion.trim() || justificacion.trim().length < 5) {
      setJustificacionModal((prev) => ({
        ...prev,
        error: "La justificación debe tener al menos 5 caracteres.",
      }));
      return;
    }

    const res = await fetch("/api/admin/orders", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: pedidoId,
        estado: nuevoEstado,
        justificacion: justificacion.trim(),
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      setJustificacionModal((prev) => ({
        ...prev,
        error: data.error || "Error al actualizar.",
      }));
      return;
    }

    setJustificacionModal({
      open: false,
      pedidoId: 0,
      nuevoEstado: "",
      justificacion: "",
      error: "",
    });
    const refresh = await fetch("/api/admin/orders");
    const data = await refresh.json();
    setPedidos(data.pedidos || []);
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

  const limpiarChatsInactivos = async () => {
    const res = await fetch("/api/chat/cleanup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ manual: false }),
    });
    const data = await res.json();
    if (res.ok) {
      alert(`Chats inactivos eliminados: ${data.eliminados || 0}`);
    } else {
      alert(data.error || "Error al limpiar chats.");
    }
  };

  const borrarChatPedido = async (pedidoId: number) => {
    if (
      !confirm(
        "¿Eliminar el chat de este pedido? Esta acción no se puede deshacer.",
      )
    )
      return;
    const res = await fetch("/api/chat/cleanup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ manual: true, pedido_id: pedidoId }),
    });
    const data = await res.json();
    if (res.ok) {
      alert("Chat eliminado.");
    } else {
      alert(data.error || "Error al eliminar chat.");
    }
  };

  if (loading) return <p className="text-[#888]">Cargando pedidos...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-[family-name:var(--font-heading)] text-xl font-semibold">
          Gestión de Pedidos
        </h2>
        <button
          onClick={limpiarChatsInactivos}
          className="text-[0.6rem] uppercase tracking-[1.5px] font-[family-name:var(--font-heading)] text-red-400 hover:text-red-300 border border-red-500/20 hover:border-red-400 px-3 py-1.5 bg-transparent cursor-pointer"
        >
          Limpiar Chats Inactivos (+24h)
        </button>
      </div>
      {pedidos.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-[#1f1f1f]">
                {[
                  "Pedido",
                  "Cliente",
                  "Total",
                  "Estado",
                  "Fecha",
                  "Acción",
                  "Chat",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left p-3 text-xs text-[#888] font-[family-name:var(--font-heading)] uppercase tracking-[1.5px]"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pedidos.map((p) => (
                <tr key={String(p.id)} className="border-b border-[#1f1f1f]">
                  <td className="p-3">#{String(p.numero_pedido)}</td>
                  <td className="p-3">
                    {String(p.cliente_nombre)} {String(p.cliente_apellido)}
                  </td>
                  <td className="p-3">${Number(p.total).toFixed(2)}</td>
                  <td className="p-3">{String(p.estado)}</td>
                  <td className="p-3">
                    {new Date(String(p.creado_en)).toLocaleDateString("es-MX")}
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <select
                        value={String(p.estado)}
                        onChange={(e) => {
                          if (e.target.value !== String(p.estado)) {
                            openJustificacion(Number(p.id), e.target.value);
                          }
                        }}
                        className="bg-[#1a1a1a] text-[#f5f5f5] border border-[#1f1f1f] px-2 py-1 text-xs cursor-pointer"
                      >
                        {[
                          "pendiente",
                          "procesando",
                          "enviado",
                          "entregado",
                          "cancelado",
                        ].map((e) => (
                          <option key={e} value={e}>
                            {e.charAt(0).toUpperCase() + e.slice(1)}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => verHistorial(Number(p.id))}
                        className="text-[#888] hover:text-[#f5f5f5] text-xs bg-transparent border-none cursor-pointer underline"
                        title="Ver historial"
                      >
                        Historial
                      </button>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <OrderChat
                        pedidoId={Number(p.id)}
                        pedidoNumero={String(p.numero_pedido)}
                        triggerLabel="Chat"
                      />
                      <button
                        onClick={() => borrarChatPedido(Number(p.id))}
                        className="text-[#555] hover:text-red-400 text-[0.6rem] uppercase tracking-[1px] bg-transparent border-none cursor-pointer"
                        title="Eliminar chat"
                      >
                        Borrar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-[#888]">
          {searchQuery ? "No se encontraron resultados." : "No hay pedidos."}
        </p>
      )}

      {/* Modal Justificación */}
      {justificacionModal.open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/70"
            onClick={() =>
              setJustificacionModal({
                open: false,
                pedidoId: 0,
                nuevoEstado: "",
                justificacion: "",
                error: "",
              })
            }
          />
          <div className="relative bg-[#141414] border border-[#2a2a2a] p-6 w-full max-w-md">
            <h3 className="font-[family-name:var(--font-heading)] text-lg mb-1">
              Cambiar Estado
            </h3>
            <p className="text-[#888] text-sm mb-4">
              Nuevo estado:{" "}
              <strong className="text-[#f5f5f5]">
                {justificacionModal.nuevoEstado}
              </strong>
            </p>
            <label className="block text-xs uppercase tracking-[1.5px] text-[#888] font-[family-name:var(--font-heading)] mb-2">
              Justificación *
            </label>
            <textarea
              value={justificacionModal.justificacion}
              onChange={(e) =>
                setJustificacionModal((prev) => ({
                  ...prev,
                  justificacion: e.target.value,
                  error: "",
                }))
              }
              placeholder="Describe el motivo del cambio..."
              className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-[#f5f5f5] text-sm p-3 focus:outline-none focus:border-[#888] resize-none h-24 mb-2"
            />
            {justificacionModal.error && (
              <p className="text-red-400 text-xs mb-3">
                {justificacionModal.error}
              </p>
            )}
            <div className="flex gap-2 justify-end">
              <button
                onClick={() =>
                  setJustificacionModal({
                    open: false,
                    pedidoId: 0,
                    nuevoEstado: "",
                    justificacion: "",
                    error: "",
                  })
                }
                className="px-4 py-2 text-xs uppercase tracking-[1.5px] font-[family-name:var(--font-heading)] text-[#888] hover:text-[#f5f5f5] bg-transparent border border-[#2a2a2a] cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={submitJustificacion}
                className="px-4 py-2 text-xs uppercase tracking-[1.5px] font-[family-name:var(--font-heading)] bg-[#ffffff] text-[#0a0a0a] hover:bg-[#d4d4d4] border-none cursor-pointer"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Historial */}
      {historialModal.open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/70"
            onClick={() =>
              setHistorialModal({ open: false, pedidoId: 0, historial: [] })
            }
          />
          <div className="relative bg-[#141414] border border-[#2a2a2a] p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto">
            <h3 className="font-[family-name:var(--font-heading)] text-lg mb-4">
              Historial de Cambios
            </h3>
            {historialModal.historial.length === 0 ? (
              <p className="text-[#888] text-sm">No hay cambios registrados.</p>
            ) : (
              <div className="space-y-3">
                {historialModal.historial.map((h) => (
                  <div
                    key={String(h.id)}
                    className="bg-[#1a1a1a] border border-[#2a2a2a] p-3"
                  >
                    <div className="flex items-center gap-2 text-xs mb-1">
                      <span className="text-[#888]">
                        {String(h.estado_anterior)}
                      </span>
                      <span>→</span>
                      <span className="text-[#f5f5f5] font-medium">
                        {String(h.estado_nuevo)}
                      </span>
                      <span className="text-[#555] ml-auto">
                        {h.creado_en
                          ? new Date(String(h.creado_en)).toLocaleString(
                              "es-MX",
                            )
                          : ""}
                      </span>
                    </div>
                    <p className="text-sm text-[#ccc]">
                      {String(h.justificacion)}
                    </p>
                    <p className="text-[10px] text-[#555] mt-1 uppercase tracking-[1px]">
                      Por: {String(h.cambiado_por_nombre || "")}{" "}
                      {String(h.cambiado_por_apellido || "")} ·{" "}
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
                className="px-4 py-2 text-xs uppercase tracking-[1.5px] font-[family-name:var(--font-heading)] text-[#888] hover:text-[#f5f5f5] bg-transparent border border-[#2a2a2a] cursor-pointer"
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

function AdminUsuarios({ searchQuery }: { searchQuery: string }) {
  const [usuarios, setUsuarios] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);

  const filteredUsuarios = React.useMemo(() => {
    return usuarios.filter(
      (u) =>
        String(u.nombre).toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(u.apellido || "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        String(u.correo).toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(u.rol).toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [usuarios, searchQuery]);

  const fetchUsuarios = () => {
    fetch("/api/admin/users")
      .then((r) => r.json())
      .then((d) => setUsuarios(d.usuarios || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const updateRol = async (id: number, rol: string) => {
    await fetch("/api/admin/users", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, rol }),
    });
    fetchUsuarios();
  };

  if (loading) return <p className="text-[#888]">Cargando usuarios...</p>;

  return (
    <div>
      <h2 className="font-[family-name:var(--font-heading)] text-xl font-semibold mb-4">
        Gestión de Usuarios
      </h2>
      {filteredUsuarios.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-[#1f1f1f]">
                {["ID", "Nombre", "Correo", "Rol", "Registro"].map((h) => (
                  <th
                    key={h}
                    className="text-left p-3 text-xs text-[#888] font-[family-name:var(--font-heading)] uppercase tracking-[1.5px]"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredUsuarios.map((u) => (
                <tr key={String(u.id)} className="border-b border-[#1f1f1f]">
                  <td className="p-3">{String(u.id)}</td>
                  <td className="p-3">
                    {String(u.nombre)} {String(u.apellido)}
                  </td>
                  <td className="p-3">{String(u.correo)}</td>
                  <td className="p-3">
                    <select
                      value={String(u.rol)}
                      onChange={(e) => updateRol(Number(u.id), e.target.value)}
                      className="bg-[#1a1a1a] text-[#f5f5f5] border border-[#1f1f1f] px-2 py-1 text-xs cursor-pointer"
                    >
                      {["cliente", "vendedor", "admin"].map((r) => (
                        <option key={r} value={r}>
                          {r.charAt(0).toUpperCase() + r.slice(1)}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="p-3">
                    {u.creado_en
                      ? new Date(String(u.creado_en)).toLocaleDateString(
                          "es-MX",
                        )
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-[#888]">
          {searchQuery ? "No se encontraron resultados." : "No hay usuarios."}
        </p>
      )}
    </div>
  );
}

function AdminContactos({ searchQuery }: { searchQuery: string }) {
  const [mensajes, setMensajes] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);

  const filteredMensajes = React.useMemo(() => {
    return mensajes.filter(
      (m) =>
        String(m.nombre).toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(m.email).toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(m.asunto).toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(m.mensaje).toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [mensajes, searchQuery]);

  const fetchMensajes = () => {
    fetch("/api/admin/contacts")
      .then((r) => r.json())
      .then((d) => setMensajes(d.mensajes || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMensajes();
  }, []);

  const marcarLeido = async (id: number, leido: boolean) => {
    await fetch("/api/admin/contacts", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, leido }),
    });
    fetchMensajes();
  };

  if (loading) return <p className="text-[#888]">Cargando mensajes...</p>;

  return (
    <div>
      <h2 className="font-[family-name:var(--font-heading)] text-xl font-semibold mb-4">
        Mensajes de Contacto
      </h2>
      {filteredMensajes.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-[#1f1f1f]">
                {[
                  "Nombre",
                  "Email",
                  "Asunto",
                  "Mensaje",
                  "Fecha",
                  "Estado",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left p-3 text-xs text-[#888] font-[family-name:var(--font-heading)] uppercase tracking-[1.5px]"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredMensajes.map((m) => (
                <tr
                  key={String(m.id)}
                  className={`border-b border-[#1f1f1f] ${!m.leido ? "bg-[#1a1a1a]/30" : ""}`}
                >
                  <td className="p-3">{String(m.nombre)}</td>
                  <td className="p-3">{String(m.email)}</td>
                  <td className="p-3">{String(m.asunto)}</td>
                  <td className="p-3 max-w-[300px] truncate">
                    {String(m.mensaje)}
                  </td>
                  <td className="p-3">
                    {m.creado_en
                      ? new Date(String(m.creado_en)).toLocaleDateString(
                          "es-MX",
                        )
                      : "-"}
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() =>
                        marcarLeido(Number(m.id), !Boolean(m.leido))
                      }
                      className={`text-xs uppercase tracking-[1px] font-[family-name:var(--font-heading)] bg-transparent border-none cursor-pointer ${m.leido ? "text-[#888] hover:text-white" : "text-green-400 hover:text-green-300"}`}
                    >
                      {m.leido ? "Leído" : "Nuevo"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-[#888]">
          {searchQuery
            ? "No se encontraron resultados."
            : "No hay mensajes de contacto."}
        </p>
      )}
    </div>
  );
}

function AdminCategorias({ searchQuery }: { searchQuery: string }) {
  const [categorias, setCategorias] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ nombre: "", slug: "" });
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    categoryId: number | null;
  }>({
    isOpen: false,
    categoryId: null,
  });

  const filteredCategorias = React.useMemo(() => {
    return categorias.filter(
      (c) =>
        String(c.nombre).toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(c.slug).toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [categorias, searchQuery]);

  const fetchCategorias = () => {
    fetch("/api/admin/categories")
      .then((r) => r.json())
      .then((d) => setCategorias(d.categorias || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCategorias();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const slug = form.nombre
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, slug }),
    });
    setForm({ nombre: "", slug: "" });
    fetchCategorias();
  };

  const eliminar = async (id: number) => {
    setDeleteConfirm({ isOpen: true, categoryId: id });
  };

  const handleDeleteConfirm = async () => {
    if (deleteConfirm.categoryId) {
      await fetch(`/api/admin/categories?id=${deleteConfirm.categoryId}`, {
        method: "DELETE",
      });
      fetchCategorias();
    }
    setDeleteConfirm({ isOpen: false, categoryId: null });
  };

  if (loading) return <p className="text-[#888]">Cargando categorías...</p>;

  return (
    <div>
      <h2 className="font-[family-name:var(--font-heading)] text-xl font-semibold mb-4">
        Gestión de Categorías
      </h2>
      <form onSubmit={handleSubmit} className="flex gap-4 mb-8">
        <input
          type="text"
          placeholder="Nombre de categoría"
          value={form.nombre}
          onChange={(e) => setForm({ ...form, nombre: e.target.value })}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              const form = (e.currentTarget as HTMLInputElement).form;
              if (form) (form.elements[1] as HTMLButtonElement)?.focus();
            }
          }}
          className="flex-1 px-4 py-2 bg-[#1a1a1a] border border-[#1f1f1f] text-[#f5f5f5] text-sm focus:outline-none focus:border-[#888]"
          required
        />
        <button
          type="submit"
          className="bg-[#ffffff] text-[#0a0a0a] px-6 py-2 text-[0.7rem] uppercase tracking-[2px] font-[family-name:var(--font-heading)] font-semibold transition-all hover:bg-[#d4d4d4] border-none cursor-pointer"
        >
          Agregar
        </button>
      </form>
      {filteredCategorias.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-[#1f1f1f]">
                {["ID", "Nombre", "Slug", "Acciones"].map((h) => (
                  <th
                    key={h}
                    className="text-left p-3 text-xs text-[#888] font-[family-name:var(--font-heading)] uppercase tracking-[1.5px]"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredCategorias.map((c) => (
                <tr key={String(c.id)} className="border-b border-[#1f1f1f]">
                  <td className="p-3">{String(c.id)}</td>
                  <td className="p-3">{String(c.nombre)}</td>
                  <td className="p-3">{String(c.slug)}</td>
                  <td className="p-3">
                    <button
                      onClick={() => eliminar(Number(c.id))}
                      className="text-red-400 hover:text-red-300 text-xs uppercase tracking-[1px] font-[family-name:var(--font-heading)] bg-transparent border-none cursor-pointer"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-[#888]">
          {searchQuery ? "No se encontraron resultados." : "No hay categorías."}
        </p>
      )}

      <ConfirmModal
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, categoryId: null })}
        onConfirm={handleDeleteConfirm}
        title="Eliminar Categoría"
        message="¿Estás seguro de que deseas eliminar esta categoría? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="danger"
      />
    </div>
  );
}

function AdminCupones({ searchQuery }: { searchQuery: string }) {
  const [cupones, setCupones] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    codigo: "",
    tipo_descuento: "porcentaje",
    valor: "",
    minimo_compra: "",
    limite_usos: "",
    fecha_fin: "",
  });

  const filteredCupones = React.useMemo(() => {
    return cupones.filter(
      (c) =>
        String(c.codigo).toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(c.tipo_descuento)
          .toLowerCase()
          .includes(searchQuery.toLowerCase()),
    );
  }, [cupones, searchQuery]);

  const fetchCupones = () => {
    fetch("/api/admin/coupons")
      .then((r) => r.json())
      .then((d) => setCupones(d.cupones || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCupones();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/admin/coupons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        valor: Number(form.valor),
        minimo_compra: Number(form.minimo_compra) || 0,
        limite_usos: form.limite_usos ? Number(form.limite_usos) : null,
      }),
    });
    setForm({
      codigo: "",
      tipo_descuento: "porcentaje",
      valor: "",
      minimo_compra: "",
      limite_usos: "",
      fecha_fin: "",
    });
    fetchCupones();
  };

  const toggleActivo = async (id: number, activo: boolean) => {
    await fetch("/api/admin/coupons", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, activo: !activo }),
    });
    fetchCupones();
  };

  if (loading) return <p className="text-[#888]">Cargando cupones...</p>;

  return (
    <div>
      <h2 className="font-[family-name:var(--font-heading)] text-xl font-semibold mb-4">
        Gestión de Cupones
      </h2>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
      >
        <input
          type="text"
          placeholder="Código"
          value={form.codigo}
          onChange={(e) => setForm({ ...form, codigo: e.target.value })}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              const form = (e.currentTarget as HTMLInputElement).form;
              if (form) (form.elements[1] as HTMLSelectElement)?.focus();
            }
          }}
          className="px-4 py-2 bg-[#1a1a1a] border border-[#1f1f1f] text-[#f5f5f5] text-sm focus:outline-none focus:border-[#888]"
          required
        />
        <select
          value={form.tipo_descuento}
          onChange={(e) => setForm({ ...form, tipo_descuento: e.target.value })}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              const form = (e.currentTarget as HTMLSelectElement).form;
              if (form) (form.elements[2] as HTMLInputElement)?.focus();
            }
          }}
          className="px-4 py-2 bg-[#1a1a1a] border border-[#1f1f1f] text-[#f5f5f5] text-sm focus:outline-none focus:border-[#888] cursor-pointer"
        >
          <option value="porcentaje">Porcentaje</option>
          <option value="fijo">Fijo</option>
          <option value="envio_gratis">Envío Gratis</option>
        </select>
        <input
          type="number"
          placeholder="Valor"
          value={form.valor}
          onChange={(e) => setForm({ ...form, valor: e.target.value })}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              const form = (e.currentTarget as HTMLInputElement).form;
              if (form) (form.elements[3] as HTMLInputElement)?.focus();
            }
          }}
          className="px-4 py-2 bg-[#1a1a1a] border border-[#1f1f1f] text-[#f5f5f5] text-sm focus:outline-none focus:border-[#888]"
          required
        />
        <input
          type="number"
          placeholder="Mínimo compra"
          value={form.minimo_compra}
          onChange={(e) => setForm({ ...form, minimo_compra: e.target.value })}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              const form = (e.currentTarget as HTMLInputElement).form;
              if (form) (form.elements[4] as HTMLInputElement)?.focus();
            }
          }}
          className="px-4 py-2 bg-[#1a1a1a] border border-[#1f1f1f] text-[#f5f5f5] text-sm focus:outline-none focus:border-[#888]"
        />
        <input
          type="number"
          placeholder="Límite usos (vacío = ilimitado)"
          value={form.limite_usos}
          onChange={(e) => setForm({ ...form, limite_usos: e.target.value })}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              const form = (e.currentTarget as HTMLInputElement).form;
              if (form) (form.elements[5] as HTMLInputElement)?.focus();
            }
          }}
          className="px-4 py-2 bg-[#1a1a1a] border border-[#1f1f1f] text-[#f5f5f5] text-sm focus:outline-none focus:border-[#888]"
        />
        <input
          type="date"
          placeholder="Fecha fin"
          value={form.fecha_fin}
          onChange={(e) => setForm({ ...form, fecha_fin: e.target.value })}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              const form = (e.currentTarget as HTMLInputElement).form;
              if (form) (form.elements[6] as HTMLButtonElement)?.focus();
            }
          }}
          className="px-4 py-2 bg-[#1a1a1a] border border-[#1f1f1f] text-[#f5f5f5] text-sm focus:outline-none focus:border-[#888]"
        />
        <button
          type="submit"
          className="sm:col-span-3 bg-[#ffffff] text-[#0a0a0a] px-6 py-2 text-[0.7rem] uppercase tracking-[2px] font-[family-name:var(--font-heading)] font-semibold transition-all hover:bg-[#d4d4d4] border-none cursor-pointer"
        >
          Agregar Cupón
        </button>
      </form>
      {filteredCupones.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-[#1f1f1f]">
                {["Código", "Tipo", "Valor", "Usos", "Activo", "Acción"].map(
                  (h) => (
                    <th
                      key={h}
                      className="text-left p-3 text-xs text-[#888] font-[family-name:var(--font-heading)] uppercase tracking-[1.5px]"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {filteredCupones.map((c) => (
                <tr key={String(c.id)} className="border-b border-[#1f1f1f]">
                  <td className="p-3 font-semibold">{String(c.codigo)}</td>
                  <td className="p-3">{String(c.tipo_descuento)}</td>
                  <td className="p-3">
                    {String(c.tipo_descuento) === "porcentaje"
                      ? `${Number(c.valor).toFixed(0)}%`
                      : `$${Number(c.valor).toFixed(2)}`}
                  </td>
                  <td className="p-3">
                    {String(c.usos_actuales)}
                    {c.limite_usos ? ` / ${String(c.limite_usos)}` : ""}
                  </td>
                  <td className="p-3">
                    <span
                      className={c.activo ? "text-green-400" : "text-red-400"}
                    >
                      {c.activo ? "Sí" : "No"}
                    </span>
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() =>
                        toggleActivo(Number(c.id), Boolean(c.activo))
                      }
                      className="text-xs uppercase tracking-[1px] font-[family-name:var(--font-heading)] bg-transparent border-none cursor-pointer text-[#888] hover:text-white"
                    >
                      {c.activo ? "Desactivar" : "Activar"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-[#888]">
          {searchQuery ? "No se encontraron resultados." : "No hay cupones."}
        </p>
      )}
    </div>
  );
}

function AdminResenas({ searchQuery }: { searchQuery: string }) {
  const [resenas, setResenas] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);

  const filteredResenas = React.useMemo(() => {
    return resenas.filter(
      (r) =>
        String(r.producto_nombre)
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        String(r.usuario_nombre || "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        String(r.usuario_apellido || "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        String(r.comentario).toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [resenas, searchQuery]);

  const fetchResenas = () => {
    fetch("/api/admin/reviews")
      .then((r) => r.json())
      .then((d) => setResenas(d.resenas || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchResenas();
  }, []);

  const toggleAprobada = async (id: number, aprobada: boolean) => {
    await fetch("/api/admin/reviews", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, aprobada: !aprobada }),
    });
    fetchResenas();
  };

  if (loading) return <p className="text-[#888]">Cargando reseñas...</p>;

  return (
    <div>
      <h2 className="font-[family-name:var(--font-heading)] text-xl font-semibold mb-4">
        Gestión de Reseñas
      </h2>
      {filteredResenas.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-[#1f1f1f]">
                {[
                  "Producto",
                  "Usuario",
                  "Calificación",
                  "Comentario",
                  "Fecha",
                  "Estado",
                  "Acción",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left p-3 text-xs text-[#888] font-[family-name:var(--font-heading)] uppercase tracking-[1.5px]"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredResenas.map((r) => (
                <tr
                  key={String(r.id)}
                  className={`border-b border-[#1f1f1f] ${!r.aprobada ? "bg-[#1a1a1a]/30" : ""}`}
                >
                  <td className="p-3">{String(r.producto_nombre)}</td>
                  <td className="p-3">
                    {String(r.usuario_nombre)} {String(r.usuario_apellido)}
                  </td>
                  <td className="p-3">{"⭐".repeat(Number(r.calificacion))}</td>
                  <td className="p-3 max-w-[250px] truncate">
                    {String(r.comentario)}
                  </td>
                  <td className="p-3">
                    {r.creado_en
                      ? new Date(String(r.creado_en)).toLocaleDateString(
                          "es-MX",
                        )
                      : "-"}
                  </td>
                  <td className="p-3">
                    <span
                      className={
                        r.aprobada ? "text-green-400" : "text-yellow-400"
                      }
                    >
                      {r.aprobada ? "Aprobada" : "Pendiente"}
                    </span>
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() =>
                        toggleAprobada(Number(r.id), Boolean(r.aprobada))
                      }
                      className="text-xs uppercase tracking-[1px] font-[family-name:var(--font-heading)] bg-transparent border-none cursor-pointer text-[#888] hover:text-white"
                    >
                      {r.aprobada ? "Rechazar" : "Aprobar"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-[#888]">
          {searchQuery ? "No se encontraron resultados." : "No hay reseñas."}
        </p>
      )}
    </div>
  );
}
