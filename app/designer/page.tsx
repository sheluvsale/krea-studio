"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useDesignerStore } from "./store/designer-store";
import GarmentSelector from "./components/GarmentSelector";
import GarmentTabs from "./components/GarmentTabs";
import Toolbar from "./components/Toolbar";
import ToolsSidebar from "./components/ToolsSidebar";
import FabricCanvas from "./components/FabricCanvas";
import PropertiesSidebar from "./components/PropertiesSidebar";
import HelpModal from "./components/HelpModal";
import Toast from "./components/Toast";

const ThreePreview = dynamic(() => import("./components/ThreePreview"), {
  ssr: false,
  loading: () => (
    <div className="flex flex-1 items-center justify-center bg-[#0d0d0d] text-[var(--text-dim)]">
      Cargando vista 3D...
    </div>
  ),
});

export default function DesignerPage() {
  const viewMode = useDesignerStore((s) => s.viewMode);
  const activeTabId = useDesignerStore((s) => s.activeTabId);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (isMobile) {
    return (
      <div className="fixed inset-0 bg-[#0a0a0a] text-white flex flex-col items-center justify-center p-8 text-center z-[9999]">
        <div className="w-20 h-20 mb-6 rounded-2xl bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center">
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-[#888]"
          >
            <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
            <path d="M12 18h.01" />
          </svg>
        </div>
        <h1 className="font-[family-name:var(--font-heading)] text-xl font-semibold mb-3">
          Diseñador no disponible
        </h1>
        <p className="text-[#888] text-sm max-w-[280px] leading-relaxed">
          El diseñador de prendas solo está disponible en{" "}
          <strong className="text-white">tabletas</strong> y{" "}
          <strong className="text-white">computadoras</strong>. Por favor accede
          desde un dispositivo con pantalla más grande.
        </p>
        <a
          href="/"
          className="mt-8 inline-block bg-white text-black px-8 py-3 text-xs uppercase tracking-[2px] font-[family-name:var(--font-heading)] font-semibold transition-all hover:bg-[#d4d4d4]"
        >
          Volver al Inicio
        </a>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      {/* Garment Selection Modal */}
      <GarmentSelector />
      <HelpModal />
      <Toast />

      {activeTabId && (
        <>
          {/* Garment Tabs */}
          <GarmentTabs />

          {/* Toolbar */}
          <Toolbar />

          {/* Main workspace */}
          <div className="flex flex-1 overflow-hidden">
            {/* Left sidebar - Tools */}
            {viewMode === "design" && <ToolsSidebar />}

            {/* Canvas / 3D Preview */}
            {viewMode === "design" ? <FabricCanvas /> : <ThreePreview />}

            {/* Right sidebar - Properties */}
            {viewMode === "design" && <PropertiesSidebar />}
          </div>
        </>
      )}
    </div>
  );
}
