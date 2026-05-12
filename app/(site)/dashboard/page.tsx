"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CustomCheckbox from "@/app/components/CustomCheckbox";

interface Pedido {
  id: number;
  numero_pedido: string;
  total: number;
  estado: string;
  creado_en: string;
}

interface Direccion {
  id: number;
  etiqueta: string;
  nombre_destinatario: string;
  telefono_destinatario: string;
  pais: string;
  ciudad: string;
  estado: string;
  codigo_postal: string;
  linea_1: string;
  linea_2: string;
  predeterminada: boolean;
}

interface MetodoPago {
  id: number;
  tipo: string;
  nombre: string;
  numero_tarjeta: string;
  titular: string;
  fecha_expiracion: string;
  es_default: boolean;
  activo: boolean;
}

interface VendedorData {
  totalProductos: number;
  totalVentas: number;
  ingresosTotales: number;
  topProductos: {
    nombre: string;
    total_vendido: number;
    ingresos: number;
  }[];
}

interface DashboardData {
  usuario: {
    nombre: string;
    apellido: string;
    correo: string;
    telefono: string;
    creado_en: string;
    rol: string;
  };
  pedidos: Pedido[];
  direcciones: Direccion[];
  metodos_pago: MetodoPago[];
  vendedor?: VendedorData;
}

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<
    "resumen" | "pedidos" | "config" | "ventas" | "direcciones" | "pagos"
  >("resumen");
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [profileForm, setProfileForm] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
  });
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Direccion | null>(null);
  const [addressForm, setAddressForm] = useState({
    etiqueta: "",
    nombre_destinatario: "",
    telefono_destinatario: "",
    pais: "México",
    ciudad: "",
    estado: "",
    codigo_postal: "",
    linea_1: "",
    linea_2: "",
    predeterminada: false,
  });
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [editingPayment, setEditingPayment] = useState<MetodoPago | null>(null);
  const [paymentForm, setPaymentForm] = useState({
    tipo: "tarjeta",
    nombre: "",
    numero_tarjeta: "",
    titular: "",
    fecha_expiracion: "",
    es_default: false,
  });

  useEffect(() => {
    fetch("/api/dashboard")
      .then((r) => {
        if (r.status === 401) {
          router.push("/login");
          return null;
        }
        return r.json();
      })
      .then((d) => {
        if (d && !d.error) {
          setData(d);
          setProfileForm({
            nombre: d.usuario.nombre || "",
            apellido: d.usuario.apellido || "",
            telefono: d.usuario.telefono || "",
          });
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [router]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveMsg("");
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileForm),
      });
      if (res.ok) {
        setSaveMsg("Perfil actualizado correctamente.");
        if (data)
          setData({ ...data, usuario: { ...data.usuario, ...profileForm } });
      } else {
        setSaveMsg("Error al actualizar.");
      }
    } catch {
      setSaveMsg("Error de conexión.");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveMsg("");
    try {
      const url = editingAddress
        ? `/api/addresses/${editingAddress.id}`
        : "/api/addresses";
      const method = editingAddress ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addressForm),
      });
      if (res.ok) {
        setSaveMsg(
          editingAddress ? "Dirección actualizada." : "Dirección agregada.",
        );
        setShowAddressForm(false);
        setEditingAddress(null);
        setAddressForm({
          etiqueta: "",
          nombre_destinatario: "",
          telefono_destinatario: "",
          pais: "México",
          ciudad: "",
          estado: "",
          codigo_postal: "",
          linea_1: "",
          linea_2: "",
          predeterminada: false,
        });
        // Reload data
        const dataRes = await fetch("/api/dashboard");
        if (dataRes.ok) {
          const newData = await dataRes.json();
          setData(newData);
        }
      } else {
        setSaveMsg("Error al guardar dirección.");
      }
    } catch {
      setSaveMsg("Error de conexión.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAddress = async (id: number) => {
    if (!confirm("¿Eliminar esta dirección?")) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/addresses/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setSaveMsg("Dirección eliminada.");
        setData({
          ...data,
          direcciones: direcciones.filter((d) => d.id !== id),
        } as DashboardData);
      } else {
        setSaveMsg("Error al eliminar dirección.");
      }
    } catch {
      setSaveMsg("Error de conexión.");
    } finally {
      setSaving(false);
    }
  };

  const handleSetDefaultAddress = async (id: number) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/addresses/${id}/default`, {
        method: "PUT",
      });
      if (res.ok) {
        const dataRes = await fetch("/api/dashboard");
        if (dataRes.ok) {
          const newData = await dataRes.json();
          setData(newData);
        }
      }
    } catch {
    } finally {
      setSaving(false);
    }
  };

  const handleSavePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveMsg("");
    try {
      const url = editingPayment
        ? `/api/payments/${editingPayment.id}`
        : "/api/payments";
      const method = editingPayment ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paymentForm),
      });
      if (res.ok) {
        setSaveMsg(
          editingPayment
            ? "Método de pago actualizado."
            : "Método de pago agregado.",
        );
        setShowPaymentForm(false);
        setEditingPayment(null);
        setPaymentForm({
          tipo: "tarjeta",
          nombre: "",
          numero_tarjeta: "",
          titular: "",
          fecha_expiracion: "",
          es_default: false,
        });
        // Reload data
        const dataRes = await fetch("/api/dashboard");
        if (dataRes.ok) {
          const newData = await dataRes.json();
          setData(newData);
        }
      } else {
        setSaveMsg("Error al guardar método de pago.");
      }
    } catch {
      setSaveMsg("Error de conexión.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePayment = async (id: number) => {
    if (!confirm("¿Eliminar este método de pago?")) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/payments/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setSaveMsg("Método de pago eliminado.");
        setData({
          ...data,
          metodos_pago: metodos_pago.filter((m) => m.id !== id),
        } as DashboardData);
      } else {
        setSaveMsg("Error al eliminar método de pago.");
      }
    } catch {
      setSaveMsg("Error de conexión.");
    } finally {
      setSaving(false);
    }
  };

  const handleSetDefaultPayment = async (id: number) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/payments/${id}/default`, {
        method: "PUT",
      });
      if (res.ok) {
        const dataRes = await fetch("/api/dashboard");
        if (dataRes.ok) {
          const newData = await dataRes.json();
          setData(newData);
        }
      }
    } catch {
    } finally {
      setSaving(false);
    }
  };

  const openAddressForm = (address?: Direccion) => {
    if (address) {
      setEditingAddress(address);
      setAddressForm({
        etiqueta: address.etiqueta || "",
        nombre_destinatario: address.nombre_destinatario,
        telefono_destinatario: address.telefono_destinatario || "",
        pais: "México",
        ciudad: address.ciudad,
        estado: address.estado,
        codigo_postal: address.codigo_postal,
        linea_1: address.linea_1,
        linea_2: address.linea_2 || "",
        predeterminada: address.predeterminada,
      });
    } else {
      setEditingAddress(null);
      setAddressForm({
        etiqueta: "",
        nombre_destinatario: "",
        telefono_destinatario: "",
        pais: "México",
        ciudad: "",
        estado: "",
        codigo_postal: "",
        linea_1: "",
        linea_2: "",
        predeterminada: false,
      });
    }
    setShowAddressForm(true);
  };

  const openPaymentForm = (payment?: MetodoPago) => {
    if (payment) {
      setEditingPayment(payment);
      setPaymentForm({
        tipo: payment.tipo,
        nombre: payment.nombre,
        numero_tarjeta: payment.numero_tarjeta || "",
        titular: payment.titular || "",
        fecha_expiracion: payment.fecha_expiracion || "",
        es_default: payment.es_default,
      });
    } else {
      setEditingPayment(null);
      setPaymentForm({
        tipo: "tarjeta",
        nombre: "",
        numero_tarjeta: "",
        titular: "",
        fecha_expiracion: "",
        es_default: false,
      });
    }
    setShowPaymentForm(true);
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] py-24 px-8 text-center">
        <p className="text-[#888]">Cargando dashboard...</p>
      </div>
    );
  }

  if (!data) return null;

  const { usuario, pedidos, direcciones, metodos_pago, vendedor } = data;
  const esVendedor = ["vendedor", "admin"].includes(usuario.rol || "");
  const tabs = [
    { key: "resumen" as const, label: "Resumen" },
    { key: "pedidos" as const, label: "Pedidos" },
    { key: "direcciones" as const, label: "Direcciones" },
    { key: "pagos" as const, label: "Métodos de Pago" },
    { key: "config" as const, label: "Configuración" },
    ...(esVendedor ? [{ key: "ventas" as const, label: "Mis Ventas" }] : []),
  ];

  return (
    <div className="h-screen bg-[#0a0a0a] pt-5 pb-8 px-4 md:px-8 overflow-y-auto">
      <div className="max-w-full">
        <div className="mb-8 reveal">
          <h1 className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl font-semibold tracking-[-1px]">
            Bienvenido, {usuario.nombre}
          </h1>
          <p className="text-[#888] text-sm mt-2 capitalize">{usuario.rol}</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-[#2a2a2a] pb-2 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => {
                setTab(t.key);
                setSaveMsg("");
              }}
              className={`px-6 py-2 text-sm font-[family-name:var(--font-heading)] border-none cursor-pointer rounded-t transition-colors whitespace-nowrap ${tab === t.key ? "bg-[#ffffff] text-[#0a0a0a]" : "bg-transparent text-[#888] hover:text-white"}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === "resumen" && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              <div className="bg-[#141414] border border-[#2a2a2a] p-6 reveal">
                <h4 className="text-[#888] mb-2 text-sm">Total Pedidos</h4>
                <div className="text-3xl font-semibold">{pedidos.length}</div>
              </div>
              <div className="bg-[#141414] border border-[#2a2a2a] p-6 reveal">
                <h4 className="text-[#888] mb-2 text-sm">Mis Direcciones</h4>
                <div className="text-3xl font-semibold">
                  {direcciones.length}
                </div>
              </div>
              <div className="bg-[#141414] border border-[#2a2a2a] p-6 reveal">
                <h4 className="text-[#888] mb-2 text-sm">Miembro Desde</h4>
                <div className="text-base mt-2">
                  {usuario.creado_en
                    ? new Date(usuario.creado_en).toLocaleDateString("es-MX", {
                        month: "short",
                        year: "numeric",
                      })
                    : "-"}
                </div>
              </div>
            </div>

            {esVendedor && vendedor && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
                <div className="bg-[#141414] border border-[#2a2a2a] p-6 reveal">
                  <h4 className="text-[#888] mb-2 text-sm">Mis Productos</h4>
                  <div className="text-3xl font-semibold">
                    {vendedor.totalProductos}
                  </div>
                </div>
                <div className="bg-[#141414] border border-[#2a2a2a] p-6 reveal">
                  <h4 className="text-[#888] mb-2 text-sm">Ventas</h4>
                  <div className="text-3xl font-semibold">
                    {vendedor.totalVentas}
                  </div>
                </div>
                <div className="bg-[#141414] border border-[#2a2a2a] p-6 reveal">
                  <h4 className="text-[#888] mb-2 text-sm">Ingresos</h4>
                  <div className="text-3xl font-semibold">
                    ${Number(vendedor.ingresosTotales || 0).toFixed(2)}
                  </div>
                </div>
              </div>
            )}

            <section className="mb-12">
              <h2 className="font-[family-name:var(--font-heading)] text-2xl font-semibold mb-6">
                Mis Direcciones
              </h2>
              {direcciones.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {direcciones.map((dir) => (
                    <div
                      key={dir.id}
                      className="bg-[#141414] border border-[#2a2a2a] p-6 reveal"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-[family-name:var(--font-heading)] text-base">
                          {dir.etiqueta || "Dirección"}
                        </h4>
                        {dir.predeterminada ? (
                          <span className="text-[0.6rem] uppercase tracking-[1.5px] bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5">
                            Predeterminada
                          </span>
                        ) : null}
                      </div>
                      <p className="text-[#f5f5f5] text-sm mb-1">
                        {dir.nombre_destinatario}
                      </p>
                      <p className="text-[#888] text-sm">{dir.linea_1}</p>
                      <p className="text-[#888] text-sm">
                        {dir.ciudad}, {dir.estado} {dir.codigo_postal}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-[#141414] border border-[#2a2a2a]">
                  <p className="mb-2">No tienes direcciones guardadas.</p>
                </div>
              )}
            </section>
          </>
        )}

        {tab === "pedidos" && (
          <section>
            <h2 className="font-[family-name:var(--font-heading)] text-2xl font-semibold mb-6">
              Mis Pedidos
            </h2>
            {pedidos.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-[#2a2a2a]">
                      {["N° Pedido", "Fecha", "Total", "Estado"].map((h) => (
                        <th
                          key={h}
                          className="text-left p-3 font-[family-name:var(--font-heading)] uppercase tracking-[1.5px] text-xs text-[#888]"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {pedidos.map((p) => (
                      <tr key={p.id} className="border-b border-[#2a2a2a]">
                        <td className="p-3">#{p.numero_pedido}</td>
                        <td className="p-3">
                          {new Date(p.creado_en).toLocaleDateString("es-MX")}
                        </td>
                        <td className="p-3">${Number(p.total).toFixed(2)}</td>
                        <td className="p-3">
                          <span
                            className={`inline-block text-[0.65rem] uppercase tracking-[1.5px] font-semibold px-2 py-1 ${p.estado === "entregado" ? "bg-green-500/10 text-green-400 border border-green-500/20" : p.estado === "enviado" ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" : p.estado === "procesando" ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20" : "bg-[#2a2a2a] text-[#888]"}`}
                          >
                            {p.estado?.charAt(0).toUpperCase() +
                              p.estado?.slice(1)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 bg-[#141414] border border-[#2a2a2a]">
                <p className="mb-4">No tienes pedidos aún.</p>
                <Link
                  href="/productos"
                  className="inline-block bg-[#ffffff] text-[#0a0a0a] px-8 py-3 text-[0.75rem] uppercase tracking-[2px] font-[family-name:var(--font-heading)] font-semibold transition-all hover:bg-[#d4d4d4]"
                >
                  Ver Productos
                </Link>
              </div>
            )}
          </section>
        )}

        {tab === "direcciones" && (
          <section>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h2 className="font-[family-name:var(--font-heading)] text-2xl font-semibold">
                Mis Direcciones
              </h2>
              <button
                onClick={() => openAddressForm()}
                className="w-full sm:w-auto bg-[#ffffff] text-[#0a0a0a] px-6 py-3 text-[0.7rem] uppercase tracking-[2px] font-[family-name:var(--font-heading)] font-semibold transition-all hover:bg-[#d4d4d4] flex items-center justify-center gap-2"
              >
                <span>+</span> Agregar Dirección
              </button>
            </div>
            {saveMsg && (
              <div
                className={`mb-6 p-4 text-sm border ${saveMsg.includes("Error") ? "bg-red-500/10 border-red-500/30 text-red-400" : "bg-green-500/10 border-green-500/30 text-green-400"}`}
              >
                {saveMsg}
              </div>
            )}
            {showAddressForm && (
              <div className="bg-[#141414] border border-[#2a2a2a] p-6 mb-6">
                <h3 className="font-[family-name:var(--font-heading)] mb-4">
                  {editingAddress ? "Editar Dirección" : "Nueva Dirección"}
                </h3>
                <form onSubmit={handleSaveAddress} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-[1.5px] text-[#888] mb-2 font-[family-name:var(--font-heading)]">
                        Etiqueta
                      </label>
                      <input
                        type="text"
                        value={addressForm.etiqueta}
                        onChange={(e) =>
                          setAddressForm({
                            ...addressForm,
                            etiqueta: e.target.value,
                          })
                        }
                        placeholder="Casa, Trabajo, etc."
                        className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#2a2a2a] text-[#f5f5f5] text-sm focus:outline-none focus:border-[#888]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-[1.5px] text-[#888] mb-2 font-[family-name:var(--font-heading)]">
                        Nombre del Destinatario
                      </label>
                      <input
                        type="text"
                        value={addressForm.nombre_destinatario}
                        onChange={(e) =>
                          setAddressForm({
                            ...addressForm,
                            nombre_destinatario: e.target.value,
                          })
                        }
                        required
                        className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#2a2a2a] text-[#f5f5f5] text-sm focus:outline-none focus:border-[#888]"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-[1.5px] text-[#888] mb-2 font-[family-name:var(--font-heading)]">
                        Teléfono
                      </label>
                      <input
                        type="tel"
                        value={addressForm.telefono_destinatario}
                        onChange={(e) =>
                          setAddressForm({
                            ...addressForm,
                            telefono_destinatario: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#2a2a2a] text-[#f5f5f5] text-sm focus:outline-none focus:border-[#888]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-[1.5px] text-[#888] mb-2 font-[family-name:var(--font-heading)]">
                        País
                      </label>
                      <input
                        type="text"
                        value={addressForm.pais}
                        onChange={(e) =>
                          setAddressForm({
                            ...addressForm,
                            pais: e.target.value,
                          })
                        }
                        required
                        className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#2a2a2a] text-[#f5f5f5] text-sm focus:outline-none focus:border-[#888]"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-[1.5px] text-[#888] mb-2 font-[family-name:var(--font-heading)]">
                        Ciudad
                      </label>
                      <input
                        type="text"
                        value={addressForm.ciudad}
                        onChange={(e) =>
                          setAddressForm({
                            ...addressForm,
                            ciudad: e.target.value,
                          })
                        }
                        required
                        className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#2a2a2a] text-[#f5f5f5] text-sm focus:outline-none focus:border-[#888]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-[1.5px] text-[#888] mb-2 font-[family-name:var(--font-heading)]">
                        Estado
                      </label>
                      <input
                        type="text"
                        value={addressForm.estado}
                        onChange={(e) =>
                          setAddressForm({
                            ...addressForm,
                            estado: e.target.value,
                          })
                        }
                        required
                        className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#2a2a2a] text-[#f5f5f5] text-sm focus:outline-none focus:border-[#888]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-[1.5px] text-[#888] mb-2 font-[family-name:var(--font-heading)]">
                        Código Postal
                      </label>
                      <input
                        type="text"
                        value={addressForm.codigo_postal}
                        onChange={(e) =>
                          setAddressForm({
                            ...addressForm,
                            codigo_postal: e.target.value,
                          })
                        }
                        required
                        className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#2a2a2a] text-[#f5f5f5] text-sm focus:outline-none focus:border-[#888]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-[1.5px] text-[#888] mb-2 font-[family-name:var(--font-heading)]">
                      Dirección Línea 1
                    </label>
                    <input
                      type="text"
                      value={addressForm.linea_1}
                      onChange={(e) =>
                        setAddressForm({
                          ...addressForm,
                          linea_1: e.target.value,
                        })
                      }
                      required
                      className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#2a2a2a] text-[#f5f5f5] text-sm focus:outline-none focus:border-[#888]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-[1.5px] text-[#888] mb-2 font-[family-name:var(--font-heading)]">
                      Dirección Línea 2 (Opcional)
                    </label>
                    <input
                      type="text"
                      value={addressForm.linea_2}
                      onChange={(e) =>
                        setAddressForm({
                          ...addressForm,
                          linea_2: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#2a2a2a] text-[#f5f5f5] text-sm focus:outline-none focus:border-[#888]"
                    />
                  </div>
                  <CustomCheckbox
                    id="predeterminada"
                    checked={addressForm.predeterminada}
                    onChange={(checked) =>
                      setAddressForm({
                        ...addressForm,
                        predeterminada: checked,
                      })
                    }
                    label="Establecer como dirección predeterminada"
                  />
                  <div className="flex gap-4">
                    <button
                      type="submit"
                      disabled={saving}
                      className="bg-[#ffffff] text-[#0a0a0a] px-8 py-3 text-[0.75rem] uppercase tracking-[2px] font-[family-name:var(--font-heading)] font-semibold transition-all hover:bg-[#d4d4d4] disabled:opacity-50"
                    >
                      {saving
                        ? "Guardando..."
                        : editingAddress
                          ? "Actualizar"
                          : "Guardar"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddressForm(false);
                        setEditingAddress(null);
                      }}
                      className="border border-[#888] text-[#888] px-8 py-3 text-[0.75rem] uppercase tracking-[2px] font-[family-name:var(--font-heading)] transition-all hover:border-white hover:text-white bg-transparent"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            )}
            {direcciones.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {direcciones.map((dir) => (
                  <div
                    key={dir.id}
                    className="bg-[#141414] border border-[#2a2a2a] p-6 reveal"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-[family-name:var(--font-heading)] text-base">
                        {dir.etiqueta || "Dirección"}
                      </h4>
                      {dir.predeterminada ? (
                        <span className="text-[0.6rem] uppercase tracking-[1.5px] bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5">
                          Predeterminada
                        </span>
                      ) : null}
                    </div>
                    <p className="text-[#f5f5f5] text-sm mb-1">
                      {dir.nombre_destinatario}
                    </p>
                    <p className="text-[#888] text-sm">{dir.linea_1}</p>
                    {dir.linea_2 && (
                      <p className="text-[#888] text-sm">{dir.linea_2}</p>
                    )}
                    <p className="text-[#888] text-sm">
                      {dir.ciudad}, {dir.estado} {dir.codigo_postal}
                    </p>
                    <p className="text-[#888] text-sm">{dir.pais}</p>
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => openAddressForm(dir)}
                        className="text-xs text-[#888] hover:text-white transition-colors"
                      >
                        Editar
                      </button>
                      {!dir.predeterminada && (
                        <>
                          <button
                            onClick={() => handleSetDefaultAddress(dir.id)}
                            className="text-xs text-[#888] hover:text-white transition-colors"
                          >
                            Predeterminar
                          </button>
                          <button
                            onClick={() => handleDeleteAddress(dir.id)}
                            className="text-xs text-red-400 hover:text-red-300 transition-colors"
                          >
                            Eliminar
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-[#141414] border border-[#2a2a2a]">
                <p className="mb-2">No tienes direcciones guardadas.</p>
                <button
                  onClick={() => openAddressForm()}
                  className="inline-block bg-[#ffffff] text-[#0a0a0a] px-8 py-3 text-[0.75rem] uppercase tracking-[2px] font-[family-name:var(--font-heading)] font-semibold transition-all hover:bg-[#d4d4d4]"
                >
                  Agregar Dirección
                </button>
              </div>
            )}
          </section>
        )}

        {tab === "pagos" && (
          <section>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h2 className="font-[family-name:var(--font-heading)] text-2xl font-semibold">
                Métodos de Pago
              </h2>
              <button
                onClick={() => openPaymentForm()}
                className="w-full sm:w-auto bg-[#ffffff] text-[#0a0a0a] px-6 py-3 text-[0.7rem] uppercase tracking-[2px] font-[family-name:var(--font-heading)] font-semibold transition-all hover:bg-[#d4d4d4] flex items-center justify-center gap-2"
              >
                <span>+</span> Agregar Método
              </button>
            </div>
            {saveMsg && (
              <div
                className={`mb-6 p-4 text-sm border ${saveMsg.includes("Error") ? "bg-red-500/10 border-red-500/30 text-red-400" : "bg-green-500/10 border-green-500/30 text-green-400"}`}
              >
                {saveMsg}
              </div>
            )}
            {showPaymentForm && (
              <div className="bg-[#141414] border border-[#2a2a2a] p-6 mb-6">
                <h3 className="font-[family-name:var(--font-heading)] mb-4">
                  {editingPayment
                    ? "Editar Método de Pago"
                    : "Nuevo Método de Pago"}
                </h3>
                <form onSubmit={handleSavePayment} className="space-y-4">
                  <div>
                    <label className="block text-xs uppercase tracking-[1.5px] text-[#888] mb-2 font-[family-name:var(--font-heading)]">
                      Tipo de Método
                    </label>
                    <select
                      value={paymentForm.tipo}
                      onChange={(e) =>
                        setPaymentForm({ ...paymentForm, tipo: e.target.value })
                      }
                      required
                      className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#2a2a2a] text-[#f5f5f5] text-sm focus:outline-none focus:border-[#888]"
                    >
                      <option value="tarjeta">Tarjeta</option>
                      <option value="paypal">PayPal</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-[1.5px] text-[#888] mb-2 font-[family-name:var(--font-heading)]">
                      Nombre del Método
                    </label>
                    <input
                      type="text"
                      value={paymentForm.nombre}
                      onChange={(e) =>
                        setPaymentForm({
                          ...paymentForm,
                          nombre: e.target.value,
                        })
                      }
                      placeholder="Mi Tarjeta Visa"
                      required
                      className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#2a2a2a] text-[#f5f5f5] text-sm focus:outline-none focus:border-[#888]"
                    />
                  </div>
                  {paymentForm.tipo === "tarjeta" && (
                    <>
                      <div>
                        <label className="block text-xs uppercase tracking-[1.5px] text-[#888] mb-2 font-[family-name:var(--font-heading)]">
                          Número de Tarjeta (Últimos 4 dígitos)
                        </label>
                        <input
                          type="text"
                          value={paymentForm.numero_tarjeta}
                          onChange={(e) =>
                            setPaymentForm({
                              ...paymentForm,
                              numero_tarjeta: e.target.value,
                            })
                          }
                          placeholder="****1234"
                          maxLength={4}
                          className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#2a2a2a] text-[#f5f5f5] text-sm focus:outline-none focus:border-[#888]"
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs uppercase tracking-[1.5px] text-[#888] mb-2 font-[family-name:var(--font-heading)]">
                            Titular
                          </label>
                          <input
                            type="text"
                            value={paymentForm.titular}
                            onChange={(e) =>
                              setPaymentForm({
                                ...paymentForm,
                                titular: e.target.value,
                              })
                            }
                            className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#2a2a2a] text-[#f5f5f5] text-sm focus:outline-none focus:border-[#888]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs uppercase tracking-[1.5px] text-[#888] mb-2 font-[family-name:var(--font-heading)]">
                            Expiración (MM/YY)
                          </label>
                          <input
                            type="text"
                            value={paymentForm.fecha_expiracion}
                            onChange={(e) =>
                              setPaymentForm({
                                ...paymentForm,
                                fecha_expiracion: e.target.value,
                              })
                            }
                            placeholder="12/25"
                            maxLength={5}
                            className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#2a2a2a] text-[#f5f5f5] text-sm focus:outline-none focus:border-[#888]"
                          />
                        </div>
                      </div>
                    </>
                  )}
                  <CustomCheckbox
                    id="es_default"
                    checked={paymentForm.es_default}
                    onChange={(checked) =>
                      setPaymentForm({ ...paymentForm, es_default: checked })
                    }
                    label="Establecer como método predeterminado"
                  />
                  <div className="flex gap-4">
                    <button
                      type="submit"
                      disabled={saving}
                      className="bg-[#ffffff] text-[#0a0a0a] px-8 py-3 text-[0.75rem] uppercase tracking-[2px] font-[family-name:var(--font-heading)] font-semibold transition-all hover:bg-[#d4d4d4] disabled:opacity-50"
                    >
                      {saving
                        ? "Guardando..."
                        : editingPayment
                          ? "Actualizar"
                          : "Guardar"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowPaymentForm(false);
                        setEditingPayment(null);
                      }}
                      className="border border-[#888] text-[#888] px-8 py-3 text-[0.75rem] uppercase tracking-[2px] font-[family-name:var(--font-heading)] transition-all hover:border-white hover:text-white bg-transparent"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            )}
            {metodos_pago && metodos_pago.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {metodos_pago.map((metodo) => (
                  <div
                    key={metodo.id}
                    className="bg-[#141414] border border-[#2a2a2a] p-6 reveal"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-[family-name:var(--font-heading)] text-base">
                        {metodo.nombre}
                      </h4>
                      {metodo.es_default ? (
                        <span className="text-[0.6rem] uppercase tracking-[1.5px] bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5">
                          Predeterminado
                        </span>
                      ) : null}
                    </div>
                    <p className="text-[#888] text-sm capitalize mb-1">
                      {metodo.tipo}
                    </p>
                    {metodo.numero_tarjeta && (
                      <p className="text-[#888] text-sm">
                        ****{metodo.numero_tarjeta}
                      </p>
                    )}
                    {metodo.titular && (
                      <p className="text-[#888] text-sm">{metodo.titular}</p>
                    )}
                    {metodo.fecha_expiracion && (
                      <p className="text-[#888] text-sm">
                        Exp: {metodo.fecha_expiracion}
                      </p>
                    )}
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => openPaymentForm(metodo)}
                        className="text-xs text-[#888] hover:text-white transition-colors"
                      >
                        Editar
                      </button>
                      {!metodo.es_default && (
                        <>
                          <button
                            onClick={() => handleSetDefaultPayment(metodo.id)}
                            className="text-xs text-[#888] hover:text-white transition-colors"
                          >
                            Predeterminar
                          </button>
                          <button
                            onClick={() => handleDeletePayment(metodo.id)}
                            className="text-xs text-red-400 hover:text-red-300 transition-colors"
                          >
                            Eliminar
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-[#141414] border border-[#2a2a2a]">
                <p className="mb-2">No tienes métodos de pago guardados.</p>
                <button
                  onClick={() => openPaymentForm()}
                  className="inline-block bg-[#ffffff] text-[#0a0a0a] px-8 py-3 text-[0.75rem] uppercase tracking-[2px] font-[family-name:var(--font-heading)] font-semibold transition-all hover:bg-[#d4d4d4]"
                >
                  Agregar Método de Pago
                </button>
              </div>
            )}
          </section>
        )}

        {tab === "config" && (
          <section className="max-w-[600px]">
            <h2 className="font-[family-name:var(--font-heading)] text-2xl font-semibold mb-6">
              Configurar Cuenta
            </h2>
            {saveMsg && (
              <div
                className={`mb-6 p-4 text-sm border ${saveMsg.includes("Error") ? "bg-red-500/10 border-red-500/30 text-red-400" : "bg-green-500/10 border-green-500/30 text-green-400"}`}
              >
                {saveMsg}
              </div>
            )}
            <form onSubmit={handleSaveProfile} className="space-y-6">
              <div>
                <label className="block text-xs uppercase tracking-[1.5px] text-[#888] mb-2 font-[family-name:var(--font-heading)]">
                  Nombre
                </label>
                <input
                  type="text"
                  value={profileForm.nombre}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, nombre: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#2a2a2a] text-[#f5f5f5] text-sm focus:outline-none focus:border-[#888]"
                  required
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-[1.5px] text-[#888] mb-2 font-[family-name:var(--font-heading)]">
                  Apellido
                </label>
                <input
                  type="text"
                  value={profileForm.apellido}
                  onChange={(e) =>
                    setProfileForm({
                      ...profileForm,
                      apellido: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#2a2a2a] text-[#f5f5f5] text-sm focus:outline-none focus:border-[#888]"
                  required
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-[1.5px] text-[#888] mb-2 font-[family-name:var(--font-heading)]">
                  Teléfono
                </label>
                <input
                  type="tel"
                  value={profileForm.telefono}
                  onChange={(e) =>
                    setProfileForm({
                      ...profileForm,
                      telefono: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#2a2a2a] text-[#f5f5f5] text-sm focus:outline-none focus:border-[#888]"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-[1.5px] text-[#888] mb-2 font-[family-name:var(--font-heading)]">
                  Correo
                </label>
                <input
                  type="email"
                  value={usuario.correo}
                  disabled
                  className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#2a2a2a] text-[#888] text-sm cursor-not-allowed"
                />
              </div>
              <button
                type="submit"
                disabled={saving}
                className="bg-[#ffffff] text-[#0a0a0a] px-8 py-3 text-[0.75rem] uppercase tracking-[2px] font-[family-name:var(--font-heading)] font-semibold transition-all hover:bg-[#d4d4d4] disabled:opacity-50"
              >
                {saving ? "Guardando..." : "Guardar Cambios"}
              </button>
            </form>
            <div className="mt-12 border-t border-[#2a2a2a] pt-8">
              <button
                onClick={handleLogout}
                className="border border-[#888] text-[#888] px-8 py-3 text-[0.75rem] uppercase tracking-[2px] font-[family-name:var(--font-heading)] transition-all hover:border-white hover:text-white bg-transparent"
              >
                Cerrar Sesión
              </button>
            </div>
          </section>
        )}

        {tab === "ventas" && esVendedor && vendedor && (
          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-[family-name:var(--font-heading)] text-2xl font-semibold">
                Rendimiento de Ventas
              </h2>
              <Link
                href="/designer"
                target="_blank"
                className="inline-block bg-[#ffffff] text-[#0a0a0a] px-6 py-2 text-[0.7rem] uppercase tracking-[2px] font-[family-name:var(--font-heading)] font-semibold transition-all hover:bg-[#d4d4d4]"
              >
                Crear Producto
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
              <div className="bg-[#141414] border border-[#2a2a2a] p-6 reveal">
                <h4 className="text-[#888] mb-2 text-sm">Mis Productos</h4>
                <div className="text-3xl font-semibold">
                  {vendedor.totalProductos}
                </div>
              </div>
              <div className="bg-[#141414] border border-[#2a2a2a] p-6 reveal">
                <h4 className="text-[#888] mb-2 text-sm">Ventas Totales</h4>
                <div className="text-3xl font-semibold">
                  {vendedor.totalVentas}
                </div>
              </div>
              <div className="bg-[#141414] border border-[#2a2a2a] p-6 reveal">
                <h4 className="text-[#888] mb-2 text-sm">Ingresos Totales</h4>
                <div className="text-3xl font-semibold">
                  ${Number(vendedor.ingresosTotales || 0).toFixed(2)}
                </div>
              </div>
            </div>
            {vendedor.topProductos.length > 0 && (
              <div className="bg-[#141414] border border-[#2a2a2a] p-6">
                <h3 className="font-[family-name:var(--font-heading)] mb-4">
                  Top Productos
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-[#2a2a2a]">
                        <th className="text-left p-2 text-xs text-[#888] font-[family-name:var(--font-heading)] uppercase tracking-[1.5px]">
                          Producto
                        </th>
                        <th className="text-right p-2 text-xs text-[#888] font-[family-name:var(--font-heading)] uppercase tracking-[1.5px]">
                          Vendidos
                        </th>
                        <th className="text-right p-2 text-xs text-[#888] font-[family-name:var(--font-heading)] uppercase tracking-[1.5px]">
                          Ingresos
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {vendedor.topProductos.map((prod, i) => (
                        <tr key={i} className="border-b border-[#2a2a2a]">
                          <td className="p-2">{prod.nombre}</td>
                          <td className="p-2 text-right">
                            {prod.total_vendido}
                          </td>
                          <td className="p-2 text-right">
                            ${Number(prod.ingresos || 0).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
