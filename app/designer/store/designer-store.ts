import { create } from "zustand";

export type GarmentType = "tshirt" | "hoodie" | "pants" | "tanktop" | "cap";
export type ViewMode = "design" | "preview";
export type SidebarPanel = "properties" | "effects" | "layers";

export interface PrintArea {
  x: number;
  y: number;
  width: number;
  height: number;
  name: string;
}

export interface GarmentTemplate {
  name: string;
  printAreas: Record<string, PrintArea>;
  baseColor: string;
}

export interface LayerItem {
  id: string;
  name: string;
  type: string;
  visible: boolean;
  locked: boolean;
  printArea: string;
}

export interface GarmentTab {
  id: string;
  name: string;
  type: GarmentType;
  canvasJSON: string | null;
  layers: LayerItem[];
}

export const GARMENT_NAMES: Record<GarmentType, string> = {
  tshirt: "Camiseta",
  hoodie: "Hoodie",
  pants: "Pantalón",
  tanktop: "Tank Top",
  cap: "Gorra",
};

export const GARMENT_TEMPLATES: Record<GarmentType, GarmentTemplate> = {
  tshirt: {
    name: "Camiseta",
    printAreas: {
      front: { x: 280, y: 200, width: 240, height: 280, name: "Frente" },
      back: { x: 280, y: 200, width: 240, height: 280, name: "Espalda" },
      leftSleeve: { x: 175, y: 130, width: 70, height: 80, name: "Manga Izq" },
      rightSleeve: { x: 555, y: 130, width: 70, height: 80, name: "Manga Der" },
    },
    baseColor: "#f5f5f5",
  },
  hoodie: {
    name: "Hoodie",
    printAreas: {
      front: { x: 280, y: 230, width: 240, height: 280, name: "Frente" },
      back: { x: 280, y: 230, width: 240, height: 280, name: "Espalda" },
      leftSleeve: { x: 165, y: 180, width: 70, height: 150, name: "Manga Izq" },
      rightSleeve: {
        x: 565,
        y: 180,
        width: 70,
        height: 150,
        name: "Manga Der",
      },
      hood: { x: 300, y: 70, width: 200, height: 90, name: "Capucha" },
    },
    baseColor: "#2c2c2c",
  },
  pants: {
    name: "Pantalón",
    printAreas: {
      leftLeg: { x: 270, y: 280, width: 100, height: 250, name: "Pierna Izq" },
      rightLeg: { x: 420, y: 280, width: 100, height: 250, name: "Pierna Der" },
      back: { x: 310, y: 80, width: 180, height: 150, name: "Trasero" },
    },
    baseColor: "#3a3a3a",
  },
  tanktop: {
    name: "Tank Top",
    printAreas: {
      front: { x: 290, y: 160, width: 220, height: 340, name: "Frente" },
      back: { x: 290, y: 160, width: 220, height: 340, name: "Espalda" },
    },
    baseColor: "#f0f0f0",
  },
  cap: {
    name: "Gorra",
    printAreas: {
      front: { x: 320, y: 170, width: 160, height: 120, name: "Frente" },
      side: { x: 290, y: 300, width: 120, height: 80, name: "Lateral" },
      back: { x: 440, y: 300, width: 120, height: 80, name: "Trasera" },
    },
    baseColor: "#d4a574",
  },
};

let tabCounter = 0;
let toastId = 0;

interface DesignerState {
  showGarmentModal: boolean;
  garmentType: GarmentType;
  currentPrintArea: string;
  tabs: GarmentTab[];
  activeTabId: string | null;
  activeTool: string;
  showGrid: boolean;
  zoom: number;
  viewMode: ViewMode;
  selectedObjectId: string | null;
  selectedObjectType: string | null;
  layers: LayerItem[];
  activePanel: SidebarPanel;
  canUndo: boolean;
  canRedo: boolean;
  toasts: Array<{ id: number; message: string; type: string }>;
  effects: {
    brightness: number;
    contrast: number;
    saturation: number;
    blur: number;
    hue: number;
    noise: number;
    pixelate: number;
    sepia: boolean;
    invert: boolean;
    grayscale: boolean;
  };
  showHelp: boolean;
  propsVersion: number;

  setShowGarmentModal: (show: boolean) => void;
  setGarmentType: (type: GarmentType) => void;
  setCurrentPrintArea: (area: string) => void;
  createTab: (type: GarmentType) => string;
  switchTab: (id: string) => void;
  closeTab: (id: string) => void;
  updateTabState: (id: string, canvasJSON: string, layers: LayerItem[]) => void;
  setActiveTool: (tool: string) => void;
  toggleGrid: () => void;
  setZoom: (zoom: number) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  zoomReset: () => void;
  setViewMode: (mode: ViewMode) => void;
  setActivePanel: (panel: SidebarPanel) => void;
  setSelectedObject: (id: string | null, type: string | null) => void;
  setLayers: (layers: LayerItem[]) => void;
  addLayer: (layer: LayerItem) => void;
  removeLayer: (id: string) => void;
  toggleLayerVisibility: (id: string) => void;
  toggleLayerLock: (id: string) => void;
  setCanUndo: (can: boolean) => void;
  setCanRedo: (can: boolean) => void;
  addToast: (message: string, type?: string) => void;
  removeToast: (id: number) => void;
  setEffects: (effects: Partial<DesignerState["effects"]>) => void;
  resetEffects: () => void;
  setShowHelp: (show: boolean) => void;
  bumpPropsVersion: () => void;
}

