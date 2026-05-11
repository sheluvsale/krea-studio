"use client";

import { motion } from "framer-motion";
import { Plus, X } from "lucide-react";
import {
  useDesignerStore,
  GARMENT_NAMES,
} from "../store/designer-store";

export default function GarmentTabs() {
  const tabs = useDesignerStore((s) => s.tabs);
  const activeTabId = useDesignerStore((s) => s.activeTabId);
  const switchTab = useDesignerStore((s) => s.switchTab);
  const closeTab = useDesignerStore((s) => s.closeTab);
  const setShowGarmentModal = useDesignerStore((s) => s.setShowGarmentModal);

  if (tabs.length === 0) return null;

  return (
    <div className="flex items-center gap-1 border-b border-[var(--border)] bg-[var(--surface)] px-2">
      {tabs.map((tab) => (
        <motion.button
          key={tab.id}
          layoutId={tab.id}
          onClick={() => switchTab(tab.id)}
          className={`group flex items-center gap-2 rounded-t-lg border-b-2 px-3 py-1.5 text-xs font-medium transition-colors ${
            tab.id === activeTabId
              ? "border-[var(--accent)] bg-[var(--surface-2)] text-white"
              : "border-transparent text-[var(--text-dim)] hover:bg-[var(--surface-2)] hover:text-white"
          }`}
        >
          <span>{GARMENT_NAMES[tab.type]}</span>
          <span className="text-[10px] opacity-50">#{tab.id.split("-")[1]}</span>
          <span
            onClick={(e) => {
              e.stopPropagation();
              closeTab(tab.id);
            }}
            className="ml-1 rounded p-0.5 opacity-0 transition-opacity hover:bg-white/10 group-hover:opacity-100"
          >
            <X size={12} />
          </span>
        </motion.button>
      ))}
      <button
        onClick={() => setShowGarmentModal(true)}
        className="ml-1 flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-[var(--text-dim)] transition-colors hover:bg-[var(--surface-2)] hover:text-white"
      >
        <Plus size={14} />
        Nueva
      </button>
    </div>
  );
}
