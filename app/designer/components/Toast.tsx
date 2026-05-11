"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { useDesignerStore } from "../store/designer-store";

const icons: Record<string, React.ReactNode> = {
  success: <CheckCircle size={16} className="text-green-400" />,
  error: <AlertCircle size={16} className="text-red-400" />,
  warning: <AlertTriangle size={16} className="text-yellow-400" />,
  info: <Info size={16} className="text-blue-400" />,
};

export default function Toast() {
  const toasts = useDesignerStore((s) => s.toasts);

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: 100, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.9 }}
            className="pointer-events-auto flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm shadow-lg"
          >
            {icons[t.type] || icons.info}
            <span>{t.message}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
