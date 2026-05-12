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
import MobileWarning from "@/components/MobileWarning";

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

  return (
    <>
      <MobileWarning />
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
    </>
  );
}
