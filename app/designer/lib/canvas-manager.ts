import {
  Canvas,
  Rect,
  Circle,
  Triangle,
  Textbox,
  FabricImage,
  Line,
  Path,
  Group,
  type FabricObject,
} from "fabric";
import {
  GARMENT_TEMPLATES,
  type GarmentType,
  type PrintArea,
  type LayerItem,
} from "../store/designer-store";

const CANVAS_W = 800;
const CANVAS_H = 700;

interface HistoryEntry {
  json: string;
  layers: LayerItem[];
}

class CanvasManager {
  canvas: Canvas | null = null;
  private garmentType: GarmentType = "tshirt";
  private currentPrintArea = "front";
  private showGrid = true;
  private gridObjects: FabricObject[] = [];
  private garmentObjects: FabricObject[] = [];
  private printAreaObjects: FabricObject[] = [];
  private history: HistoryEntry[] = [];
  private historyIndex = -1;
  private maxHistory = 50;
  private layerIdCounter = 1;
  private onLayersChange?: (layers: LayerItem[]) => void;
  private onSelectionChange?: (id: string | null, type: string | null) => void;
  private onHistoryChange?: (canUndo: boolean, canRedo: boolean) => void;
  private onObjectTransform?: () => void;
  private layers: LayerItem[] = [];
  private saving = false;

  init(
    el: HTMLCanvasElement,
    callbacks: {
      onLayersChange: (layers: LayerItem[]) => void;
      onSelectionChange: (id: string | null, type: string | null) => void;
      onHistoryChange: (canUndo: boolean, canRedo: boolean) => void;
      onObjectTransform?: () => void;
    },
  ) {
    this.canvas = new Canvas(el, {
      width: CANVAS_W,
      height: CANVAS_H,
      backgroundColor: "#111",
      selection: true,
      preserveObjectStacking: true,
    });
    this.onLayersChange = callbacks.onLayersChange;
    this.onSelectionChange = callbacks.onSelectionChange;
    this.onHistoryChange = callbacks.onHistoryChange;
    this.onObjectTransform = callbacks.onObjectTransform;
    this.setupEvents();
    this.drawBackground();
    this.saveState();
  }

  dispose() {
    if (this.canvas) {
      this.canvas.dispose();
      this.canvas = null;
    }
    this.history = [];
    this.historyIndex = -1;
    this.layers = [];
    this.gridObjects = [];
    this.garmentObjects = [];
    this.printAreaObjects = [];
  }

  private setupEvents() {
    if (!this.canvas) return;
    this.canvas.on("selection:created", (e) => {
      const obj = e.selected?.[0];
      if (obj && !this.isBackground(obj)) {
        this.onSelectionChange?.(obj.get("id") as string, obj.type ?? null);
      }
    });
    this.canvas.on("selection:updated", (e) => {
      const obj = e.selected?.[0];
      if (obj && !this.isBackground(obj)) {
        this.onSelectionChange?.(obj.get("id") as string, obj.type ?? null);
      }
    });
    this.canvas.on("selection:cleared", () => {
      this.onSelectionChange?.(null, null);
    });
    this.canvas.on("object:modified", () => this.saveState());
    this.canvas.on("object:moving", () => this.onObjectTransform?.());
    this.canvas.on("object:scaling", () => this.onObjectTransform?.());
    this.canvas.on("object:rotating", () => this.onObjectTransform?.());
  }

  private isBackground(obj: FabricObject): boolean {
    return !!(
      obj.get("isGrid") ||
      obj.get("isGarment") ||
      obj.get("isPrintArea")
    );
  }

  // ─── Background Drawing ────────────────────────────
  drawBackground() {
    this.clearBackground();
    this.drawGarmentShape();
    this.drawPrintAreas();
    if (this.showGrid) this.drawGrid();
    this.canvas?.renderAll();
  }

  private clearBackground() {
    const c = this.canvas;
    if (!c) return;
    [
      ...this.gridObjects,
      ...this.garmentObjects,
      ...this.printAreaObjects,
    ].forEach((o) => c.remove(o));
    this.gridObjects = [];
    this.garmentObjects = [];
    this.printAreaObjects = [];
  }

  setGarmentType(type: GarmentType) {
    this.garmentType = type;
    this.currentPrintArea = Object.keys(GARMENT_TEMPLATES[type].printAreas)[0];
    this.drawBackground();
  }

