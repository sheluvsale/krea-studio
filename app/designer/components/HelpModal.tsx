"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Keyboard, Lightbulb } from "lucide-react";
import { useDesignerStore } from "../store/designer-store";

export default function HelpModal() {
  const show = useDesignerStore((s) => s.showHelp);
  const setShowHelp = useDesignerStore((s) => s.setShowHelp);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowHelp(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xl"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-lg font-semibold">
                <Keyboard size={20} className="text-[var(--accent)]" />
                Guía de Uso
              </h3>
              <button
                onClick={() => setShowHelp(false)}
                className="rounded-lg p-1 hover:bg-white/10"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="mb-2 flex items-center gap-2 text-sm font-medium text-[var(--accent)]">
                  <Keyboard size={14} /> Atajos de Teclado
                </h4>
                <div className="grid grid-cols-2 gap-1.5 text-xs text-[var(--text-dim)]">
                  {[
                    ["Ctrl+Z", "Deshacer"],
                    ["Ctrl+Y", "Rehacer"],
                    ["Ctrl+D", "Duplicar"],
                    ["Ctrl+S", "Guardar"],
                    ["Ctrl+C/V", "Copiar/Pegar"],
                    ["Delete", "Eliminar"],
                    ["T", "Agregar texto"],
                    ["V", "Herramienta seleccionar"],
                    ["Escape", "Deseleccionar"],
                    ["Flechas", "Mover (Shift=10px)"],
                  ].map(([key, desc]) => (
                    <div key={key} className="flex items-center gap-2">
                      <kbd className="rounded bg-[var(--surface-3)] px-1.5 py-0.5 text-[10px] font-mono text-white">
                        {key}
                      </kbd>
                      <span>{desc}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="mb-2 flex items-center gap-2 text-sm font-medium text-[var(--accent)]">
                  <Lightbulb size={14} /> Consejos
                </h4>
                <ul className="space-y-1 text-xs text-[var(--text-dim)]">
                  <li>• Doble clic en texto para editar</li>
                  <li>• Arrastra imágenes directamente al canvas</li>
                  <li>• Usa múltiples pestañas para diferentes prendas</li>
                  <li>• Exporta en PNG o JPG de alta resolución</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
