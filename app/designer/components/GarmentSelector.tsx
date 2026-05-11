"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Shirt, X } from "lucide-react";
import {
  useDesignerStore,
  GARMENT_NAMES,
  type GarmentType,
} from "../store/designer-store";

const GARMENTS: { type: GarmentType; icon: string }[] = [
  { type: "tshirt", icon: "👕" },
  { type: "hoodie", icon: "🧥" },
  { type: "pants", icon: "👖" },
  { type: "tanktop", icon: "🎽" },
  { type: "cap", icon: "🧢" },
];

export default function GarmentSelector() {
  const show = useDesignerStore((s) => s.showGarmentModal);
  const createTab = useDesignerStore((s) => s.createTab);
  const tabs = useDesignerStore((s) => s.tabs);
  const setShowGarmentModal = useDesignerStore((s) => s.setShowGarmentModal);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 shadow-2xl"
          >
            {tabs.length > 0 && (
              <button
                onClick={() => setShowGarmentModal(false)}
                className="absolute right-4 top-4 rounded-lg p-1 text-[var(--text-dim)] hover:bg-white/10 hover:text-white"
              >
                <X size={20} />
              </button>
            )}
            <div className="mb-2 flex items-center gap-3">
              <Shirt className="text-[var(--accent)]" size={28} />
              <h2 className="text-xl font-semibold">
                Selecciona el tipo de prenda
              </h2>
            </div>
            <p className="mb-6 text-sm text-[var(--text-dim)]">
              Elige la prenda que deseas diseñar.
            </p>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
              {GARMENTS.map((g) => (
                <motion.button
                  key={g.type}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => createTab(g.type)}
                  className="flex flex-col items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-4 transition-colors hover:border-[var(--accent)] hover:bg-[var(--surface-3)]"
                >
                  <span className="text-3xl">{g.icon}</span>
                  <span className="text-xs font-medium">
                    {GARMENT_NAMES[g.type]}
                  </span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
