"use client";

import Link from "next/link";
import { VendedorData } from "../types";

interface Props {
  vendedor: VendedorData;
  moneda: string;
}

export default function VentasTab({ vendedor, moneda }: Props) {
  const formatPrice = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  const stats = [
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
      value: formatPrice(Number(vendedor.ingresosTotales || 0)),
      accent: "#3b82f6",
    },
  ];

  return (
    <section>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="font-[family-name:var(--font-heading)] text-xl font-semibold tracking-[-0.3px]">
            Rendimiento de ventas
          </h2>
          <p className="text-krea-text-secondary text-xs uppercase tracking-[1.5px] mt-1">
            Resumen de tu desempeño como vendedor
          </p>
        </div>
        <Link
          href="/designer"
          target="_blank"
          className="inline-block bg-foreground text-background px-6 py-2.5 text-[0.7rem] uppercase tracking-[2px] font-[family-name:var(--font-heading)] font-semibold transition-all hover:bg-foreground/90 shrink-0"
        >
          Crear producto
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
        {stats.map((s, i) => (
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

      {vendedor.topProductos.length > 0 ? (
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
      ) : (
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
                strokeLinecap="butt"
                strokeLinejoin="miter"
                d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
              />
            </svg>
          </div>
          <h3 className="font-[family-name:var(--font-heading)] text-base font-medium mb-1">
            No hay ventas aún
          </h3>
          <p className="text-krea-text-secondary text-sm max-w-sm mx-auto">
            Cuando tengas tu primera venta, aparecerá aquí.
          </p>
        </div>
      )}
    </section>
  );
}
