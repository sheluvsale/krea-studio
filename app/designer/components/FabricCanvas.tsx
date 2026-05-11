"use client";

import { useRef, useEffect, useCallback } from "react";
import { useDesignerStore } from "../store/designer-store";
import { canvasManager } from "../lib/canvas-manager";

export default function FabricCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const initialized = useRef(false);

  const setSelectedObject = useDesignerStore((s) => s.setSelectedObject);
  const setLayers = useDesignerStore((s) => s.setLayers);
  const setCanUndo = useDesignerStore((s) => s.setCanUndo);
  const setCanRedo = useDesignerStore((s) => s.setCanRedo);
  const garmentType = useDesignerStore((s) => s.garmentType);
  const activeTabId = useDesignerStore((s) => s.activeTabId);
  const addToast = useDesignerStore((s) => s.addToast);
  const bumpPropsVersion = useDesignerStore((s) => s.bumpPropsVersion);

  const onLayersChange = useCallback(
    (layers: Parameters<typeof setLayers>[0]) => setLayers(layers),
    [setLayers],
  );
  const onSelectionChange = useCallback(
    (id: string | null, type: string | null) => setSelectedObject(id, type),
    [setSelectedObject],
  );
  const onHistoryChange = useCallback(
    (canUndo: boolean, canRedo: boolean) => {
      setCanUndo(canUndo);
      setCanRedo(canRedo);
    },
    [setCanUndo, setCanRedo],
  );
  const onObjectTransform = useCallback(() => {
    bumpPropsVersion();
  }, [bumpPropsVersion]);

  // Initialize canvas
  useEffect(() => {
    if (!canvasRef.current || initialized.current) return;
    initialized.current = true;
    canvasManager.init(canvasRef.current, {
      onLayersChange,
      onSelectionChange,
      onHistoryChange,
      onObjectTransform,
    });
    return () => {
      canvasManager.dispose();
      initialized.current = false;
    };
  }, [onLayersChange, onSelectionChange, onHistoryChange, onObjectTransform]);

  // When garment type changes (tab switch), redraw background
  useEffect(() => {
    if (!activeTabId) return;
    canvasManager.setGarmentType(garmentType);
  }, [garmentType, activeTabId]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

      if (e.ctrlKey && e.key === "z") {
        e.preventDefault();
        canvasManager.undo();
      }
      if (e.ctrlKey && (e.key === "y" || (e.shiftKey && e.key === "Z"))) {
        e.preventDefault();
        canvasManager.redo();
      }
      if (e.ctrlKey && e.key === "d") {
        e.preventDefault();
        canvasManager.duplicateSelected();
      }
      if (e.ctrlKey && e.key === "s") {
        e.preventDefault();
        addToast("Guardado localmente", "success");
      }
      if (e.key === "Delete" || e.key === "Backspace") {
        e.preventDefault();
        canvasManager.deleteSelected();
      }
      if (e.key === "Escape") {
        canvasManager.canvas?.discardActiveObject();
        canvasManager.canvas?.renderAll();
        setSelectedObject(null, null);
      }
      if (e.key === "t" || e.key === "T") {
        if (!e.ctrlKey) {
          e.preventDefault();
          canvasManager.addText();
        }
      }
      if (e.key === "v" || e.key === "V") {
        if (!e.ctrlKey) {
          e.preventDefault();
          useDesignerStore.getState().setActiveTool("select");
        }
      }

      // Arrow keys nudge
      const obj = canvasManager.canvas?.getActiveObject();
      if (
        obj &&
        ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)
      ) {
        e.preventDefault();
        const step = e.shiftKey ? 10 : 1;
        if (e.key === "ArrowUp") obj.top = (obj.top ?? 0) - step;
        if (e.key === "ArrowDown") obj.top = (obj.top ?? 0) + step;
        if (e.key === "ArrowLeft") obj.left = (obj.left ?? 0) - step;
        if (e.key === "ArrowRight") obj.left = (obj.left ?? 0) + step;
        obj.setCoords();
        canvasManager.canvas?.renderAll();
      }
    };

    const helpHandler = (e: KeyboardEvent) => {
      if (e.key === "F1") {
        e.preventDefault();
        useDesignerStore.getState().setShowHelp(true);
      }
    };

    document.addEventListener("keydown", handler);
    document.addEventListener("keydown", helpHandler);
    return () => {
      document.removeEventListener("keydown", handler);
      document.removeEventListener("keydown", helpHandler);
    };
  }, [addToast, setSelectedObject]);

  // Drop files on canvas
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files.length > 0) {
      Array.from(e.dataTransfer.files).forEach((f) => {
        if (f.type.startsWith("image/")) canvasManager.addImageFile(f);
      });
    }
  };

  return (
    <div
      className="flex flex-1 items-center justify-center overflow-auto bg-[#0d0d0d]"
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      <div className="relative">
        <canvas ref={canvasRef} />
        <div className="mt-2 text-center text-[10px] text-[var(--text-dim)]">
          Doble clic en texto para editar • Delete para eliminar • Ctrl+Z
          deshacer
        </div>
      </div>
    </div>
  );
}