export const useDesignerStore = create<DesignerState>((set, get) => ({
  showGarmentModal: true,
  garmentType: "tshirt",
  currentPrintArea: "front",
  tabs: [],
  activeTabId: null,
  activeTool: "select",
  showGrid: true,
  zoom: 100,
  viewMode: "design",
  selectedObjectId: null,
  selectedObjectType: null,
  layers: [],
  activePanel: "properties",
  canUndo: false,
  canRedo: false,
  toasts: [],
  effects: {
    brightness: 0,
    contrast: 0,
    saturation: 0,
    blur: 0,
    hue: 0,
    noise: 0,
    pixelate: 0,
    sepia: false,
    invert: false,
    grayscale: false,
  },
  showHelp: false,
  propsVersion: 0,

  setShowGarmentModal: (show) => set({ showGarmentModal: show }),
  setGarmentType: (type) =>
    set({
      garmentType: type,
      currentPrintArea: Object.keys(GARMENT_TEMPLATES[type].printAreas)[0],
    }),
  setCurrentPrintArea: (area) =>
    set({
      currentPrintArea: area,
      selectedObjectId: null,
      selectedObjectType: null,
    }),

  createTab: (type) => {
    const id = `tab-${++tabCounter}`;
    const name = `${GARMENT_NAMES[type]} ${tabCounter}`;
    const tab: GarmentTab = { id, name, type, canvasJSON: null, layers: [] };
    set((state) => ({
      tabs: [...state.tabs, tab],
      activeTabId: id,
      garmentType: type,
      currentPrintArea: Object.keys(GARMENT_TEMPLATES[type].printAreas)[0],
      showGarmentModal: false,
      layers: [],
      selectedObjectId: null,
      selectedObjectType: null,
    }));
    return id;
  },

  switchTab: (id) => {
    const tab = get().tabs.find((t) => t.id === id);
    if (!tab) return;
    set({
      activeTabId: id,
      garmentType: tab.type,
      currentPrintArea: Object.keys(GARMENT_TEMPLATES[tab.type].printAreas)[0],
      layers: tab.layers,
      selectedObjectId: null,
      selectedObjectType: null,
    });
  },

  closeTab: (id) => {
    const state = get();
    const remaining = state.tabs.filter((t) => t.id !== id);
    if (remaining.length === 0) {
      set({ tabs: [], activeTabId: null, showGarmentModal: true, layers: [] });
    } else if (state.activeTabId === id) {
      const idx = state.tabs.findIndex((t) => t.id === id);
      const nextTab = remaining[Math.min(idx, remaining.length - 1)];
      set({
        tabs: remaining,
        activeTabId: nextTab.id,
        garmentType: nextTab.type,
        layers: nextTab.layers,
      });
    } else {
      set({ tabs: remaining });
    }
  },

  updateTabState: (id, canvasJSON, layers) => {
    set((state) => ({
      tabs: state.tabs.map((t) =>
        t.id === id ? { ...t, canvasJSON, layers } : t,
      ),
    }));
  },

  setActiveTool: (tool) => set({ activeTool: tool }),
  toggleGrid: () => set((s) => ({ showGrid: !s.showGrid })),
  setZoom: (zoom) => set({ zoom: Math.round(zoom) }),
  zoomIn: () => set((s) => ({ zoom: Math.min(Math.round(s.zoom * 1.2), 300) })),
  zoomOut: () => set((s) => ({ zoom: Math.max(Math.round(s.zoom / 1.2), 30) })),
  zoomReset: () => set({ zoom: 100 }),
  setViewMode: (mode) => set({ viewMode: mode }),
  setActivePanel: (panel) => set({ activePanel: panel }),
  setSelectedObject: (id, type) =>
    set({ selectedObjectId: id, selectedObjectType: type }),
  setLayers: (layers) => set({ layers }),
  addLayer: (layer) => set((s) => ({ layers: [layer, ...s.layers] })),
  removeLayer: (id) =>
    set((s) => ({ layers: s.layers.filter((l) => l.id !== id) })),
  toggleLayerVisibility: (id) =>
    set((s) => ({
      layers: s.layers.map((l) =>
        l.id === id ? { ...l, visible: !l.visible } : l,
      ),
    })),
  toggleLayerLock: (id) =>
    set((s) => ({
      layers: s.layers.map((l) =>
        l.id === id ? { ...l, locked: !l.locked } : l,
      ),
    })),
  setCanUndo: (can) => set({ canUndo: can }),
  setCanRedo: (can) => set({ canRedo: can }),

  addToast: (message, type = "info") => {
    const id = ++toastId;
    set((s) => ({ toasts: [...s.toasts, { id, message, type }] }));
    setTimeout(() => get().removeToast(id), 3000);
  },
  removeToast: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),

  setEffects: (effects) =>
    set((s) => ({ effects: { ...s.effects, ...effects } })),
  resetEffects: () =>
    set({
      effects: {
        brightness: 0,
        contrast: 0,
        saturation: 0,
        blur: 0,
        hue: 0,
        noise: 0,
        pixelate: 0,
        sepia: false,
        invert: false,
        grayscale: false,
      },
    }),
  setShowHelp: (show) => set({ showHelp: show }),
  bumpPropsVersion: () => set((s) => ({ propsVersion: s.propsVersion + 1 })),
}));