  setPrintArea(area: string) {
    this.currentPrintArea = area;
    this.refreshPrintAreas();
  }

  setShowGrid(show: boolean) {
    this.showGrid = show;
    const c = this.canvas;
    if (!c) return;
    this.gridObjects.forEach((o) => c.remove(o));
    this.gridObjects = [];
    if (show) this.drawGrid();
    c.renderAll();
  }

  private drawGrid() {
    const c = this.canvas;
    if (!c) return;
    const step = 20;
    const color = "rgba(100,116,139,0.15)";
    const majorColor = "rgba(100,116,139,0.3)";
    for (let x = 0; x <= CANVAS_W; x += step) {
      const isMajor = x % (step * 5) === 0;
      const line = new Line([x, 0, x, CANVAS_H], {
        stroke: isMajor ? majorColor : color,
        strokeWidth: isMajor ? 1 : 0.5,
        selectable: false,
        evented: false,
        excludeFromExport: true,
      });
      line.set("isGrid", true);
      c.add(line);
      c.sendObjectToBack(line);
      this.gridObjects.push(line);
    }
    for (let y = 0; y <= CANVAS_H; y += step) {
      const isMajor = y % (step * 5) === 0;
      const line = new Line([0, y, CANVAS_W, y], {
        stroke: isMajor ? majorColor : color,
        strokeWidth: isMajor ? 1 : 0.5,
        selectable: false,
        evented: false,
        excludeFromExport: true,
      });
      line.set("isGrid", true);
      c.add(line);
      c.sendObjectToBack(line);
      this.gridObjects.push(line);
    }
    // Center cross
    const cx = new Line([CANVAS_W / 2, 0, CANVAS_W / 2, CANVAS_H], {
      stroke: "rgba(59,130,246,0.25)",
      strokeWidth: 1,
      strokeDashArray: [5, 5],
      selectable: false,
      evented: false,
      excludeFromExport: true,
    });
    cx.set("isGrid", true);
    const cy = new Line([0, CANVAS_H / 2, CANVAS_W, CANVAS_H / 2], {
      stroke: "rgba(59,130,246,0.25)",
      strokeWidth: 1,
      strokeDashArray: [5, 5],
      selectable: false,
      evented: false,
      excludeFromExport: true,
    });
    cy.set("isGrid", true);
    c.add(cx, cy);
    c.sendObjectToBack(cx);
    c.sendObjectToBack(cy);
    this.gridObjects.push(cx, cy);
  }

  private drawGarmentShape() {
    const c = this.canvas;
    if (!c) return;
    const t = GARMENT_TEMPLATES[this.garmentType];
    const baseColor = t.baseColor;
    const paths = this.getGarmentPaths();
    paths.forEach((d) => {
      const p = new Path(d, {
        fill: baseColor,
        stroke: this.adjustBrightness(baseColor, -30),
        strokeWidth: 2,
        opacity: 0.25,
        selectable: false,
        evented: false,
        excludeFromExport: true,
      });
      p.set("isGarment", true);
      c.add(p);
      c.sendObjectToBack(p);
      this.garmentObjects.push(p);
    });
  }

  private getGarmentPaths(): string[] {
    switch (this.garmentType) {
      case "tshirt":
        return [
          "M300 50 Q400 80 500 50 L580 100 L640 180 L580 200 L580 550 L220 550 L220 200 L160 180 L220 100 Z",
        ];
      case "hoodie":
        return [
          "M280 20 Q400 0 520 20 L540 60 L580 100 L650 200 L580 220 L580 580 L220 580 L220 220 L150 200 L220 100 L260 60 Z",
        ];
      case "pants":
        return [
          "M250 50 L550 50 L540 250 L520 600 L440 600 L420 350 Q400 300 380 350 L360 600 L280 600 L260 250 Z",
        ];
      case "tanktop":
        return [
          "M300 50 Q400 80 500 50 L550 80 L560 150 L550 580 L250 580 L240 150 L250 80 Z",
        ];
      case "cap":
        return [
          "M280 320 Q280 120 400 120 Q520 120 520 320 Z",
          "M280 300 Q200 350 180 400 Q300 420 520 340 Q500 310 520 300 Z",
        ];
      default:
        return [];
    }
  }

