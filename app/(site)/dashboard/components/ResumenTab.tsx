"use client";

import Link from "next/link";
import { DashboardData } from "../types";

interface Props {
  data: DashboardData;
}

export default function ResumenTab({ data }: Props) {
  const { usuario, pedidos, direcciones, metodos_pago, vendedor } = data;

  const esVendedor = ["vendedor", "admin"].includes(usuario.rol || "");
  const moneda = "DOP";

  const pedidosEntregados = pedidos.filter(
    (p) => p.estado === "entregado",
  ).length;
  const pedidosPendientes = pedidos.filter(
    (p) => p.estado === "procesando" || p.estado === "enviado",
  ).length;
  const totalGastado = pedidos.reduce(
    (sum, p) => sum + Number(p.total || 0),
    0,
  );

  const formatPrice = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  const stats = [
    {
      label: "Total de pedidos",
      value: pedidos.length.toString(),
      sub: `${pedidosPendientes} pendientes`,
      accent: "#ffffff",
    },
    {
      label: "Pedidos entregados",
      value: pedidosEntregados.toString(),
      sub:
        pedidosEntregados === 1
          ? `1 completado`
          : `${pedidosEntregados} completados`,
      accent: "#22c55e",
    },
    {
      label: "Total gastado",
      value: formatPrice(totalGastado),
      sub: moneda,
      accent: "#3b82f6",
    },
    {
      label: "Direcciones",
      value: direcciones.length.toString(),
      sub: `${metodos_pago?.length || 0} métodos de pago`,
      accent: "#a855f7",
    },
  ];

  return (
    <>
      {/* Métricas principales */}
      <section className="mb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className="relative bg-krea-bg-secondary border border-krea-border p-6 reveal overflow-hidden group hover:border-krea-border transition-colors"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div
                className="absolute top-0 left-0 w-full h-0.5 opacity-60"
                style={{ backgroundColor: s.accent }}
              />
              <p className="text-krea-text-secondary text-xs uppercase tracking-[1.5px] mb-3 font-[family-name:var(--font-heading)]">
                {s.label}
              </p>
              <div className="text-3xl font-semibold tracking-[-0.5px] mb-1">
                {s.value}
              </div>
              <p className="text-krea-text-secondary text-xs">{s.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Grid de contenido */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Pedidos recientes */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-[family-name:var(--font-heading)] text-xl font-semibold tracking-[-0.3px]">
              Pedidos recientes
            </h2>
            <Link
              href="#"
              onClick={(e) => {
                e.preventDefault();
                // @ts-expect-error — parent will switch tab via state
                window.__setDashboardTab?.("pedidos");
              }}
              className="text-xs text-krea-text-secondary hover:text-krea-text transition-colors uppercase tracking-[1.5px]"
            >
              Ver todos
            </Link>
          </div>

          {pedidos.length > 0 ? (
            <div className="bg-krea-bg-secondary border border-krea-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-krea-border">
                      {["Pedido", "Fecha", "Total", "Estado"].map((h) => (
                        <th
                          key={h}
                          className="text-left p-4 font-[family-name:var(--font-heading)] uppercase tracking-[1.5px] text-[0.65rem] text-krea-text-secondary font-medium"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {pedidos.slice(0, 5).map((p) => (
                      <tr
                        key={p.id}
                        className="border-b border-krea-border hover:bg-krea-bg-tertiary transition-colors"
                      >
                        <td className="p-4 font-medium">#{p.numero_pedido}</td>
                        <td className="p-4 text-krea-text-secondary">
                          {new Date(p.creado_en).toLocaleDateString("es-MX", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>
                        <td className="p-4 font-medium">
                          {formatPrice(Number(p.total))}
                        </td>
                        <td className="p-4">
                          <StatusBadge estado={p.estado} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <EmptyState
              title="No tienes pedidos"
              description="Cuando realices tu primera compra, aparecerá aquí."
              action={{ label: "Ver productos", href: "/productos" }}
            />
          )}
        </div>

        {/* Panel lateral */}
        <div className="space-y-8">
          {/* Direcciones rápidas */}
          <div>
            <h2 className="font-[family-name:var(--font-heading)] text-xl font-semibold tracking-[-0.3px] mb-6">
              Direcciones
            </h2>
            {direcciones.length > 0 ? (
              <div className="space-y-3">
                {direcciones.slice(0, 3).map((dir) => (
                  <div
                    key={dir.id}
                    className="bg-krea-bg-secondary border border-krea-border p-5 hover:border-krea-border transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-[family-name:var(--font-heading)] text-sm font-medium">
                        {dir.etiqueta || "Dirección"}
                      </h4>
                      {dir.predeterminada && (
                        <span className="text-[0.6rem] uppercase tracking-[1.5px] bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5">
                          Predeterminada
                        </span>
                      )}
                    </div>
                    <p className="text-krea-text text-sm">
                      {dir.nombre_destinatario}
                    </p>
                    <p className="text-krea-text-secondary text-sm">
                      {dir.linea_1}
                    </p>
                    <p className="text-krea-text-secondary text-xs mt-1">
                      {dir.ciudad}, {dir.estado}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                title="No tienes direcciones guardadas"
                description="Agrega una dirección para poder realizar envíos."
              />
            )}
          </div>

          {/* Métodos de pago */}
          <div>
            <h2 className="font-[family-name:var(--font-heading)] text-xl font-semibold tracking-[-0.3px] mb-6">
              Métodos de pago
            </h2>
            {metodos_pago && metodos_pago.length > 0 ? (
              <div className="space-y-3">
                {metodos_pago.slice(0, 3).map((m) => (
                  <div
                    key={m.id}
                    className="bg-krea-bg-secondary border border-krea-border p-5 flex items-center gap-4 hover:border-krea-border transition-colors"
                  >
                    <div className="w-10 h-10 bg-krea-bg-tertiary border border-krea-border flex items-center justify-center shrink-0">
                      {m.tipo === "tarjeta" ? (
                        <svg
                          className="w-5 h-5 text-krea-text-secondary"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={1.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-5 h-5 text-krea-text-secondary"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={1.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9m-18 0V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m0 18h18"
                          />
                        </svg>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">
                        {m.tipo === "tarjeta"
                          ? m.tipo_tarjeta?.toUpperCase() || "Tarjeta"
                          : "PayPal"}
                      </p>
                      <p className="text-krea-text-secondary text-xs truncate">
                        {m.tipo === "tarjeta"
                          ? m.numero_tarjeta_mask
                          : m.email_paypal}
                      </p>
                    </div>
                    {m.es_default && (
                      <span className="ml-auto text-[0.6rem] uppercase tracking-[1.5px] bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 shrink-0">
                        Predeterminado
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                title="No tienes métodos de pago guardados"
                description="Agrega PayPal como método de pago."
              />
            )}
          </div>
        </div>
      </div>

      {/* Sección de vendedor */}
      {esVendedor && vendedor && (
        <section className="mb-12">
          <h2 className="font-[family-name:var(--font-heading)] text-xl font-semibold tracking-[-0.3px] mb-6">
            Rendimiento de Ventas
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
            {[
              {
                label: "Mis productos",
                value: vendedor.totalProductos.toString(),
                accent: "#ffffff",
              },
              {
                label: "Total de ventas",
                value: vendedor.totalVentas.toString(),
                accent: "#22c55e",
              },
              {
                label: "Ingresos totales",
                value: formatPrice(Number(vendedor?.ingresosTotales || 0)),
                accent: "#3b82f6",
              },
            ].map((s, i) => (
              <div
                key={s.label}
                className="relative bg-krea-bg-secondary border border-krea-border p-6 reveal overflow-hidden"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div
                  className="absolute top-0 left-0 w-full h-0.5 opacity-60"
                  style={{ backgroundColor: s.accent }}
                />
                <p className="text-krea-text-secondary text-xs uppercase tracking-[1.5px] mb-3 font-[family-name:var(--font-heading)]">
                  {s.label}
                </p>
                <div className="text-3xl font-semibold tracking-[-0.5px]">
                  {s.value}
                </div>
              </div>
            ))}
          </div>
          {vendedor.topProductos.length > 0 && (
            <div className="bg-krea-bg-secondary border border-krea-border p-6">
              <h3 className="font-[family-name:var(--font-heading)] text-sm uppercase tracking-[2px] text-krea-text-secondary mb-4">
                Productos más vendidos
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-krea-border">
                      <th className="text-left p-3 text-xs text-krea-text-secondary font-[family-name:var(--font-heading)] uppercase tracking-[1.5px]">
                        Producto
                      </th>
                      <th className="text-right p-3 text-xs text-krea-text-secondary font-[family-name:var(--font-heading)] uppercase tracking-[1.5px]">
                        Vendidos
                      </th>
                      <th className="text-right p-3 text-xs text-krea-text-secondary font-[family-name:var(--font-heading)] uppercase tracking-[1.5px]">
                        Ingresos
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {vendedor.topProductos.map((prod, i) => (
                      <tr
                        key={i}
                        className="border-b border-krea-border hover:bg-krea-bg-tertiary transition-colors"
                      >
                        <td className="p-3">{prod.nombre}</td>
                        <td className="p-3 text-right font-medium">
                          {prod.total_vendido}
                        </td>
                        <td className="p-3 text-right font-medium">
                          {formatPrice(Number(prod.ingresos || 0))}
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
    </>
  );
}

function StatusBadge({ estado }: { estado: string }) {
  const styles: Record<string, string> = {
    entregado: "bg-green-500/10 text-green-400 border-green-500/20",
    enviado: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    procesando: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    cancelado: "bg-red-500/10 text-red-400 border-red-500/20",
    pendiente:
      "bg-krea-bg-tertiary text-krea-text-secondary border-krea-border",
  };
  return (
    <span
      className={`inline-block text-[0.65rem] uppercase tracking-[1.5px] font-semibold px-2.5 py-1 border ${styles[estado] || styles.pendiente}`}
    >
      {estado?.charAt(0).toUpperCase() + estado?.slice(1)}
    </span>
  );
}

function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: { label: string; href: string };
}) {
  return (
    <div className="bg-krea-bg-secondary border border-krea-border p-10 text-center">
      <div className="w-12 h-12 bg-krea-bg-tertiary border border-krea-border flex items-center justify-center mx-auto mb-4">
        <svg
          className="w-5 h-5 text-krea-text-secondary"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
          />
        </svg>
      </div>
      <h3 className="font-[family-name:var(--font-heading)] text-base font-medium mb-1">
        {title}
      </h3>
      <p className="text-krea-text-secondary text-sm mb-4 max-w-sm mx-auto">
        {description}
      </p>
      {action && (
        <Link
          href={action.href}
          className="inline-block bg-foreground text-background px-6 py-2.5 text-[0.7rem] uppercase tracking-[2px] font-[family-name:var(--font-heading)] font-semibold transition-all hover:bg-foreground/90"
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}
