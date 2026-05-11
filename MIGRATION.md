# Migración del Diseñador de Ropa — Krea Studio

## Resumen

Migración completa del diseñador de ropa desde **Konva.js + PHP** hacia **Next.js + Fabric.js + Three.js + Zustand + Framer Motion + Lucide**.

---

## ✅ Funcionalidades Migradas

### Estructura y UI
- [x] **Layout profesional** — Sidebar izquierdo (herramientas), canvas central, sidebar derecho (propiedades/efectos/capas)
- [x] **Toolbar superior** — Undo/redo, zoom, grid, vista diseño/3D, exportar, guardar, limpiar, ayuda
- [x] **Tema oscuro** — Interfaz moderna con variables CSS y Tailwind
- [x] **Modal de selección de prenda** — Camiseta, Hoodie, Pantalón, Tank Top, Gorra
- [x] **Sistema de pestañas multi-prenda** — Crear, cambiar y cerrar pestañas de prendas
- [x] **Notificaciones Toast** — Sistema de toasts animados con Framer Motion

### Canvas y Diseño (Fabric.js reemplaza Konva.js)
- [x] **Canvas 2D editable** — 800×700px con Fabric.js
- [x] **Agregar texto** — Textbox editable con doble clic, propiedades de fuente, tamaño, color
- [x] **Agregar formas** — Rectángulo, círculo, triángulo, estrella, corazón, línea, flecha
- [x] **Agregar emojis** — 🔥🚀👑💀⚡💎
- [x] **Agregar marcos** — Marco rectangular, circular, banner
- [x] **Subir imágenes** — File upload, drag & drop al canvas y sidebar, desde URL
- [x] **Selección y transformación** — Mover, rotar, escalar con handles nativos de Fabric.js
- [x] **Áreas de impresión por prenda** — Rectangulos delimitadores con highlight activo
- [x] **Silueta de prenda** — SVG paths de fondo para cada tipo de prenda
- [x] **Grid** — Grid con líneas mayores/menores y cruces centrales

### Panel de Propiedades
- [x] **Posición X/Y** — Inputs numéricos
- [x] **Rotación** — Slider 0-360°
- [x] **Color de relleno** — Paleta rápida + color picker
- [x] **Propiedades de texto** — Fuente, tamaño, estilo, color
- [x] **Acciones** — Duplicar, traer al frente, enviar atrás, eliminar

### Panel de Capas
- [x] **Lista de capas** — Ordenadas por creación
- [x] **Visibilidad** — Toggle ojo para mostrar/ocultar
- [x] **Bloqueo** — Toggle candado para bloquear selección
- [x] **Eliminar** — Botón de eliminar por capa
- [x] **Selección** — Click en capa selecciona objeto en canvas

### Panel de Efectos
- [x] **Sliders** — Brillo, contraste, saturación, desenfoque, tono, ruido, pixelar
- [x] **Checkboxes** — Sepia, invertir, escala de grises
- [x] **Restablecer** — Botón para resetear todos los efectos

### Historial
- [x] **Undo/Redo** — Con botones en toolbar y atajos de teclado
- [x] **Máximo 50 estados** — Igual que el original

### Atajos de Teclado
- [x] **Ctrl+Z** — Deshacer
- [x] **Ctrl+Y / Ctrl+Shift+Z** — Rehacer
- [x] **Ctrl+D** — Duplicar
- [x] **Ctrl+S** — Guardar
- [x] **Delete / Backspace** — Eliminar seleccionado
- [x] **Escape** — Deseleccionar
- [x] **T** — Agregar texto
- [x] **V** — Herramienta seleccionar
- [x] **Flechas** — Mover objeto (Shift = 10px)
- [x] **F1** — Ayuda

### Exportación
- [x] **PNG** — Exportar como PNG 2x
- [x] **JPG** — Exportar como JPG comprimido
- [x] **Proyecto .krea** — Exportar JSON del diseño