  private drawPrintAreas() {
    const c = this.canvas;
    if (!c) return;
    const t = GARMENT_TEMPLATES[this.garmentType];
    Object.entries(t.printAreas).forEach(([id, area]) => {
      const isActive = id === this.currentPrintArea;
      const rect = new Rect({
        left: area.x,
        top: area.y,
        width: area.width,
        height: area.height,
        fill: isActive ? "rgba(255,255,255,0.04)" : "transparent",
        stroke: isActive ? "#3b82f6" : "rgba(255,255,255,0.12)",
        strokeWidth: isActive ? 2 : 1,
        strokeDashArray: isActive ? undefined : [5, 5],
        selectable: false,
        evented: false,
        excludeFromExport: true,
      });
      rect.set("isPrintArea", true);
      rect.set("areaId", id);
      c.add(rect);
      c.sendObjectToBack(rect);
      this.printAreaObjects.push(rect);
    });
  }

  private refreshPrintAreas() {
    const c = this.canvas;
    if (!c) return;
    this.printAreaObjects.forEach((o) => c.remove(o));
    this.printAreaObjects = [];
    this.drawPrintAreas();
    c.renderAll();
  }

  private adjustBrightness(color: string, percent: number): string {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.min(255, Math.max(0, (num >> 16) + amt));
    const G = Math.min(255, Math.max(0, ((num >> 8) & 0xff) + amt));
    const B = Math.min(255, Math.max(0, (num & 0xff) + amt));
    return `#${((1 << 24) + (R << 16) + (G << 8) + B).toString(16).slice(1)}`;
  }

  // ─── Get Current Print Area ────────────────────────
  private getArea(): PrintArea | null {
    return (
      GARMENT_TEMPLATES[this.garmentType]?.printAreas[this.currentPrintArea] ??
      null
    );
  }

  // ─── Add Elements ──────────────────────────────────
  addText() {
    const c = this.canvas;
    const area = this.getArea();
    if (!c || !area) return;
    const id = `obj-${this.layerIdCounter++}`;
    const text = new Textbox("Doble clic para editar", {
      left: area.x + area.width / 2 - 80,
      top: area.y + area.height / 2 - 12,
      width: 200,
      fontSize: 24,
      fontFamily: "Arial",
      fill: "#000000",
      editable: true,
    });
    text.set("id", id);
    text.set("printArea", this.currentPrintArea);
    c.add(text);
    c.setActiveObject(text);
    this.pushLayer(id, "Texto", "textbox");
    this.saveState();
    c.renderAll();
  }

  addRect() {
    const c = this.canvas;
    const area = this.getArea();
    if (!c || !area) return;
    const id = `obj-${this.layerIdCounter++}`;
    const rect = new Rect({
      left: area.x + area.width / 2 - 50,
      top: area.y + area.height / 2 - 50,
      width: 100,
      height: 100,
      fill: "#3b82f6",
      stroke: "#1d4ed8",
      strokeWidth: 0,
    });
    rect.set("id", id);
    rect.set("printArea", this.currentPrintArea);
    c.add(rect);
    c.setActiveObject(rect);
    this.pushLayer(id, "Rectángulo", "rect");
    this.saveState();
    c.renderAll();
  }

  addCircle() {
    const c = this.canvas;
    const area = this.getArea();
    if (!c || !area) return;
    const id = `obj-${this.layerIdCounter++}`;
    const circle = new Circle({
      left: area.x + area.width / 2 - 50,
      top: area.y + area.height / 2 - 50,
      radius: 50,
      fill: "#3b82f6",
      stroke: "#1d4ed8",
      strokeWidth: 0,
    });
    circle.set("id", id);
    circle.set("printArea", this.currentPrintArea);
    c.add(circle);
    c.setActiveObject(circle);
    this.pushLayer(id, "Círculo", "circle");
    this.saveState();
    c.renderAll();
  }

  addTriangle() {
    const c = this.canvas;
    const area = this.getArea();
    if (!c || !area) return;
    const id = `obj-${this.layerIdCounter++}`;
    const tri = new Triangle({
      left: area.x + area.width / 2 - 50,
      top: area.y + area.height / 2 - 50,
      width: 100,
      height: 100,
      fill: "#3b82f6",
    });
    tri.set("id", id);
    tri.set("printArea", this.currentPrintArea);
    c.add(tri);
    c.setActiveObject(tri);
    this.pushLayer(id, "Triángulo", "triangle");
    this.saveState();
    c.renderAll();
  }

