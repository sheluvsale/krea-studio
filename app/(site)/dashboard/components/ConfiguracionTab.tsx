"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardData, Direccion, MetodoPago } from "../types";
import ChangePasswordForm from "./ChangePasswordForm";
import CustomCheckbox from "@/app/components/CustomCheckbox";
import {
  PROVINCIAS_RD,
  getCiudadesPorProvincia,
  getCodigoPostalPorProvincia,
} from "@/app/lib/dominican-addresses";

interface Props {
  data: DashboardData;
  onUpdate: (d: DashboardData) => void;
}

type ConfigSection = "perfil" | "seguridad" | "direcciones" | "pagos";

const sections: { key: ConfigSection; label: string }[] = [
  { key: "perfil", label: "Perfil" },
  { key: "seguridad", label: "Seguridad" },
  { key: "direcciones", label: "Direcciones" },
  { key: "pagos", label: "Métodos de Pago" },
];

function detectCardType(num: string): string {
  const n = num.replace(/\s/g, "");
  if (/^4/.test(n)) return "visa";
  if (/^5[1-5]/.test(n)) return "mastercard";
  if (/^3[47]/.test(n)) return "amex";
  return "";
}

function maskCard(num: string): string {
  const n = num.replace(/\s/g, "");
  if (n.length <= 4) return n;
  return "****" + n.slice(-4);
}