### Vista 3D (NUEVA)
- [x] **Preview 3D** — Three.js + React Three Fiber + Drei
- [x] **Rotación automática** — El modelo gira lentamente
- [x] **Textura del canvas** — El diseño del canvas se mapea como textura
- [x] **Orbit controls** — Arrastrar para rotar, scroll para zoom
- [x] **Iluminación y sombras** — Ambiente, direccional, contact shadows
- [x] **Environment map** — Preset "city" para reflejos

### State Management (NUEVO)
- [x] **Zustand store** — Estado centralizado reactivo (reemplaza variables globales)

### Animaciones (NUEVO)
- [x] **Framer Motion** — Animaciones en modal, tabs, toasts, hover effects

### Iconografía (NUEVO)
- [x] **Lucide React** — Iconos vectoriales consistentes en toda la UI

---

## ❌ Funcionalidades NO Migradas

### Backend / Servidor
- [ ] **Autenticación PHP** — Sesiones de usuario, login redirect (`create_clothes.php` lines 6-18)
- [ ] **CSRF tokens** — Protección CSRF del servidor PHP
- [ ] **Guardar en servidor** — `api/save_design.php` endpoint (se usa localStorage como fallback)
- [ ] **Cargar diseños guardados** — `loadDesign()` desde servidor
- [ ] **Autosave al servidor** — El autosave simulado no se implementó

### Canvas Avanzado
- [ ] **Guías de alineación (snap guides)** — Las guías inteligentes de Konva no se portaron (Fabric.js tiene su propio snapping pero no se configuró)
- [ ] **Reordenamiento de capas drag & drop** — `reorderLayers()` con drag en la lista de capas
- [ ] **Copiar/Pegar (Ctrl+C/V)** — El clipboard entre objetos no se implementó
- [ ] **Efectos de imagen reales** — Los sliders de efectos están en UI pero no aplican filtros reales de Fabric.js (solo UI, falta conexión con `canvas.applyFilters()`)
- [ ] **Exportación HD (300 DPI)** — `exportHighResolution()` con cálculo de DPI específico por área de impresión
- [ ] **Plantillas predefinidas** — `loadTemplate()` con minimal-text, circle-badge, geometric, banner

### UI/UX
- [ ] **Efectos magnéticos en botones** — `initDesignerButtonEffects()` con mousemove
- [ ] **Barra de progreso de carga** — Loading screen con progress bar animada
- [ ] **Propiedades de imagen** — Ancho/Alto con botones +/- y checkbox mantener proporción
- [ ] **Propiedades de borde** — Color de borde y grosor para formas
- [ ] **Modos de vista** — Modo "mockup" con fondo de prenda (solo design/preview 3D implementados)

---

## Archivos Eliminados
- `create_clothes.php` — Reemplazado por Next.js app
- `clothes-designer.js` — Reemplazado por componentes React + canvas-manager

## Nuevos Archivos Creados
- `app/page.tsx` — Página principal del diseñador
- `app/layout.tsx` — Layout actualizado
- `app/globals.css` — Estilos globales con tema oscuro
- `app/store/designer-store.ts` — Zustand store
- `app/lib/canvas-manager.ts` — Motor del canvas Fabric.js
- `app/components/GarmentSelector.tsx` — Modal de selección de prenda
- `app/components/GarmentTabs.tsx` — Pestañas de prendas
- `app/components/Toolbar.tsx` — Barra de herramientas superior
- `app/components/ToolsSidebar.tsx` — Sidebar izquierdo de herramientas
- `app/components/FabricCanvas.tsx` — Componente del canvas Fabric.js
- `app/components/PropertiesSidebar.tsx` — Sidebar derecho de propiedades
- `app/components/ThreePreview.tsx` — Vista previa 3D
- `app/components/HelpModal.tsx` — Modal de ayuda
- `app/components/Toast.tsx` — Sistema de notificaciones

## Stack Tecnológico
| Antes | Después |
|-------|---------|
| Konva.js | Fabric.js v7 |
| Vanilla JS (4500+ líneas) | React + TypeScript (modular) |
| PHP sessions | — (frontend-only por ahora) |
| Variables globales | Zustand store |
| CSS inline/BEM | Tailwind CSS |
| SVG icons inline | Lucide React |
| Sin animaciones | Framer Motion |
| Sin 3D | Three.js + React Three Fiber + Drei |
