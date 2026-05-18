"use client";

import { useState } from "react";
import { X, Ruler, Truck, RotateCcw } from "lucide-react";

type ModalType = "size" | "shipping" | "returns" | null;

interface Section {
  subtitle: string;
  description?: string;
  table?: {
    headers: string[];
    rows: string[][];
  };
  items?: string[];
}

interface ModalData {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  content: Section[];
}

interface HelpModalsProps {
  isOpen: boolean;
  onClose: () => void;
  type: ModalType;
}

const sizeGuideData = {
  title: "Guía de Tallas",
  icon: Ruler,
  content: [
    {
      subtitle: "CAMISETAS",
      description:
        "Nuestras camisetas tienen un corte moderno y ligeramente ajustado.",
      table: {
        headers: ["Talla", "Pecho (cm)", "Largo (cm)"],
        rows: [
          ["S", "48", "68"],
          ["M", "50", "70"],
          ["L", "52", "72"],
          ["XL", "54", "74"],
        ],
      },
    },
    {
      subtitle: "HOODIES & SUDADERAS",
      description:
        "Corte oversize relaxed. Si prefieres ajustado, considera una talla menos.",
      table: {
        headers: ["Talla", "Pecho (cm)", "Largo (cm)"],
        rows: [
          ["S", "54", "66"],
          ["M", "56", "68"],
          ["L", "58", "70"],
          ["XL", "60", "72"],
        ],
      },
    },
    {
      subtitle: "CONSEJOS",
      items: [
        "Medidas tomidas con prenda plana",
        "Para oversize fit: elige tu talla habitual",
        "Para fitted look: considera una talla menos",
        "Las prendas 100% algodón pueden encoger ligeramente",
      ],
    },
  ],
};

const shippingData = {
  title: "Envíos",
  icon: Truck,
  content: [
    {
      subtitle: "ZONAS DE ENVÍO",
      description:
        "Realizamos envíos a todo el territorio dominicano y próximamente internacional.",
      table: undefined,
      items: undefined,
    },
    {
      subtitle: "TIPOS DE ENVÍO",
      description: undefined,
      table: undefined,
      items: [
        "Envío Estándar (2-5 días hábiles): Gratis en compras +RD$3,000",
        "Envío Express (1-2 días hábiles): RD$250",
        "Envío Same-Day (Santo Domingo): RD$350",
      ],
    },
    {
      subtitle: "PROCESAMIENTO",
      description: undefined,
      table: undefined,
      items: [
        "Los pedidos se procesan en 24-48 horas hábiles",
        "Recibirás correo de confirmación con tracking",
        "Puedes rastrear tu pedido en tu dashboard",
      ],
    },
    {
      subtitle: "IMPORTANTE",
      description:
        "Los tiempos de entrega son estimados y pueden variar por zona o temporada alta. No realizamos envíos los fines de semana ni días feriados.",
      table: undefined,
      items: undefined,
    },
  ],
};

const returnsData = {
  title: "Devoluciones",
  icon: RotateCcw,
  content: [
    {
      subtitle: "POLÍTICA GENERAL",
      description:
        "Aceptamos devoluciones dentro de los 15 días posteriores a la recepción.",
      table: undefined,
      items: undefined,
    },
    {
      subtitle: "CONDICIONES",
      description: undefined,
      table: undefined,
      items: [
        "La prenda debe estar sin usar y con etiquetas originales",
        "No se aceptan prendas personalizadas ni en oferta final",
        "El cliente cubre el costo de envío de retorno",
        "Se procesa reembolso en 5-7 días hábiles",
      ],
    },
    {
      subtitle: "PROCESO",
      description: undefined,
      table: undefined,
      items: [
        "Inicia la solicitud desde tu dashboard",
        "Empaqueta la prenda en su estado original",
        "Envía a nuestra dirección de retorno",
        "Recibirás confirmación por email",
      ],
    },
    {
      subtitle: "CAMBIOS",
      description:
        "Los cambios de talla están sujetos a disponibilidad. El cliente debe cubrir el envío de retorno y el nuevo envío.",
      table: undefined,
      items: undefined,
    },
  ],
};

const modalData: Record<Exclude<ModalType, null>, ModalData> = {
  size: sizeGuideData,
  shipping: shippingData,
  returns: returnsData,
};

export default function HelpModals({ isOpen, onClose, type }: HelpModalsProps) {
  if (!isOpen || !type) return null;

  const data = modalData[type];
  const Icon = data.icon;

  return (
    <div className="fixed inset-0 z-[10001] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-[#141414] border border-[#2a2a2a] w-full max-w-2xl max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-[#141414] border-b border-[#2a2a2a] p-6 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center">
              <Icon className="w-5 h-5 text-white" />
            </div>
            <h2 className="font-[family-name:var(--font-heading)] text-xl font-semibold tracking-[-0.5px]">
              {data.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center text-[#888] hover:text-white transition-colors border border-transparent hover:border-[#2a2a2a]"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {data.content.map((section, index) => (
            <div key={index} className="space-y-4">
              <h3 className="font-[family-name:var(--font-heading)] text-sm uppercase tracking-[2px] text-[#888]">
                {section.subtitle}
              </h3>

              {section.description && (
                <p className="text-[#d4d4d4] text-sm leading-relaxed">
                  {section.description}
                </p>
              )}

              {section.table && (
                <div className="border border-[#2a2a2a] overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-[#1a1a1a]">
                      <tr>
                        {section.table.headers.map(
                          (header: string, i: number) => (
                            <th
                              key={i}
                              className="text-left p-3 text-xs uppercase tracking-[1.5px] text-[#888] font-[family-name:var(--font-heading)]"
                            >
                              {header}
                            </th>
                          ),
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {section.table.rows.map((row: string[], i: number) => (
                        <tr key={i} className="border-t border-[#2a2a2a]">
                          {row.map((cell: string, j: number) => (
                            <td
                              key={j}
                              className={`p-3 ${j === 0 ? "font-medium text-white" : "text-[#888]"}`}
                            >
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {section.items && (
                <ul className="space-y-2">
                  {section.items.map((item: string, i: number) => (
                    <li
                      key={i}
                      className="text-[#d4d4d4] text-sm leading-relaxed flex items-start gap-3"
                    >
                      <span className="w-1 h-1 bg-white mt-2 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              )}

              {index < data.content.length - 1 && (
                <div className="h-px bg-[#2a2a2a] mt-8" />
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-[#141414] border-t border-[#2a2a2a] p-6">
          <button
            onClick={onClose}
            className="w-full bg-[#ffffff] text-[#0a0a0a] py-3 text-[0.75rem] uppercase tracking-[2px] font-[family-name:var(--font-heading)] font-semibold transition-all hover:bg-[#d4d4d4]"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}

// Hook for using the help modals
export function useHelpModals() {
  const [modalType, setModalType] = useState<ModalType>(null);

  const openModal = (type: Exclude<ModalType, null>) => setModalType(type);
  const closeModal = () => setModalType(null);

  return {
    modalType,
    isOpen: modalType !== null,
    openModal,
    closeModal,
    HelpModalsComponent: () => (
      <HelpModals
        isOpen={modalType !== null}
        onClose={closeModal}
        type={modalType}
      />
    ),
  };
}
