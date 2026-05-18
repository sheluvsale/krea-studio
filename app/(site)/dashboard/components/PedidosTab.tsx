"use client";

import Link from "next/link";
import { Pedido } from "../types";

interface Props {
  pedidos: Pedido[];
  moneda: string;
}

const statusStyles: Record<string, string> = {
  entregado: "bg-green-500/10 text-green-400 border-green-500/20",
  enviado: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  procesando: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  cancelado: "bg-red-500/10 text-red-400 border-red-500/20",
  pendiente: "bg-krea-bg-tertiary text-krea-text-secondary border-krea-border",
};

export default function PedidosTab({ pedidos, moneda }: Props) {
  const formatPrice = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };
  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-[family-name:var(--font-heading)] text-xl font-semibold tracking-[-0.3px]">
          Mis pedidos
        </h2>
        <p className="text-krea-text-secondary text-xs uppercase tracking-[1.5px]">
          {pedidos.length} {pedidos.length === 1 ? "pedido" : "pedidos"}
        </p>
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
                {pedidos.map((p) => (
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
                      <span
                        className={`inline-block text-[0.65rem] uppercase tracking-[1.5px] font-semibold px-2.5 py-1 border ${
                          statusStyles[p.estado] || statusStyles.pendiente
                        }`}
                      >
                        {p.estado?.charAt(0).toUpperCase() + p.estado?.slice(1)}
                      </span>
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
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
              />
            </svg>
          </div>
          <h3 className="font-[family-name:var(--font-heading)] text-base font-medium mb-1">
            No tienes pedidos
          </h3>
          <p className="text-krea-text-secondary text-sm mb-4 max-w-sm mx-auto">
            Cuando realices tu primera compra, aparecerá aquí.
          </p>
          <Link
            href="/productos"
            className="inline-block bg-foreground text-background px-6 py-2.5 text-[0.7rem] uppercase tracking-[2px] font-[family-name:var(--font-heading)] font-semibold transition-all hover:bg-foreground/90"
          >
            Ver productos
          </Link>
        </div>
      )}
    </section>
  );
}