  addStar() {
    const c = this.canvas;
    const area = this.getArea();
    if (!c || !area) return;
    const id = `obj-${this.layerIdCounter++}`;
    const star = new Path(
      "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
      {
        left: area.x + area.width / 2 - 50,
        top: area.y + area.height / 2 - 50,
        fill: "#3b82f6",
        scaleX: 4,
        scaleY: 4,
      },
    );
    star.set("id", id);
    star.set("printArea", this.currentPrintArea);
    c.add(star);
    c.setActiveObject(star);
    this.pushLayer(id, "Estrella", "path");
    this.saveState();
    c.renderAll();
  }

  addHeart() {
    const c = this.canvas;
    const area = this.getArea();
    if (!c || !area) return;
    const id = `obj-${this.layerIdCounter++}`;
    const heart = new Path(
      "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z",
      {
        left: area.x + area.width / 2 - 50,
        top: area.y + area.height / 2 - 50,
        fill: "#3b82f6",
        scaleX: 4,
        scaleY: 4,
      },
    );
    heart.set("id", id);
    heart.set("printArea", this.currentPrintArea);
    c.add(heart);
    c.setActiveObject(heart);
    this.pushLayer(id, "Corazón", "path");
    this.saveState();
    c.renderAll();
  }

  addLine() {
    const c = this.canvas;
    const area = this.getArea();
    if (!c || !area) return;
    const id = `obj-${this.layerIdCounter++}`;
    const cx = area.x + area.width / 2;
    const cy = area.y + area.height / 2;
    const line = new Line([cx - 50, cy, cx + 50, cy], {
      stroke: "#1d4ed8",
      strokeWidth: 3,
    });
    line.set("id", id);
    line.set("printArea", this.currentPrintArea);
    c.add(line);
    c.setActiveObject(line);
    this.pushLayer(id, "Línea", "line");
    this.saveState();
    c.renderAll();
  }

  addArrow() {
    const c = this.canvas;
    const area = this.getArea();
    if (!c || !area) return;
    const id = `obj-${this.layerIdCounter++}`;
    const arrow = new Path("M0 10 L80 10 L70 0 L100 15 L70 30 L80 20 L0 20 Z", {
      left: area.x + area.width / 2 - 50,
      top: area.y + area.height / 2 - 15,
      fill: "#3b82f6",
      stroke: "#1d4ed8",
      strokeWidth: 1,
    });
    arrow.set("id", id);
    arrow.set("printArea", this.currentPrintArea);
    c.add(arrow);
    c.setActiveObject(arrow);
    this.pushLayer(id, "Flecha", "path");
    this.saveState();
    c.renderAll();
  }

  addEmoji(emoji: string, name: string) {
    const c = this.canvas;
    const area = this.getArea();
    if (!c || !area) return;
    const id = `obj-${this.layerIdCounter++}`;
    const text = new Textbox(emoji, {
      left: area.x + area.width / 2 - 30,
      top: area.y + area.height / 2 - 30,
      fontSize: 60,
      width: 70,
      editable: false,
    });
    text.set("id", id);
    text.set("printArea", this.currentPrintArea);
    c.add(text);
    c.setActiveObject(text);
    this.pushLayer(id, name, "textbox");
    this.saveState();
    c.renderAll();
  }

  addFrameRect() {
    const c = this.canvas;
    const area = this.getArea();
    if (!c || !area) return;
    const id = `obj-${this.layerIdCounter++}`;
    const outer = new Rect({
      left: 0,
      top: 0,
      width: 150,
      height: 150,
      fill: "#3b82f6",
      stroke: "#1d4ed8",
      strokeWidth: 0,
    });
    const inner = new Rect({
      left: 10,
      top: 10,
      width: 130,
      height: 130,
      fill: "transparent",
      stroke: "#1d4ed8",
      strokeWidth: 1,
    });
    const group = new Group([outer, inner], {
      left: area.x + area.width / 2 - 75,
      top: area.y + area.height / 2 - 75,
    });
    group.set("id", id);
    group.set("printArea", this.currentPrintArea);
    c.add(group);
    c.setActiveObject(group);
    this.pushLayer(id, "Marco Rect", "group");
    this.saveState();
    c.renderAll();
  }

