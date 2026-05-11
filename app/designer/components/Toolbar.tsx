"use client";

import {
  Undo2,
  Redo2,
  Grid3X3,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Trash2,
  Save,
  HelpCircle,
  Eye,
  LayoutDashboard,
  Download,
  FileDown,
  Image as ImageIcon,
  ChevronDown,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useDesignerStore, GARMENT_TEMPLATES } from "../store/designer-store";
import { canvasManager } from "../lib/canvas-manager";

export default function Toolbar() {
  const garmentType = useDesignerStore((s) => s.garmentType);
  const currentPrintArea = useDesignerStore((s) => s.currentPrintArea);
  const setCurrentPrintArea = useDesignerStore((s) => s.setCurrentPrintArea);
  const showGrid = useDesignerStore((s) => s.showGrid);
  const toggleGrid = useDesignerStore((s) => s.toggleGrid);
  const zoom = useDesignerStore((s) => s.zoom);
  const zoomIn = useDesignerStore((s) => s.zoomIn);
  const zoomOut = useDesignerStore((s) => s.zoomOut);
  const zoomReset = useDesignerStore((s) => s.zoomReset);
  const viewMode = useDesignerStore((s) => s.viewMode);
  const setViewMode = useDesignerStore((s) => s.setViewMode);
  const canUndo = useDesignerStore((s) => s.canUndo);
  const canRedo = useDesignerStore((s) => s.canRedo);
  const setShowHelp = useDesignerStore((s) => s.setShowHelp);
  const addToast = useDesignerStore((s) => s.addToast);

  const [exportOpen, setExportOpen] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (exportRef.current && !exportRef.current.contains(e.target as Node))
        setExportOpen(false);
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  const template = GARMENT_TEMPLATES[garmentType];
  const printAreas = Object.entries(template.printAreas);

  const handlePrintAreaChange = (area: string) => {
    setCurrentPrintArea(area);
    canvasManager.setPrintArea(area);
  };

  const handleToggleGrid = () => {
    toggleGrid();
    canvasManager.setShowGrid(!showGrid);
  };

  const handleZoomIn = () => {
    zoomIn();
    canvasManager.setZoom(useDesignerStore.getState().zoom);
  };
  const handleZoomOut = () => {
    zoomOut();
    canvasManager.setZoom(useDesignerStore.getState().zoom);
  };
  const handleZoomReset = () => {
    zoomReset();
    canvasManager.setZoom(100);
  };

  const handleClear = () => {
    if (confirm("¿Estás seguro de que quieres limpiar todo el diseño?")) {
      canvasManager.clearCanvas();
      addToast("Canvas limpiado", "info");
    }
  };

  const handleExport = (format: "png" | "jpg") => {
    const dataURL = canvasManager.exportAs(format);
    if (dataURL) {
      const link = document.createElement("a");
      link.download = `krea-design-${Date.now()}.${format}`;
      link.href = dataURL;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      addToast(`Exportado como ${format.toUpperCase()}`, "success");
    }
    setExportOpen(false);
  };

  const handleExportProject = () => {
    const data = canvasManager.exportProject();
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `diseno_${Date.now()}.krea`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    addToast("Proyecto guardado", "success");
    setExportOpen(false);
  };

  const Btn = ({
    children,
    onClick,
    title,
    active,
    disabled,
    danger,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    title?: string;
    active?: boolean;
    disabled?: boolean;
    danger?: boolean;
  }) => (
    <button
      onClick={onClick}
      title={title}
      disabled={disabled}
      className={`rounded-lg p-1.5 transition-colors ${
        active
          ? "bg-[var(--accent)] text-white"
          : danger
            ? "text-[var(--text-dim)] hover:bg-red-500/20 hover:text-red-400"
            : "text-[var(--text-dim)] hover:bg-white/10 hover:text-white"
      } ${disabled ? "cursor-not-allowed opacity-30" : ""}`}
    >
      {children}
    </button>
  );

  const Divider = () => <div className="mx-1 h-6 w-px bg-[var(--border)]" />;

  return (
    <header className="flex items-center justify-between border-b border-[var(--border)] bg-[var(--surface)] px-3 py-1.5">
      {/* Left */}
      <div className="flex items-center gap-2">
        <img src="/images/logo.png" alt="Krea" className="h-5 w-auto" />
        <Divider />
        <select
          value={currentPrintArea}
          onChange={(e) => handlePrintAreaChange(e.target.value)}
          className="rounded-md border border-[var(--border)] bg-[var(--surface-2)] px-2 py-1 text-xs text-white outline-none"
        >
          {printAreas.map(([id, area]) => (
            <option key={id} value={id}>
              {area.name}
            </option>
          ))}
        </select>
      </div>

      {/* Center */}
      <div className="flex items-center gap-1">
        <Btn
          onClick={() => canvasManager.undo()}
          title="Deshacer (Ctrl+Z)"
          disabled={!canUndo}
        >
          <Undo2 size={16} />
        </Btn>
        <Btn
          onClick={() => canvasManager.redo()}
          title="Rehacer (Ctrl+Y)"
          disabled={!canRedo}
        >
          <Redo2 size={16} />
        </Btn>
        <Divider />
        <Btn onClick={handleToggleGrid} title="Grid" active={showGrid}>
          <Grid3X3 size={16} />
        </Btn>
        <div className="flex items-center gap-0.5">
          <Btn onClick={handleZoomOut} title="Alejar">
            <ZoomOut size={16} />
          </Btn>
          <span className="w-10 text-center text-xs text-[var(--text-dim)]">
            {zoom}%
          </span>
          <Btn onClick={handleZoomIn} title="Acercar">
            <ZoomIn size={16} />
          </Btn>
          <Btn onClick={handleZoomReset} title="Reset zoom">
            <RotateCcw size={14} />
          </Btn>
        </div>
        <Divider />
        <Btn
          onClick={() => setViewMode("design")}
          title="Vista Diseño"
          active={viewMode === "design"}
        >
          <LayoutDashboard size={16} />
        </Btn>
        <Btn
          onClick={() => setViewMode("preview")}
          title="Vista Previa 3D"
          active={viewMode === "preview"}
        >
          <Eye size={16} />
        </Btn>
      </div>

      {/* Right */}
      <div className="flex items-center gap-1">
        <Btn onClick={handleClear} title="Limpiar" danger>
          <Trash2 size={16} />
        </Btn>
        <Btn
          onClick={() => addToast("Guardado localmente", "success")}
          title="Guardar (Ctrl+S)"
        >
          <Save size={16} />
        </Btn>
        <Btn onClick={() => setShowHelp(true)} title="Ayuda (F1)">
          <HelpCircle size={16} />
        </Btn>
        <Divider />
        <div ref={exportRef} className="relative">
          <button
            onClick={() => setExportOpen(!exportOpen)}
            className="flex items-center gap-1.5 rounded-lg bg-[var(--accent)] px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-[var(--accent-hover)]"
          >
            <Download size={14} />
            Exportar
            <ChevronDown size={12} />
          </button>
          {exportOpen && (
            <div className="absolute right-0 top-full z-[200] mt-1 w-48 overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--surface)] shadow-2xl">
              <button
                onClick={() => handleExport("png")}
                className="flex w-full items-center gap-2 px-3 py-2 text-xs text-white hover:bg-white/10"
              >
                <ImageIcon size={14} /> PNG (Estándar)
              </button>
              <button
                onClick={() => handleExport("jpg")}
                className="flex w-full items-center gap-2 px-3 py-2 text-xs text-white hover:bg-white/10"
              >
                <ImageIcon size={14} /> JPG (Comprimido)
              </button>
              <button
                onClick={handleExportProject}
                className="flex w-full items-center gap-2 border-t border-[var(--border)] px-3 py-2 text-xs text-white hover:bg-white/10"
              >
                <FileDown size={14} /> Guardar proyecto (.krea)
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
