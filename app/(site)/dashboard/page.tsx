"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ResumenTab from "./components/ResumenTab";
import PedidosTab from "./components/PedidosTab";
import VentasTab from "./components/VentasTab";
import ConfiguracionTab from "./components/ConfiguracionTab";
import { DashboardData } from "./types";

function DashboardContent() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"resumen" | "pedidos" | "config" | "ventas">(
    "resumen",
  );

  // Exponer setter para que tabs hijos puedan navegar
  useEffect(() => {
    // @ts-expect-error
    window.__setDashboardTab = (
      t: "resumen" | "pedidos" | "config" | "ventas",
    ) => setTab(t);
    return () => {
      // @ts-expect-error
      delete window.__setDashboardTab;
    };
  }, []);

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
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-krea-bg pt-8 pb-16 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header skeleton */}
          <div className="flex items-center gap-4 mb-10">
            <div className="w-14 h-14 bg-krea-bg-tertiary animate-pulse" />
            <div className="space-y-2">
              <div className="h-5 w-48 bg-krea-bg-tertiary animate-pulse" />
              <div className="h-3 w-24 bg-krea-bg-tertiary animate-pulse" />
            </div>
          </div>
          {/* Tabs skeleton */}
          <div className="flex gap-2 mb-8 border-b border-krea-border pb-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-9 w-24 bg-krea-bg-tertiary animate-pulse"
              />
            ))}
          </div>
          {/* Cards skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-28 bg-krea-bg-secondary border border-krea-border animate-pulse"
              />
            ))}
          </div>
          <div className="h-64 bg-krea-bg-secondary border border-krea-border animate-pulse" />
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { usuario, vendedor } = data;
  const esVendedor = ["vendedor", "admin"].includes(usuario.rol || "");

  const tabs = [
    { key: "resumen" as const, label: "Resumen" },
    { key: "pedidos" as const, label: "Pedidos" },
    { key: "config" as const, label: "Configuración" },
    ...(esVendedor ? [{ key: "ventas" as const, label: "Ventas" }] : []),
  ];

  return (
    <div className="min-h-screen bg-krea-bg pt-8 pb-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Premium Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 reveal">
          <div>
            <h1 className="font-[family-name:var(--font-heading)] text-2xl md:text-3xl font-semibold tracking-[-0.5px] text-krea-text">
              Bienvenido, {usuario.nombre}
            </h1>
            <p className="text-krea-text-secondary text-sm mt-0.5 capitalize flex items-center gap-2">
              <span className="inline-block w-1.5 h-1.5 bg-krea-accent" />
              {usuario.rol}
            </p>
          </div>
          <div className="text-right hidden sm:block">
            <p className="text-xs text-krea-text-secondary uppercase tracking-[1.5px]">
              Miembro desde
            </p>
            <p className="text-sm text-krea-text mt-0.5">
              {usuario.creado_en
                ? new Date(usuario.creado_en).toLocaleDateString("es-MX", {
                    month: "long",
                    year: "numeric",
                  })
                : "-"}
            </p>
          </div>
        </div>

        {/* Main Tabs */}
        <div className="flex gap-2 mb-10 overflow-x-auto pb-1">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-5 py-2.5 text-sm font-[family-name:var(--font-heading)] border transition-all whitespace-nowrap cursor-pointer ${
                tab === t.key
                  ? "bg-foreground text-background border-foreground"
                  : "bg-transparent text-krea-text-secondary border-krea-border hover:border-krea-text-secondary hover:text-krea-text"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="min-h-[400px]">
          {tab === "resumen" && <ResumenTab data={data} />}
          {tab === "pedidos" && (
            <PedidosTab pedidos={data.pedidos} moneda="DOP" />
          )}
          {tab === "config" && (
            <ConfiguracionTab data={data} onUpdate={setData} />
          )}
          {tab === "ventas" && esVendedor && vendedor && (
            <VentasTab vendedor={vendedor} moneda="DOP" />
          )}
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return <DashboardContent />;
}
