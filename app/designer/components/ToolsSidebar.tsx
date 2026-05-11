"use client";

import {
  MousePointer2,
  Type,
  Square,
  Circle,
  Triangle,
  Star,
  Heart,
  Minus,
  ArrowRight,
  Upload,
  Link2,
  Frame,
  CircleDot,
  Flag,
} from "lucide-react";
import { useRef } from "react";
import { useDesignerStore } from "../store/designer-store";
import { canvasManager } from "../lib/canvas-manager";

interface ToolBtn {
  icon: React.ReactNode;
  label: string;
  action: () => void;
  tool?: string;
}

export default function ToolsSidebar() {
  const activeTool = useDesignerStore((s) => s.activeTool);
  const setActiveTool = useDesignerStore((s) => s.setActiveTool);
  const addToast = useDesignerStore((s) => s.addToast);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (files: FileList | null) => {
    if (!files) return;
    Array.from(files).forEach((file) => {
      if (file.type.startsWith("image/")) {
        canvasManager.addImageFile(file);
        addToast("Imagen cargada", "success");
      }
    });
  };

  const handleImageUrl = () => {
    const url = prompt("Ingresa la URL de la imagen:");
    if (url) {
      canvasManager.addImageFromUrl(url);
      addToast("Cargando imagen...", "info");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleImageUpload(e.dataTransfer.files);
  };

  const groups: { title: string; items: ToolBtn[] }[] = [
    {
      title: "Herramientas",
      items: [
        {
          icon: <MousePointer2 size={18} />,
          label: "Seleccionar",
          action: () => setActiveTool("select"),
          tool: "select",
        },
        {
          icon: <Type size={18} />,
          label: "Texto",
          action: () => {
            canvasManager.addText();
            setActiveTool("select");
          },
        },
      ],
    },
    {
      title: "Formas",
      items: [
        { icon: <Square size={18} />, label: "Rectángulo", action: () => canvasManager.addRect() },
        { icon: <Circle size={18} />, label: "Círculo", action: () => canvasManager.addCircle() },
        { icon: <Triangle size={18} />, label: "Triángulo", action: () => canvasManager.addTriangle() },
        { icon: <Star size={18} />, label: "Estrella", action: () => canvasManager.addStar() },
        { icon: <Heart size={18} />, label: "Corazón", action: () => canvasManager.addHeart() },
        { icon: <Minus size={18} />, label: "Línea", action: () => canvasManager.addLine() },
        { icon: <ArrowRight size={18} />, label: "Flecha", action: () => canvasManager.addArrow() },
      ],
    },
    {
      title: "Emojis",
      items: [
        { icon: <span className="text-base">🔥</span>, label: "Fuego", action: () => canvasManager.addEmoji("🔥", "Fuego") },
        { icon: <span className="text-base">🚀</span>, label: "Cohete", action: () => canvasManager.addEmoji("🚀", "Cohete") },
        { icon: <span className="text-base">👑</span>, label: "Corona", action: () => canvasManager.addEmoji("👑", "Corona") },
        { icon: <span className="text-base">💀</span>, label: "Calavera", action: () => canvasManager.addEmoji("💀", "Calavera") },
        { icon: <span className="text-base">⚡</span>, label: "Rayo", action: () => canvasManager.addEmoji("⚡", "Rayo") },
        { icon: <span className="text-base">💎</span>, label: "Diamante", action: () => canvasManager.addEmoji("💎", "Diamante") },
      ],
    },
    {
      title: "Marcos",
      items: [
        { icon: <Frame size={18} />, label: "Marco Rect", action: () => canvasManager.addFrameRect() },
        { icon: <CircleDot size={18} />, label: "Marco Circ", action: () => canvasManager.addFrameCircle() },
        { icon: <Flag size={18} />, label: "Banner", action: () => canvasManager.addBanner() },
      ],
    },
  ];

  return (
    <aside className="flex w-48 shrink-0 flex-col gap-1 overflow-y-auto border-r border-[var(--border)] bg-[var(--surface)] p-2">
      {/* Image upload */}
      <div className="mb-1">
        <p className="mb-1.5 px-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--text-dim)]">
          Imágenes
        </p>
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => fileInputRef.current?.click()}
          className="flex cursor-pointer flex-col items-center gap-1 rounded-lg border border-dashed border-[var(--border)] bg-[var(--surface-2)] p-3 text-center transition-colors hover:border-[var(--accent)] hover:bg-[var(--surface-3)]"
        >
          <Upload size={20} className="text-[var(--text-dim)]" />
          <span className="text-[10px] text-[var(--text-dim)]">
            Subir o arrastrar
          </span>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={(e) => handleImageUpload(e.target.files)}
          />
        </div>
        <button
          onClick={handleImageUrl}
          className="mt-1 flex w-full items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs text-[var(--text-dim)] transition-colors hover:bg-[var(--surface-2)] hover:text-white"
        >
          <Link2 size={14} /> Desde URL
        </button>
      </div>

      {groups.map((group) => (
        <div key={group.title} className="mb-1">
          <p className="mb-1 px-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--text-dim)]">
            {group.title}
          </p>
          <div className="grid grid-cols-2 gap-1">
            {group.items.map((item) => (
              <button
                key={item.label}
                onClick={item.action}
                className={`flex flex-col items-center gap-1 rounded-lg p-2 text-[10px] transition-colors ${
                  item.tool && item.tool === activeTool
                    ? "bg-[var(--accent)] text-white"
                    : "text-[var(--text-dim)] hover:bg-[var(--surface-2)] hover:text-white"
                }`}
              >
                {item.icon}
                <span className="truncate">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </aside>
  );
}