  addFrameCircle() {
    const c = this.canvas;
    const area = this.getArea();
    if (!c || !area) return;
    const id = `obj-${this.layerIdCounter++}`;
    const outer = new Circle({ left: 0, top: 0, radius: 70, fill: "#3b82f6" });
    const inner = new Circle({
      left: 20,
      top: 20,
      radius: 50,
      fill: "transparent",
      stroke: "#1d4ed8",
      strokeWidth: 1,
    });
    const group = new Group([outer, inner], {
      left: area.x + area.width / 2 - 70,
      top: area.y + area.height / 2 - 70,
    });
    group.set("id", id);
    group.set("printArea", this.currentPrintArea);
    c.add(group);
    c.setActiveObject(group);
    this.pushLayer(id, "Marco Circ", "group");
    this.saveState();
    c.renderAll();
  }

  addBanner() {
    const c = this.canvas;
    const area = this.getArea();
    if (!c || !area) return;
    const id = `obj-${this.layerIdCounter++}`;
    const banner = new Path(
      "M0 0h200v40l-20 20 20 20v40H0v-40l20-20-20-20V0z",
      {
        left: area.x + area.width / 2 - 100,
        top: area.y + area.height / 2 - 60,
        fill: "#3b82f6",
      },
    );
    banner.set("id", id);
    banner.set("printArea", this.currentPrintArea);
    c.add(banner);
    c.setActiveObject(banner);
    this.pushLayer(id, "Banner", "path");
    this.saveState();
    c.renderAll();
  }

  async addImageFile(file: File) {
    const c = this.canvas;
    const area = this.getArea();
    if (!c || !area) return;
    const url = URL.createObjectURL(file);
    try {
      const img = await FabricImage.fromURL(url);
      const maxW = area.width * 0.8;
      const maxH = area.height * 0.8;
      const scale = Math.min(
        maxW / (img.width ?? 1),
        maxH / (img.height ?? 1),
        1,
      );
      img.scaleX = scale;
      img.scaleY = scale;
      img.left = area.x + area.width / 2 - ((img.width ?? 0) * scale) / 2;
      img.top = area.y + area.height / 2 - ((img.height ?? 0) * scale) / 2;
      const id = `obj-${this.layerIdCounter++}`;
      img.set("id", id);
      img.set("printArea", this.currentPrintArea);
      c.add(img);
      c.setActiveObject(img);
      this.pushLayer(id, `Imagen: ${file.name}`, "image");
      this.saveState();
      c.renderAll();
    } finally {
      URL.revokeObjectURL(url);
    }
  }

  async addImageFromUrl(url: string) {
    const c = this.canvas;
    const area = this.getArea();
    if (!c || !area) return;
    const img = await FabricImage.fromURL(url, { crossOrigin: "anonymous" });
    const maxW = area.width * 0.8;
    const maxH = area.height * 0.8;
    const scale = Math.min(
      maxW / (img.width ?? 1),
      maxH / (img.height ?? 1),
      1,
    );
    img.scaleX = scale;
    img.scaleY = scale;
    img.left = area.x + area.width / 2 - ((img.width ?? 0) * scale) / 2;
    img.top = area.y + area.height / 2 - ((img.height ?? 0) * scale) / 2;
    const id = `obj-${this.layerIdCounter++}`;
    img.set("id", id);
    img.set("printArea", this.currentPrintArea);
    c.add(img);
    c.setActiveObject(img);
    this.pushLayer(id, "Imagen URL", "image");
    this.saveState();
    c.renderAll();
  }

  // ─── Layer Management ──────────────────────────────
  private pushLayer(id: string, name: string, type: string) {
    this.layers = [
      {
        id,
        name,
        type,
        visible: true,
        locked: false,
        printArea: this.currentPrintArea,
      },
      ...this.layers,
    ];
    this.onLayersChange?.(this.layers);
  }

  removeLayerById(id: string) {
    const c = this.canvas;
    if (!c) return;
    const obj = this.findById(id);
    if (obj) {
      c.remove(obj);
      c.discardActiveObject();
    }
    this.layers = this.layers.filter((l) => l.id !== id);
    this.onLayersChange?.(this.layers);
    this.saveState();
    c.renderAll();
  }

  setLayerVisibility(id: string, visible: boolean) {
    const obj = this.findById(id);
    if (obj) {
      obj.visible = visible;
      this.canvas?.renderAll();
    }
  }