export default function ConfiguracionTab({ data, onUpdate }: Props) {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<ConfigSection>("perfil");
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  const { usuario, direcciones, metodos_pago } = data;

  // Profile form
  const [profileForm, setProfileForm] = useState({
    nombre: usuario.nombre || "",
    apellido: usuario.apellido || "",
    telefono: usuario.telefono || "",
  });

  // Sincronizar formulario cuando cambian los datos del usuario
  useEffect(() => {
    setProfileForm({
      nombre: usuario.nombre || "",
      apellido: usuario.apellido || "",
      telefono: usuario.telefono || "",
    });
  }, [usuario.nombre, usuario.apellido, usuario.telefono]);

  // Address
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Direccion | null>(null);
  const [ciudadesDisponibles, setCiudadesDisponibles] = useState<string[]>([]);
  const [addressForm, setAddressForm] = useState({
    etiqueta: "",
    nombre_destinatario: "",
    telefono_destinatario: "",
    pais: "República Dominicana",
    ciudad: "",
    estado: "",
    codigo_postal: "",
    linea_1: "",
    linea_2: "",
    predeterminada: false,
  });

  // Payment
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [editingPayment, setEditingPayment] = useState<MetodoPago | null>(null);
  const [paymentForm, setPaymentForm] = useState({
    tipo: "tarjeta" as "tarjeta" | "paypal",
    nombre: "",
    numero_tarjeta: "",
    titular: "",
    fecha_expiracion: "",
    tipo_tarjeta: "" as string,
    email_paypal: "",
    es_default: false,
  });

  const notify = (msg: string, isError = false) => {
    setSaveMsg(msg);
    setTimeout(() => setSaveMsg(""), 5000);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileForm),
      });
      if (res.ok) {
        const responseData = await res.json();
        notify("Perfil actualizado correctamente");
        // Actualizar datos con los devueltos por el API
        if (responseData.usuario) {
          onUpdate({ ...data, usuario: responseData.usuario });
        }
        // Notificar al header que se actualizó el perfil
        window.dispatchEvent(new Event("profile-updated"));
      } else {
        notify("Error al actualizar el perfil", true);
      }
    } catch {
      notify("Error de conexión", true);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
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
        notify(editingAddress ? "Dirección actualizada" : "Dirección agregada");
        setShowAddressForm(false);
        setEditingAddress(null);
        resetAddressForm();
        const dataRes = await fetch("/api/dashboard");
        if (dataRes.ok) {
          const newData = await dataRes.json();
          onUpdate(newData);
        }
      } else {
        notify("Error al guardar la dirección", true);
      }
    } catch {
      notify("Error de conexión", true);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAddress = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar esta dirección?")) return;
    try {
      const res = await fetch(`/api/addresses/${id}`, { method: "DELETE" });
      if (res.ok) {
        notify("Dirección eliminada");
        onUpdate({
          ...data,
          direcciones: direcciones.filter((d) => d.id !== id),
        });
      } else {
        notify("Error al eliminar la dirección", true);
      }
    } catch {
      notify("Error de conexión", true);
    }
  };

  const handleSetDefaultAddress = async (id: number) => {
    try {
      await fetch(`/api/addresses/${id}/default`, { method: "PUT" });
      const dataRes = await fetch("/api/dashboard");
      if (dataRes.ok) {
        const newData = await dataRes.json();
        onUpdate(newData);
      }
    } catch {
      notify("Error al establecer como predeterminada", true);
    }
  };

  const handleSavePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentForm.tipo === "tarjeta") {
      if (
        !paymentForm.nombre ||
        !paymentForm.titular ||
        !paymentForm.fecha_expiracion ||
        !paymentForm.numero_tarjeta
      ) {
        notify("Por favor completa todos los campos de la tarjeta", true);
        return;
      }
    } else {
      if (!paymentForm.email_paypal) {
        notify("Por favor ingresa tu email de PayPal", true);
        return;
      }
    }
    setSaving(true);
    try {
      const url = editingPayment
        ? `/api/payments/${editingPayment.id}`
        : "/api/payments";
      const method = editingPayment ? "PUT" : "POST";
      const payload = {
        tipo: paymentForm.tipo,
        nombre: paymentForm.nombre,
        numero_tarjeta:
          paymentForm.tipo === "tarjeta" ? paymentForm.numero_tarjeta : null,
        numero_tarjeta_mask:
          paymentForm.tipo === "tarjeta"
            ? maskCard(paymentForm.numero_tarjeta)
            : null,
        titular: paymentForm.tipo === "tarjeta" ? paymentForm.titular : null,
        fecha_expiracion:
          paymentForm.tipo === "tarjeta" ? paymentForm.fecha_expiracion : null,
        tipo_tarjeta:
          paymentForm.tipo === "tarjeta"
            ? detectCardType(paymentForm.numero_tarjeta)
            : null,
        email_paypal:
          paymentForm.tipo === "paypal" ? paymentForm.email_paypal : null,
        es_default: paymentForm.es_default,
      };
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        notify(editingPayment ? "Método actualizado." : "Método agregado.");
        setShowPaymentForm(false);
        setEditingPayment(null);
        resetPaymentForm();
        const dataRes = await fetch("/api/dashboard");
        if (dataRes.ok) {
          const newData = await dataRes.json();
          onUpdate(newData);
        }
      } else {
        const d = await res.json().catch(() => ({}));
        notify(d.error || "Error al guardar el método de pago", true);
      }
    } catch {
      notify("Error de conexión", true);
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePayment = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar este método de pago?")) return;
    try {
      const res = await fetch(`/api/payments/${id}`, { method: "DELETE" });
      if (res.ok) {
        notify("Método de pago eliminado");
        onUpdate({
          ...data,
          metodos_pago: metodos_pago.filter((m) => m.id !== id),
        });
      } else {
        const d = await res.json().catch(() => ({}));
        notify(d.error || "Error al eliminar el método de pago", true);
      }
    } catch {
      notify("Error de conexión", true);
    }
  };

  const handleSetDefaultPayment = async (id: number) => {
    try {
      await fetch(`/api/payments/${id}/default`, { method: "PUT" });
      const dataRes = await fetch("/api/dashboard");
      if (dataRes.ok) {
        const newData = await dataRes.json();
        onUpdate(newData);
      }
    } catch {
      notify("Error al establecer como predeterminada", true);
    }
  };

  const resetAddressForm = () => {
    setAddressForm({
      etiqueta: "",
      nombre_destinatario: "",
      telefono_destinatario: "",
      pais: "República Dominicana",
      ciudad: "",
      estado: "",
      codigo_postal: "",
      linea_1: "",
      linea_2: "",
      predeterminada: false,
    });
  };

  const resetPaymentForm = () => {
    setPaymentForm({
      tipo: "tarjeta",
      nombre: "",
      numero_tarjeta: "",
      titular: "",
      fecha_expiracion: "",
      tipo_tarjeta: "",
      email_paypal: "",
      es_default: false,
    });
  };

  const openAddressForm = (address?: Direccion) => {
    if (address) {
      setEditingAddress(address);
      const ciudades = getCiudadesPorProvincia(address.estado);
      setCiudadesDisponibles(ciudades);
      setAddressForm({
        etiqueta: address.etiqueta || "",
        nombre_destinatario: address.nombre_destinatario,
        telefono_destinatario: address.telefono_destinatario || "",
        pais: address.pais || "República Dominicana",
        ciudad: address.ciudad,
        estado: address.estado,
        codigo_postal: address.codigo_postal,
        linea_1: address.linea_1,
        linea_2: address.linea_2 || "",
        predeterminada: address.predeterminada,
      });
    } else {
      setEditingAddress(null);
      resetAddressForm();
      setCiudadesDisponibles([]);
    }
    setShowAddressForm(true);
  };

  const openPaymentForm = (payment?: MetodoPago) => {
    if (payment) {
      setEditingPayment(payment);
      setPaymentForm({
        tipo: payment.tipo as "tarjeta" | "paypal",
        nombre: payment.nombre,
        numero_tarjeta: payment.numero_tarjeta || "",
        titular: payment.titular || "",
        fecha_expiracion: payment.fecha_expiracion || "",
        tipo_tarjeta: payment.tipo_tarjeta || "",
        email_paypal: payment.email_paypal || "",
        es_default: payment.es_default,
      });
    } else {
      setEditingPayment(null);
      resetPaymentForm();
    }
    setShowPaymentForm(true);
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  };

  const Alert = () =>
    saveMsg ? (
      <div
        className={`mb-6 p-4 text-sm border ${
          saveMsg.includes("Error")
            ? "bg-red-500/10 border-red-500/30 text-red-400"
            : "bg-green-500/10 border-green-500/30 text-green-400"
        }`}
      >
        {saveMsg}
      </div>
    ) : null;

  return (
    <div className="flex flex-col lg:flex-row gap-4">
      {/* Sidebar */}
      <aside className="lg:w-56 flex-shrink-0">
        <nav className="bg-krea-bg-secondary border border-krea-border p-2 sticky top-4">
          {sections.map((s) => (
            <button
              key={s.key}
              onClick={() => {
                setActiveSection(s.key);
                setSaveMsg("");
              }}
              className={`w-full text-left px-3 py-2.5 text-sm font-[family-name:var(--font-heading)] transition-all border-none cursor-pointer ${
                activeSection === s.key
                  ? "bg-krea-bg-tertiary text-krea-text font-medium"
                  : "text-krea-text-secondary hover:text-krea-text hover:bg-krea-bg-tertiary/60"
              }`}
            >
              {s.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {activeSection === "perfil" && (
          <section className="border border-krea-border p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-[family-name:var(--font-heading)] text-xl font-semibold tracking-[-0.3px]">
                Perfil
              </h2>
            </div>
            <Alert />
            <form onSubmit={handleSaveProfile} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-[1.5px] text-krea-text-secondary mb-2 font-[family-name:var(--font-heading)]">
                    Nombre
                  </label>
                  <input
                    type="text"
                    value={profileForm.nombre}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, nombre: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-krea-bg-tertiary border border-krea-border text-krea-text text-sm focus:outline-none focus:border-krea-text-secondary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-[1.5px] text-krea-text-secondary mb-2 font-[family-name:var(--font-heading)]">
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
                    className="w-full px-4 py-3 bg-krea-bg-tertiary border border-krea-border text-krea-text text-sm focus:outline-none focus:border-krea-text-secondary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-[1.5px] text-krea-text-secondary mb-2 font-[family-name:var(--font-heading)]">
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
                    className="w-full px-4 py-3 bg-krea-bg-tertiary border border-krea-border text-krea-text text-sm focus:outline-none focus:border-krea-text-secondary"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs uppercase tracking-[1.5px] text-krea-text-secondary mb-2 font-[family-name:var(--font-heading)]">
                    Email
                  </label>
                  <input
                    type="email"
                    value={usuario.correo}
                    disabled
                    className="w-full px-4 py-3 bg-krea-bg-tertiary border border-krea-border text-krea-text-secondary text-sm cursor-not-allowed"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={saving}
                className="bg-foreground text-background px-6 py-2.5 text-[0.7rem] uppercase tracking-[2px] font-[family-name:var(--font-heading)] font-semibold transition-all hover:bg-foreground/90 disabled:opacity-50"
              >
                {saving ? "Guardando..." : "Guardar cambios"}
              </button>
            </form>
          </section>
        )}

        {activeSection === "seguridad" && (
          <section className="border border-krea-border p-6">
            <h2 className="font-[family-name:var(--font-heading)] text-xl font-semibold tracking-[-0.3px] mb-6">
              Seguridad
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div>
                <h3 className="font-[family-name:var(--font-heading)] text-sm uppercase tracking-[2px] mb-4 text-krea-text-secondary">
                  Cambiar contraseña
                </h3>
                <ChangePasswordForm />
              </div>
              <div>
                <h3 className="font-[family-name:var(--font-heading)] text-sm uppercase tracking-[2px] mb-4 text-krea-text-secondary">
                  Sesión
                </h3>
                <button
                  onClick={handleLogout}
                  className="border border-red-900/40 text-red-400 px-8 py-3 text-[0.75rem] uppercase tracking-[2px] font-[family-name:var(--font-heading)] transition-all hover:border-red-400 hover:text-red-300 bg-transparent"
                >
                  Cerrar sesión
                </button>
              </div>
            </div>
          </section>
        )}

        {activeSection === "direcciones" && (
          <section className="border border-krea-border p-6">
            <h2 className="font-[family-name:var(--font-heading)] text-xl font-semibold tracking-[-0.3px] mb-6">
              Direcciones
            </h2>
            <Alert />
            {showAddressForm && (
              <div className="bg-krea-bg-secondary border border-krea-border p-6 mb-6">
                <h3 className="font-[family-name:var(--font-heading)] mb-4">
                  {editingAddress ? "Editar dirección" : "Nueva dirección"}
                </h3>
                <form onSubmit={handleSaveAddress} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-[1.5px] text-krea-text-secondary mb-2 font-[family-name:var(--font-heading)]">
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
                        placeholder="Ej: Casa, Trabajo"
                        className="w-full px-4 py-3 bg-krea-bg-tertiary border border-krea-border text-krea-text text-sm focus:outline-none focus:border-krea-text-secondary"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-[1.5px] text-krea-text-secondary mb-2 font-[family-name:var(--font-heading)]">
                        Nombre del destinatario *
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
                        className="w-full px-4 py-3 bg-krea-bg-tertiary border border-krea-border text-krea-text text-sm focus:outline-none focus:border-krea-text-secondary"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-[1.5px] text-krea-text-secondary mb-2 font-[family-name:var(--font-heading)]">
                        Provincia *
                      </label>
                      <select
                        value={addressForm.estado}
                        onChange={(e) => {
                          const provincia = e.target.value;
                          const ciudades = getCiudadesPorProvincia(provincia);
                          const cp = getCodigoPostalPorProvincia(provincia);
                          setCiudadesDisponibles(ciudades);
                          setAddressForm({
                            ...addressForm,
                            estado: provincia,
                            ciudad: ciudades[0] || "",
                            codigo_postal: cp,
                          });
                        }}
                        required
                        className="w-full px-4 py-3 bg-krea-bg-tertiary border border-krea-border text-krea-text text-sm focus:outline-none focus:border-krea-text-secondary cursor-pointer"
                      >
                        <option value="">Selecciona una provincia</option>
                        {PROVINCIAS_RD.map((p) => (
                          <option key={p.nombre} value={p.nombre}>
                            {p.nombre}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-[1.5px] text-krea-text-secondary mb-2 font-[family-name:var(--font-heading)]">
                        Ciudad *
                      </label>
                      <select
                        value={addressForm.ciudad}
                        onChange={(e) =>
                          setAddressForm({
                            ...addressForm,
                            ciudad: e.target.value,
                          })
                        }
                        required
                        disabled={ciudadesDisponibles.length === 0}
                        className="w-full px-4 py-3 bg-krea-bg-tertiary border border-krea-border text-krea-text text-sm focus:outline-none focus:border-krea-text-secondary cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <option value="">
                          {ciudadesDisponibles.length > 0
                            ? "Selecciona una ciudad"
                            : "Selecciona una provincia primero"}
                        </option>
                        {ciudadesDisponibles.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-[1.5px] text-krea-text-secondary mb-2 font-[family-name:var(--font-heading)]">
                        Código postal
                      </label>
                      <input
                        type="text"
                        value={addressForm.codigo_postal}
                        readOnly
                        className="w-full px-4 py-3 bg-krea-bg-tertiary border border-krea-border text-krea-text-secondary text-sm cursor-not-allowed"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-[1.5px] text-krea-text-secondary mb-2 font-[family-name:var(--font-heading)]">
                      Línea 1 *
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
                      className="w-full px-4 py-3 bg-krea-bg-tertiary border border-krea-border text-krea-text text-sm focus:outline-none focus:border-krea-text-secondary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-[1.5px] text-krea-text-secondary mb-2 font-[family-name:var(--font-heading)]">
                      Línea 2
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
                      className="w-full px-4 py-3 bg-krea-bg-tertiary border border-krea-border text-krea-text text-sm focus:outline-none focus:border-krea-text-secondary"
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
                    label="Predeterminada"
                  />
                  <div className="flex gap-4">
                    <button
                      type="submit"
                      disabled={saving}
                      className="bg-foreground text-background px-6 py-2.5 text-[0.7rem] uppercase tracking-[2px] font-[family-name:var(--font-heading)] font-semibold transition-all hover:bg-foreground/90 disabled:opacity-50"
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
                        resetAddressForm();
                      }}
                      className="border border-krea-text-secondary text-krea-text-secondary px-8 py-3 text-[0.75rem] uppercase tracking-[2px] font-[family-name:var(--font-heading)] transition-all hover:border-krea-text hover:text-krea-text bg-transparent"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            )}
            {!showAddressForm && (
              <button
                onClick={() => setShowAddressForm(true)}
                className="bg-foreground text-background px-6 py-2.5 text-[0.7rem] uppercase tracking-[2px] font-[family-name:var(--font-heading)] font-semibold transition-all hover:bg-foreground/90"
              >
                Agregar dirección
              </button>
            )}
            {direcciones && direcciones.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
                {direcciones.map((dir) => (
                  <div
                    key={dir.id}
                    className={`bg-krea-bg-secondary border ${
                      dir.predeterminada
                        ? "border-krea-text"
                        : "border-krea-border"
                    } p-6`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-[family-name:var(--font-heading)] text-sm">
                        {dir.etiqueta || "Dirección predeterminada"}
                      </h4>
                      {dir.predeterminada && (
                        <span className="text-[0.65rem] uppercase tracking-[2px] text-krea-text">
                          Predeterminada
                        </span>
                      )}
                    </div>
                    <p className="text-krea-text-secondary text-sm mb-1">
                      {dir.nombre_destinatario}
                    </p>
                    <p className="text-krea-text-secondary text-sm mb-1">
                      {dir.linea_1}
                    </p>
                    {dir.linea_2 && (
                      <p className="text-krea-text-secondary text-sm mb-1">
                        {dir.linea_2}
                      </p>
                    )}
                    <p className="text-krea-text-secondary text-sm mb-1">
                      {dir.ciudad}, {dir.estado}
                    </p>
                    <p className="text-krea-text-secondary text-sm mb-4">
                      {dir.codigo_postal}
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setEditingAddress(dir);
                          setShowAddressForm(true);
                          setAddressForm({
                            etiqueta: dir.etiqueta || "",
                            nombre_destinatario: dir.nombre_destinatario || "",
                            telefono_destinatario:
                              dir.telefono_destinatario || "",
                            pais: dir.pais || "República Dominicana",
                            ciudad: dir.ciudad || "",
                            estado: dir.estado || "",
                            codigo_postal: dir.codigo_postal || "",
                            linea_1: dir.linea_1 || "",
                            linea_2: dir.linea_2 || "",
                            predeterminada: dir.predeterminada || false,
                          });
                          const ciudades = getCiudadesPorProvincia(
                            dir.estado || "",
                          );
                          setCiudadesDisponibles(ciudades);
                        }}
                        className="text-xs text-krea-text-secondary hover:text-krea-text transition-colors"
                      >
                        Editar
                      </button>
                      {!dir.predeterminada && (
                        <>
                          <button
                            onClick={() => handleSetDefaultAddress(dir.id)}
                            className="text-xs text-krea-text-secondary hover:text-krea-text transition-colors"
                          >
                            Establecer como predeterminada
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
              <div className="text-center py-12 bg-krea-bg-secondary border border-krea-border">
                <p className="text-krea-text-secondary mb-2">
                  No tienes direcciones guardadas
                </p>
                <p className="text-krea-text-secondary text-sm">
                  Agrega una dirección para poder realizar envíos
                </p>
              </div>
            )}
          </section>
        )}

        {activeSection === "pagos" && (
          <section className="border border-krea-border p-6">
            <h2 className="font-[family-name:var(--font-heading)] text-xl font-semibold tracking-[-0.3px] mb-6">
              Métodos de Pago
            </h2>
            <Alert />
            {showPaymentForm && (
              <div className="bg-krea-bg-secondary border border-krea-border p-6 mb-6">
                <h3 className="font-[family-name:var(--font-heading)] mb-4">
                  {editingPayment ? "Editar método" : "Nuevo método"}
                </h3>
                <form onSubmit={handleSavePayment} className="space-y-4">
                  <div>
                    <label className="block text-xs uppercase tracking-[1.5px] text-krea-text-secondary mb-2 font-[family-name:var(--font-heading)]">
                      Tipo *
                    </label>
                    <select
                      value={paymentForm.tipo}
                      onChange={(e) =>
                        setPaymentForm({
                          ...paymentForm,
                          tipo: e.target.value as "tarjeta" | "paypal",
                        })
                      }
                      className="w-full px-4 py-3 bg-krea-bg-tertiary border border-krea-border text-krea-text text-sm focus:outline-none focus:border-krea-text-secondary cursor-pointer"
                    >
                      <option value="tarjeta">Tarjeta</option>
                      <option value="paypal">PayPal</option>
                    </select>
                  </div>

                  {paymentForm.tipo === "tarjeta" && (
                    <>
                      <div>
                        <label className="block text-xs uppercase tracking-[1.5px] text-krea-text-secondary mb-2 font-[family-name:var(--font-heading)]">
                          Número de tarjeta *
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
                          placeholder="1234 5678 9012 3456"
                          maxLength={19}
                          className="w-full px-4 py-3 bg-krea-bg-tertiary border border-krea-border text-krea-text text-sm focus:outline-none focus:border-krea-text-secondary"
                        />
                        <p className="text-krea-text-secondary text-xs mt-1">
                          Solo se mostrarán los últimos 4 dígitos
                        </p>
                      </div>

                      <div>
                        <label className="block text-xs uppercase tracking-[1.5px] text-krea-text-secondary mb-2 font-[family-name:var(--font-heading)]">
                          Nombre del titular *
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
                          className="w-full px-4 py-3 bg-krea-bg-tertiary border border-krea-border text-krea-text text-sm focus:outline-none focus:border-krea-text-secondary"
                        />
                      </div>

                      <div>
                        <label className="block text-xs uppercase tracking-[1.5px] text-krea-text-secondary mb-2 font-[family-name:var(--font-heading)]">
                          Fecha de expiración *
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
                          placeholder="MM/YY"
                          maxLength={5}
                          className="w-full px-4 py-3 bg-krea-bg-tertiary border border-krea-border text-krea-text text-sm focus:outline-none focus:border-krea-text-secondary"
                        />
                      </div>
                    </>
                  )}

                  {paymentForm.tipo === "paypal" && (
                    <div>
                      <label className="block text-xs uppercase tracking-[1.5px] text-krea-text-secondary mb-2 font-[family-name:var(--font-heading)]">
                        Email de PayPal *
                      </label>
                      <input
                        type="email"
                        value={paymentForm.email_paypal}
                        onChange={(e) =>
                          setPaymentForm({
                            ...paymentForm,
                            email_paypal: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 bg-krea-bg-tertiary border border-krea-border text-krea-text text-sm focus:outline-none focus:border-krea-text-secondary"
                      />
                    </div>
                  )}

                  <CustomCheckbox
                    id="default_payment"
                    checked={paymentForm.es_default}
                    onChange={(checked) =>
                      setPaymentForm({
                        ...paymentForm,
                        es_default: checked,
                      })
                    }
                    label="Predeterminado"
                  />

                  <div className="flex gap-4">
                    <button
                      type="submit"
                      disabled={saving}
                      className="bg-foreground text-background px-6 py-2.5 text-[0.7rem] uppercase tracking-[2px] font-[family-name:var(--font-heading)] font-semibold transition-all hover:bg-foreground/90 disabled:opacity-50"
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
                        resetPaymentForm();
                      }}
                      className="border border-krea-text-secondary text-krea-text-secondary px-8 py-3 text-[0.75rem] uppercase tracking-[2px] font-[family-name:var(--font-heading)] transition-all hover:border-krea-text hover:text-krea-text bg-transparent"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            )}
            {!showPaymentForm && (
              <button
                onClick={() => setShowPaymentForm(true)}
                className="bg-foreground text-background px-6 py-2.5 text-[0.7rem] uppercase tracking-[2px] font-[family-name:var(--font-heading)] font-semibold transition-all hover:bg-foreground/90"
              >
                Agregar método de pago
              </button>
            )}
            {metodos_pago && metodos_pago.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
                {metodos_pago.map((m) => (
                  <div
                    key={m.id}
                    className={`bg-krea-bg-secondary border ${
                      m.es_default ? "border-krea-text" : "border-krea-border"
                    } p-6`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-[family-name:var(--font-heading)] text-sm">
                        {m.tipo === "tarjeta" ? "Tarjeta" : "PayPal"}
                      </h4>
                      {m.es_default && (
                        <span className="text-[0.65rem] uppercase tracking-[2px] text-krea-text">
                          Predeterminado
                        </span>
                      )}
                    </div>
                    {m.tipo === "tarjeta" && (
                      <p className="text-krea-text-secondary text-sm mb-1">
                        {maskCard(m.numero_tarjeta)}
                      </p>
                    )}
                    {m.tipo === "paypal" && m.email_paypal && (
                      <p className="text-krea-text-secondary text-sm mb-1">
                        {m.email_paypal}
                      </p>
                    )}
                    {m.tipo === "tarjeta" && m.titular && (
                      <p className="text-krea-text-secondary text-sm mb-1">
                        {m.titular}
                      </p>
                    )}
                    {m.tipo === "tarjeta" && m.fecha_expiracion && (
                      <p className="text-krea-text-secondary text-sm">
                        Exp: {m.fecha_expiracion}
                      </p>
                    )}
                    <div className="flex gap-3 mt-4">
                      <button
                        onClick={() => openPaymentForm(m)}
                        className="text-xs text-krea-text-secondary hover:text-krea-text transition-colors"
                      >
                        Editar
                      </button>
                      {!m.es_default && (
                        <>
                          <button
                            onClick={() => handleSetDefaultPayment(m.id)}
                            className="text-xs text-krea-text-secondary hover:text-krea-text transition-colors"
                          >
                            Establecer como predeterminado
                          </button>
                          <button
                            onClick={() => handleDeletePayment(m.id)}
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
              <div className="text-center py-12 bg-krea-bg-secondary border border-krea-border">
                <p className="text-krea-text-secondary mb-2">
                  No tienes métodos de pago guardados
                </p>
                <p className="text-krea-text-secondary text-sm">
                  Puedes agregar PayPal como método de pago
                </p>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
