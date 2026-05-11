"use client";

import {
  Copy,
  ArrowUpToLine,
  ArrowDownToLine,
  Trash2,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Layers,
  Box,
  Sparkles,
} from "lucide-react";
import { useDesignerStore, type SidebarPanel } from "../store/designer-store";
import { canvasManager } from "../lib/canvas-manager";

const COLORS = [
  "#000000",
  "#ffffff",
  "#ef4444",
  "#22c55e",
  "#3b82f6",
  "#eab308",
  "#a855f7",
  "#ec4899",
  "#f97316",
];

export default function PropertiesSidebar() {
  const activePanel = useDesignerStore((s) => s.activePanel);
  const setActivePanel = useDesignerStore((s) => s.setActivePanel);
  const selectedObjectId = useDesignerStore((s) => s.selectedObjectId);
  const selectedObjectType = useDesignerStore((s) => s.selectedObjectType);
  const layers = useDesignerStore((s) => s.layers);
  const toggleLayerVisibility = useDesignerStore(
    (s) => s.toggleLayerVisibility,
  );
  const toggleLayerLock = useDesignerStore((s) => s.toggleLayerLock);
  const effects = useDesignerStore((s) => s.effects);
  const setEffects = useDesignerStore((s) => s.setEffects);
  const resetEffects = useDesignerStore((s) => s.resetEffects);
  const propsVersion = useDesignerStore((s) => s.propsVersion);

  const tabs: { id: SidebarPanel; label: string; icon: React.ReactNode }[] = [
    { id: "properties", label: "Propiedades", icon: <Box size={14} /> },
    { id: "effects", label: "Efectos", icon: <Sparkles size={14} /> },
    { id: "layers", label: "Capas", icon: <Layers size={14} /> },
  ];

  return (
    <aside className="flex w-64 shrink-0 flex-col border-l border-[var(--border)] bg-[var(--surface)]">
      {/* Tabs */}
      <div className="flex border-b border-[var(--border)]">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActivePanel(tab.id)}
            className={`flex flex-1 items-center justify-center gap-1.5 py-2 text-[10px] font-medium transition-colors ${
              activePanel === tab.id
                ? "border-b-2 border-[var(--accent)] text-white"
                : "text-[var(--text-dim)] hover:text-white"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        {activePanel === "properties" && (
          <PropertiesPanel
            selectedId={selectedObjectId}
            selectedType={selectedObjectType}
            propsVersion={propsVersion}
          />
        )}
        {activePanel === "effects" && (
          <EffectsPanel
            selectedType={selectedObjectType}
            effects={effects}
            setEffects={setEffects}
            resetEffects={resetEffects}
          />
        )}
        {activePanel === "layers" && (
          <LayersPanel
            layers={layers}
            selectedId={selectedObjectId}
            toggleVisibility={toggleLayerVisibility}
            toggleLock={toggleLayerLock}
          />
        )}
      </div>
    </aside>
  );
}

function PropertiesPanel({
  selectedId,
  selectedType,
}: {
  selectedId: string | null;
  selectedType: string | null;
  propsVersion?: number;
}) {
  if (!selectedId) {
    return (
      <div className="flex flex-col items-center gap-3 py-12 text-center text-[var(--text-dim)]">
        <Box size={40} strokeWidth={1} />
        <p className="text-xs">
          Selecciona un elemento para editar sus propiedades
        </p>
      </div>
    );
  }

  const obj = canvasManager.getSelectedObject();
  if (!obj) return null;

  const x = Math.round(obj.left ?? 0);
  const y = Math.round(obj.top ?? 0);
  const rot = Math.round(obj.angle ?? 0);

  return (
    <div className="space-y-4">
      {/* Info */}
      <div>
        <div className="mb-2 flex items-center gap-2">
          <span className="rounded bg-[var(--accent)]/20 px-2 py-0.5 text-[10px] font-medium text-[var(--accent)]">
            {selectedType}
          </span>
        </div>
      </div>

      {/* Position */}
      <Section title="Posición y Transformación">
        <div className="grid grid-cols-2 gap-2">
          <PropInput
            label="X"
            value={x}
            onChange={(v) =>
              canvasManager.updateSelectedPropertyAndSave("left", v)
            }
          />
          <PropInput
            label="Y"
            value={y}
            onChange={(v) =>
              canvasManager.updateSelectedPropertyAndSave("top", v)
            }
          />
        </div>
        <div className="mt-2">
          <label className="mb-1 block text-[10px] text-[var(--text-dim)]">
            Rotación: {rot}°
          </label>
          <input
            type="range"
            min={0}
            max={360}
            value={rot}
            onChange={(e) =>
              canvasManager.updateSelectedPropertyAndSave(
                "angle",
                Number(e.target.value),
              )
            }
          />
        </div>
      </Section>

      {/* Colors - for shapes and text */}
      {(selectedType === "rect" ||
        selectedType === "circle" ||
        selectedType === "triangle" ||
        selectedType === "path" ||
        selectedType === "group") && (
        <Section title="Apariencia">
          <label className="mb-1 block text-[10px] text-[var(--text-dim)]">
            Color de relleno
          </label>
          <div className="flex flex-wrap gap-1">
            {COLORS.map((c) => (
              <button
                key={c}
                onClick={() =>
                  canvasManager.updateSelectedPropertyAndSave("fill", c)
                }
                className="h-6 w-6 rounded border border-[var(--border)]"
                style={{ backgroundColor: c }}
              />
            ))}
            <input
              type="color"
              defaultValue={(obj.fill as string) || "#3b82f6"}
              onChange={(e) =>
                canvasManager.updateSelectedPropertyAndSave(
                  "fill",
                  e.target.value,
                )
              }
            />
          </div>
        </Section>
      )}

      {/* Text properties */}
      {selectedType === "textbox" && (
        <Section title="Texto">
          <label className="mb-1 block text-[10px] text-[var(--text-dim)]">
            Fuente
          </label>
          <select
            defaultValue={(obj.get("fontFamily") as string) || "Arial"}
            onChange={(e) =>
              canvasManager.updateSelectedPropertyAndSave(
                "fontFamily",
                e.target.value,
              )
            }
            className="mb-2 w-full rounded border border-[var(--border)] bg-[var(--surface-2)] px-2 py-1 text-xs text-white"
          >
            {[
              "Arial",
              "Helvetica",
              "Times New Roman",
              "Georgia",
              "Verdana",
              "Impact",
              "Comic Sans MS",
            ].map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
          <label className="mb-1 block text-[10px] text-[var(--text-dim)]">
            Tamaño: {Math.round((obj.get("fontSize") as number) || 24)}px
          </label>
          <input
            type="range"
            min={8}
            max={120}
            value={(obj.get("fontSize") as number) || 24}
            onChange={(e) =>
              canvasManager.updateSelectedPropertyAndSave(
                "fontSize",
                Number(e.target.value),
              )
            }
          />
          <label className="mt-2 mb-1 block text-[10px] text-[var(--text-dim)]">
            Color
          </label>
          <div className="flex flex-wrap gap-1">
            {COLORS.map((c) => (
              <button
                key={c}
                onClick={() =>
                  canvasManager.updateSelectedPropertyAndSave("fill", c)
                }
                className="h-6 w-6 rounded border border-[var(--border)]"
                style={{ backgroundColor: c }}
              />
            ))}
            <input
              type="color"
              defaultValue={(obj.fill as string) || "#000000"}
              onChange={(e) =>
                canvasManager.updateSelectedPropertyAndSave(
                  "fill",
                  e.target.value,
                )
              }
            />
          </div>
        </Section>
      )}

      {/* Actions */}
      <Section title="Acciones">
        <div className="grid grid-cols-2 gap-1.5">
          <ActionBtn
            icon={<Copy size={12} />}
            label="Duplicar"
            onClick={() => canvasManager.duplicateSelected()}
          />
          <ActionBtn
            icon={<ArrowUpToLine size={12} />}
            label="Frente"
            onClick={() => canvasManager.bringToFront()}
          />
          <ActionBtn
            icon={<ArrowDownToLine size={12} />}
            label="Atrás"
            onClick={() => canvasManager.sendToBack()}
          />
          <ActionBtn
            icon={<Trash2 size={12} />}
            label="Eliminar"
            onClick={() => canvasManager.deleteSelected()}
            danger
          />
        </div>
      </Section>
    </div>
  );
}

function EffectsPanel({
  selectedType,
  effects,
  setEffects,
  resetEffects,
}: {
  selectedType: string | null;
  effects: ReturnType<typeof useDesignerStore.getState>["effects"];
  setEffects: ReturnType<typeof useDesignerStore.getState>["setEffects"];
  resetEffects: ReturnType<typeof useDesignerStore.getState>["resetEffects"];
}) {
  if (selectedType !== "image") {
    return (
      <div className="flex flex-col items-center gap-3 py-12 text-center text-[var(--text-dim)]">
        <Sparkles size={40} strokeWidth={1} />
        <p className="text-xs">Selecciona una imagen para aplicar efectos</p>
      </div>
    );
  }

  const sliders: {
    label: string;
    key: keyof typeof effects;
    min: number;
    max: number;
  }[] = [
    { label: "Brillo", key: "brightness", min: -100, max: 100 },
    { label: "Contraste", key: "contrast", min: -100, max: 100 },
    { label: "Saturación", key: "saturation", min: -100, max: 100 },
    { label: "Desenfoque", key: "blur", min: 0, max: 40 },
    { label: "Tono (Hue)", key: "hue", min: 0, max: 360 },
    { label: "Ruido", key: "noise", min: 0, max: 100 },
    { label: "Pixelar", key: "pixelate", min: 0, max: 20 },
  ];

  return (
    <div className="space-y-3">
      {sliders.map((s) => (
        <div key={s.key}>
          <label className="mb-1 flex items-center justify-between text-[10px] text-[var(--text-dim)]">
            <span>{s.label}</span>
            <span>{effects[s.key] as number}</span>
          </label>
          <input
            type="range"
            min={s.min}
            max={s.max}
            value={effects[s.key] as number}
            onChange={(e) => setEffects({ [s.key]: Number(e.target.value) })}
          />
        </div>
      ))}
      <div className="space-y-2 border-t border-[var(--border)] pt-2">
        {(["sepia", "invert", "grayscale"] as const).map((key) => (
          <label
            key={key}
            className="flex items-center gap-2 text-xs text-[var(--text-dim)]"
          >
            <input
              type="checkbox"
              checked={effects[key] as boolean}
              onChange={(e) => setEffects({ [key]: e.target.checked })}
              className="rounded"
            />
            <span className="capitalize">
              {key === "sepia"
                ? "Sepia"
                : key === "invert"
                  ? "Invertir"
                  : "Escala de grises"}
            </span>
          </label>
        ))}
      </div>
      <button
        onClick={resetEffects}
        className="w-full rounded-lg border border-[var(--border)] py-1.5 text-xs text-[var(--text-dim)] transition-colors hover:bg-[var(--surface-2)] hover:text-white"
      >
        Restablecer efectos
      </button>
    </div>
  );
}

function LayersPanel({
  layers,
  selectedId,
  toggleVisibility,
  toggleLock,
}: {
  layers: ReturnType<typeof useDesignerStore.getState>["layers"];
  selectedId: string | null;
  toggleVisibility: (id: string) => void;
  toggleLock: (id: string) => void;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-medium">Capas</span>
        <span className="rounded bg-[var(--surface-2)] px-1.5 py-0.5 text-[10px] text-[var(--text-dim)]">
          {layers.length}
        </span>
      </div>
      {layers.length === 0 ? (
        <p className="py-8 text-center text-xs text-[var(--text-dim)]">
          Sin capas aún
        </p>
      ) : (
        <div className="space-y-0.5">
          {layers.map((layer) => (
            <div
              key={layer.id}
              onClick={() => canvasManager.selectLayerById(layer.id)}
              className={`flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs transition-colors cursor-pointer ${
                layer.id === selectedId
                  ? "bg-[var(--accent)]/20 text-white"
                  : "text-[var(--text-dim)] hover:bg-[var(--surface-2)]"
              }`}
            >
              <span className="flex-1 truncate">{layer.name}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleLock(layer.id);
                  canvasManager.setLayerLock(layer.id, !layer.locked);
                }}
                className="p-0.5 opacity-60 hover:opacity-100"
              >
                {layer.locked ? <Lock size={12} /> : <Unlock size={12} />}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleVisibility(layer.id);
                  canvasManager.setLayerVisibility(layer.id, !layer.visible);
                }}
                className="p-0.5 opacity-60 hover:opacity-100"
              >
                {layer.visible ? <Eye size={12} /> : <EyeOff size={12} />}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  canvasManager.removeLayerById(layer.id);
                }}
                className="p-0.5 opacity-60 hover:opacity-100 hover:text-red-400"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Helper Components ────────────────────────────────
function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h4 className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-[var(--text-dim)]">
        {title}
      </h4>
      {children}
    </div>
  );
}

function PropInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <label className="mb-0.5 block text-[10px] text-[var(--text-dim)]">
        {label}
      </label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full rounded border border-[var(--border)] bg-[var(--surface-2)] px-2 py-1 text-xs text-white outline-none focus:border-[var(--accent)]"
      />
    </div>
  );
}

function ActionBtn({
  icon,
  label,
  onClick,
  danger,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-lg border border-[var(--border)] px-2 py-1.5 text-[10px] transition-colors ${
        danger
          ? "text-red-400 hover:bg-red-500/10"
          : "text-[var(--text-dim)] hover:bg-[var(--surface-2)] hover:text-white"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