  setLayerLock(id: string, locked: boolean) {
    const obj = this.findById(id);
    if (obj) {
      obj.selectable = !locked;
      obj.evented = !locked;
      this.canvas?.renderAll();
    }
  }

  selectLayerById(id: string) {
    const c = this.canvas;
    const obj = this.findById(id);
    if (c && obj) {
      c.setActiveObject(obj);
      c.renderAll();
    }
  }

  bringToFront() {
    const c = this.canvas;
    const obj = c?.getActiveObject();
    if (c && obj) {
      c.bringObjectToFront(obj);
      this.saveState();
      c.renderAll();
    }
  }

  sendToBack() {
    const c = this.canvas;
    const obj = c?.getActiveObject();
    if (c && obj) {
      c.sendObjectToBack(obj);
      // Keep background objects behind
      [
        ...this.gridObjects,
        ...this.garmentObjects,
        ...this.printAreaObjects,
      ].forEach((o) => c.sendObjectToBack(o));
      this.saveState();
      c.renderAll();
    }
  }

  duplicateSelected() {
    const c = this.canvas;
    const obj = c?.getActiveObject();
    if (!c || !obj) return;
    obj.clone().then((cloned: FabricObject) => {
      cloned.left = (cloned.left ?? 0) + 20;
      cloned.top = (cloned.top ?? 0) + 20;
      const id = `obj-${this.layerIdCounter++}`;
      cloned.set("id", id);
      cloned.set("printArea", this.currentPrintArea);
      c.add(cloned);
      c.setActiveObject(cloned);
      const origLayer = this.layers.find(
        (l) => l.id === (obj.get("id") as string),
      );
      this.pushLayer(
        id,
        `${origLayer?.name ?? "Copia"} (copia)`,
        origLayer?.type ?? "rect",
      );
      this.saveState();
      c.renderAll();
    });
  }

  deleteSelected() {
    const c = this.canvas;
    const obj = c?.getActiveObject();
    if (!c || !obj) return;
    const id = obj.get("id") as string;
    c.remove(obj);
    c.discardActiveObject();
    this.layers = this.layers.filter((l) => l.id !== id);
    this.onLayersChange?.(this.layers);
    this.onSelectionChange?.(null, null);
    this.saveState();
    c.renderAll();
  }

  // ─── Object Properties ─────────────────────────────
  getSelectedObject(): FabricObject | null {
    return this.canvas?.getActiveObject() ?? null;
  }

  updateSelectedProperty(prop: string, value: unknown) {
    const obj = this.canvas?.getActiveObject();
    if (!obj) return;
    obj.set(prop as keyof FabricObject, value as never);
    obj.setCoords();
    this.canvas?.renderAll();
  }

  updateSelectedPropertyAndSave(prop: string, value: unknown) {
    this.updateSelectedProperty(prop, value);
    this.saveState();
  }

  private findById(id: string): FabricObject | undefined {
    return this.canvas?.getObjects().find((o) => o.get("id") === id);
  }

  // ─── History ───────────────────────────────────────
  private saveState() {
    if (this.saving) return;
    this.saving = true;
    const c = this.canvas;
    if (!c) {
      this.saving = false;
      return;
    }
    const objects = c.getObjects().filter((o) => !this.isBackground(o));
    const json = JSON.stringify(
      objects.map((o) => o.toObject(["id", "printArea"])),
    );
    if (this.historyIndex < this.history.length - 1) {
      this.history = this.history.slice(0, this.historyIndex + 1);
    }
    this.history.push({ json, layers: [...this.layers] });
    if (this.history.length > this.maxHistory) this.history.shift();
    else this.historyIndex++;
    this.onHistoryChange?.(this.historyIndex > 0, false);
    this.saving = false;
  }

  undo() {
    if (this.historyIndex <= 0) return;
    this.historyIndex--;
    this.restoreFromHistory();
  }

  redo() {
    if (this.historyIndex >= this.history.length - 1) return;
    this.historyIndex++;
    this.restoreFromHistory();
  }

  private async restoreFromHistory() {
    const c = this.canvas;
    if (!c) return;
    const entry = this.history[this.historyIndex];
    if (!entry) return;
    // Remove user objects
    const toRemove = c.getObjects().filter((o) => !this.isBackground(o));
    toRemove.forEach((o) => c.remove(o));
    // Restore objects from JSON
    const parsed = JSON.parse(entry.json) as Array<Record<string, unknown>>;
    for (const objData of parsed) {
      try {
        const restored = await this.createFromJSON(objData);
        if (restored) c.add(restored);
      } catch {
        /* skip broken objects */
      }
    }
    this.layers = [...entry.layers];
    this.onLayersChange?.(this.layers);
    this.onHistoryChange?.(
      this.historyIndex > 0,
      this.historyIndex < this.history.length - 1,
    );
    c.discardActiveObject();
    c.renderAll();
  }

  private async createFromJSON(
    data: Record<string, unknown>,
  ): Promise<FabricObject | null> {
    const type = data.type as string;
    const opts = data as Record<string, unknown>;
    switch (type) {
      case "Rect":
        return new Rect(opts);
      case "Circle":
        return new Circle(opts);
      case "Triangle":
        return new Triangle(opts);
      case "Textbox":
        return new Textbox((opts.text as string) ?? "", opts);
      case "Path":
        return new Path((opts.path as string) ?? "", opts);
      case "Line":
        return new Line(
          (opts.points as [number, number, number, number]) ?? [0, 0, 100, 0],
          opts,
        );
      case "Group":
        return new Group([], opts);
      case "FabricImage":
        if (opts.src) return FabricImage.fromURL(opts.src as string);
        return null;
      default:
        return null;
    }
  }

  // ─── Clear ─────────────────────────────────────────
  clearCanvas() {
    const c = this.canvas;
    if (!c) return;
    const toRemove = c.getObjects().filter((o) => !this.isBackground(o));
    toRemove.forEach((o) => c.remove(o));
    c.discardActiveObject();
    this.layers = [];
    this.layerIdCounter = 1;
    this.onLayersChange?.(this.layers);
    this.onSelectionChange?.(null, null);
    this.saveState();
    c.renderAll();
  }

  // ─── Export ────────────────────────────────────────
  exportAs(format: "png" | "jpg"): string | null {
    const c = this.canvas;
    if (!c) return null;
    // Temporarily hide background
    [
      ...this.gridObjects,
      ...this.garmentObjects,
      ...this.printAreaObjects,
    ].forEach((o) => (o.visible = false));
    c.discardActiveObject();
    c.renderAll();
    const fmt = format === "jpg" ? "jpeg" : "png";
    const dataURL = c.toDataURL({
      format: fmt as "jpeg" | "png",
      quality: 0.9,
      multiplier: 2,
    });
    // Restore background
    this.gridObjects.forEach((o) => (o.visible = this.showGrid));
    [...this.garmentObjects, ...this.printAreaObjects].forEach(
      (o) => (o.visible = true),
    );
    c.renderAll();
    return dataURL;
  }

  exportProject(): string {
    const c = this.canvas;
    const objects = c?.getObjects().filter((o) => !this.isBackground(o)) ?? [];
    return JSON.stringify(
      {
        version: "2.0",
        garmentType: this.garmentType,
        printArea: this.currentPrintArea,
        objects: objects.map((o) => o.toObject(["id", "printArea"])),
        layers: this.layers,
        timestamp: new Date().toISOString(),
      },
      null,
      2,
    );
  }

  // ─── Canvas Texture for 3D ─────────────────────────
  getCanvasDataURL(): string | null {
    const c = this.canvas;
    if (!c) return null;
    [
      ...this.gridObjects,
      ...this.garmentObjects,
      ...this.printAreaObjects,
    ].forEach((o) => (o.visible = false));
    c.discardActiveObject();
    c.backgroundColor = "#ffffff";
    c.renderAll();
    const url = c.toDataURL({ format: "png", multiplier: 1 });
    c.backgroundColor = "#111";
    this.gridObjects.forEach((o) => (o.visible = this.showGrid));
    [...this.garmentObjects, ...this.printAreaObjects].forEach(
      (o) => (o.visible = true),
    );
    c.renderAll();
    return url;
  }

  // ─── Zoom ──────────────────────────────────────────
  setZoom(percent: number) {
    const c = this.canvas;
    if (!c) return;
    const z = percent / 100;
    c.setZoom(z);
    c.renderAll();
  }
}

export const canvasManager = new CanvasManager();
