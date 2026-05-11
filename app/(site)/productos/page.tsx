"use client";

import Link from "next/link";
import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import MagneticButton from "../../components/MagneticButton";

interface Producto {
  id: number;
  nombre: string;
  slug: string;
  descripcion: string;
  precio_base: number;
  destacado: number;
  categoria_nombre: string;
  categoria_slug: string;
  tallas: string[];
}

interface Categoria {
  id: number;
  nombre: string;
  slug: string;
}

interface Marca {
  id: number;
  nombre: string;
}

export default function ProductosPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0a0a0a] text-center py-16">
          <p className="text-[#888]">Cargando productos...</p>
        </div>
      }
    >
      <ProductosContent />
    </Suspense>
  );
}

function ProductosContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState(searchParams.get("q") || "");
  const [categoriaFiltro, setCategoriaFiltro] = useState(
    searchParams.get("categoria") || "",
  );
  const [marcaFiltro, setMarcaFiltro] = useState(
    searchParams.get("marca") || "",
  );
  const [precioMin, setPrecioMin] = useState(
    searchParams.get("precio_min") || "",
  );
  const [precioMax, setPrecioMax] = useState(
    searchParams.get("precio_max") || "",
  );
  const [soloDestacados, setSoloDestacados] = useState(
    searchParams.get("destacados") === "1",
  );
  const [soloNuevos, setSoloNuevos] = useState(
    searchParams.get("nuevos") === "1",
  );
  const [orden, setOrden] = useState(searchParams.get("orden") || "destacados");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [addingIds, setAddingIds] = useState<Set<number>>(new Set());
  const [cartMessages, setCartMessages] = useState<Record<number, string>>({});
  const [userRol, setUserRol] = useState("");

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (d.user?.isLoggedIn) setUserRol(d.user.rol || "");
      })
      .catch(() => {});
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (busqueda) params.set("q", busqueda);
    if (categoriaFiltro) params.set("categoria", categoriaFiltro);
    if (marcaFiltro) params.set("marca", marcaFiltro);
    if (precioMin) params.set("precio_min", precioMin);
    if (precioMax) params.set("precio_max", precioMax);
    if (soloDestacados) params.set("destacados", "1");
    if (soloNuevos) params.set("nuevos", "1");
    if (orden) params.set("orden", orden);

    try {
      const res = await fetch(`/api/products?${params.toString()}`);
      const data = await res.json();
      if (data.success) setProductos(data.productos);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [
    busqueda,
    categoriaFiltro,
    marcaFiltro,
    precioMin,
    precioMax,
    soloDestacados,
    soloNuevos,
    orden,
  ]);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((d) => {
        setCategorias(d.categorias || []);
        setMarcas(d.marcas || []);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleAddToCart = async (e: React.MouseEvent, prod: Producto) => {
    e.preventDefault();
    e.stopPropagation();
    setAddingIds((prev) => new Set(prev).add(prod.id));
    setCartMessages((prev) => ({ ...prev, [prod.id]: "" }));
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          producto_id: prod.id,
          cantidad: 1,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setCartMessages((prev) => ({
          ...prev,
          [prod.id]: "¡Agregado!",
        }));
        window.dispatchEvent(new Event("cart-updated"));
      } else {
        setCartMessages((prev) => ({
          ...prev,
          [prod.id]: data.error || "Error",
        }));
      }
    } catch {
      setCartMessages((prev) => ({
        ...prev,
        [prod.id]: "Error de conexión",
      }));
    } finally {
      setAddingIds((prev) => {
        const next = new Set(prev);
        next.delete(prod.id);
        return next;
      });
      setTimeout(() => {
        setCartMessages((prev) => {
          const next = { ...prev };
          delete next[prod.id];
          return next;
        });
      }, 2000);
    }
  };

  const handleFilter = () => {
    const params = new URLSearchParams();
    if (busqueda) params.set("q", busqueda);
    if (categoriaFiltro) params.set("categoria", categoriaFiltro);
    if (marcaFiltro) params.set("marca", marcaFiltro);
    if (precioMin) params.set("precio_min", precioMin);
    if (precioMax) params.set("precio_max", precioMax);
    if (soloDestacados) params.set("destacados", "1");
    if (soloNuevos) params.set("nuevos", "1");
    if (orden) params.set("orden", orden);
    router.push(`/productos?${params.toString()}`);
  };

  const clearFilters = () => {
    setBusqueda("");
    setCategoriaFiltro("");
    setMarcaFiltro("");
    setPrecioMin("");
    setPrecioMax("");
    setSoloDestacados(false);
    setSoloNuevos(false);
    setOrden("destacados");
    router.push("/productos");
  };

  const hasActiveFilters =
    busqueda ||
    categoriaFiltro ||
    marcaFiltro ||
    precioMin ||
    precioMax ||
    soloDestacados ||
    soloNuevos;

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-[300px_1fr] bg-[#0a0a0a] gap-6 px-4 lg:px-8 pt-28 pb-8">
      {/* Desktop Sidebar — Floating Card */}
      <aside className="hidden lg:block">
        <div className="sticky top-35 bg-[#111111] border border-[#2a2a2a] rounded-xl p-6 shadow-2xl shadow-black/40">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-[family-name:var(--font-heading)] text-sm uppercase tracking-[2px]">
              Filtros
            </h3>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-xs text-[#888] hover:text-white underline bg-transparent border-none cursor-pointer"
              >
                Limpiar
              </button>
            )}
          </div>

          {/* Destacados / Nuevos */}
          <div className="mb-6">
            <label className="block text-xs uppercase tracking-[1.5px] text-[#888] mb-3 font-[family-name:var(--font-heading)]">
              Destacados
            </label>
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 text-sm text-[#888] hover:text-white transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  checked={soloDestacados}
                  onChange={(e) => setSoloDestacados(e.target.checked)}
                  className="accent-[#ffffff] w-4 h-4"
                />
                <span>Solo destacados</span>
              </label>
              <label className="flex items-center gap-2 text-sm text-[#888] hover:text-white transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  checked={soloNuevos}
                  onChange={(e) => setSoloNuevos(e.target.checked)}
                  className="accent-[#ffffff] w-4 h-4"
                />
                <span>Solo nuevos</span>
              </label>
            </div>
          </div>

          {/* Categorías */}
          <div className="mb-6">
            <label className="block text-xs uppercase tracking-[1.5px] text-[#888] mb-3 font-[family-name:var(--font-heading)]">
              Categorías
            </label>
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 text-sm text-[#888] hover:text-white transition-colors cursor-pointer">
                <input
                  type="radio"
                  name="categoria"
                  checked={!categoriaFiltro}
                  onChange={() => setCategoriaFiltro("")}
                  className="accent-[#ffffff]"
                />
                <span>Todas</span>
              </label>
              {categorias.map((cat) => (
                <label
                  key={cat.id}
                  className="flex items-center gap-2 text-sm text-[#888] hover:text-white transition-colors cursor-pointer"
                >
                  <input
                    type="radio"
                    name="categoria"
                    checked={categoriaFiltro === cat.slug}
                    onChange={() => setCategoriaFiltro(cat.slug)}
                    className="accent-[#ffffff]"
                  />
                  <span>{cat.nombre}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Marcas */}
          {marcas.length > 0 && (
            <div className="mb-6">
              <label className="block text-xs uppercase tracking-[1.5px] text-[#888] mb-3 font-[family-name:var(--font-heading)]">
                Marcas
              </label>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 text-sm text-[#888] hover:text-white transition-colors cursor-pointer">
                  <input
                    type="radio"
                    name="marca"
                    checked={!marcaFiltro}
                    onChange={() => setMarcaFiltro("")}
                    className="accent-[#ffffff]"
                  />
                  <span>Todas</span>
                </label>
                {marcas.map((m) => (
                  <label
                    key={m.id}
                    className="flex items-center gap-2 text-sm text-[#888] hover:text-white transition-colors cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="marca"
                      checked={marcaFiltro === String(m.id)}
                      onChange={() => setMarcaFiltro(String(m.id))}
                      className="accent-[#ffffff]"
                    />
                    <span>{m.nombre}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Rango de Precio */}
          <div className="mb-6">
            <label className="block text-xs uppercase tracking-[1.5px] text-[#888] mb-3 font-[family-name:var(--font-heading)]">
              Precio
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min"
                value={precioMin}
                onChange={(e) => setPrecioMin(e.target.value)}
                className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#2a2a2a] text-[#f5f5f5] text-sm rounded focus:outline-none focus:border-[#888]"
              />
              <span className="text-[#888]">—</span>
              <input
                type="number"
                placeholder="Max"
                value={precioMax}
                onChange={(e) => setPrecioMax(e.target.value)}
                className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#2a2a2a] text-[#f5f5f5] text-sm rounded focus:outline-none focus:border-[#888]"
              />
            </div>
          </div>

          {/* Ordenar */}
          <div className="mb-6">
            <label className="block text-xs uppercase tracking-[1.5px] text-[#888] mb-3 font-[family-name:var(--font-heading)]">
              Ordenar
            </label>
            <select
              value={orden}
              onChange={(e) => setOrden(e.target.value)}
              className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#2a2a2a] text-[#f5f5f5] text-sm rounded focus:outline-none focus:border-[#888]"
            >
              <option value="destacados">Destacados</option>
              <option value="nuevos">Más recientes</option>
              <option value="precio_asc">Precio: menor a mayor</option>
              <option value="precio_desc">Precio: mayor a menor</option>
              <option value="nombre_asc">Nombre A-Z</option>
            </select>
          </div>
        </div>
      </aside>

      {/* Mobile Filter Drawer */}
      {showMobileFilters && (
        <>
          <div
            className="fixed inset-0 bg-black/60 z-40 lg:hidden"
            onClick={() => setShowMobileFilters(false)}
          />
          <div className="fixed inset-y-0 left-0 w-[300px] bg-[#111111] border-r border-[#2a2a2a] z-50 p-6 overflow-y-auto lg:hidden">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-[family-name:var(--font-heading)] text-sm uppercase tracking-[2px]">
                Filtros
              </h3>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="text-[#888] hover:text-white transition-colors"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Destacados / Nuevos */}
            <div className="mb-6">
              <label className="block text-xs uppercase tracking-[1.5px] text-[#888] mb-3 font-[family-name:var(--font-heading)]">
                Destacados
              </label>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 text-sm text-[#888] hover:text-white transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    checked={soloDestacados}
                    onChange={(e) => setSoloDestacados(e.target.checked)}
                    className="accent-[#ffffff] w-4 h-4"
                  />
                  <span>Solo destacados</span>
                </label>
                <label className="flex items-center gap-2 text-sm text-[#888] hover:text-white transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    checked={soloNuevos}
                    onChange={(e) => setSoloNuevos(e.target.checked)}
                    className="accent-[#ffffff] w-4 h-4"
                  />
                  <span>Solo nuevos</span>
                </label>
              </div>
            </div>

            {/* Categorías */}
            <div className="mb-6">
              <label className="block text-xs uppercase tracking-[1.5px] text-[#888] mb-3 font-[family-name:var(--font-heading)]">
                Categorías
              </label>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 text-sm text-[#888] hover:text-white transition-colors cursor-pointer">
                  <input
                    type="radio"
                    name="categoria_m"
                    checked={!categoriaFiltro}
                    onChange={() => setCategoriaFiltro("")}
                    className="accent-[#ffffff]"
                  />
                  <span>Todas</span>
                </label>
                {categorias.map((cat) => (
                  <label
                    key={cat.id}
                    className="flex items-center gap-2 text-sm text-[#888] hover:text-white transition-colors cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="categoria_m"
                      checked={categoriaFiltro === cat.slug}
                      onChange={() => setCategoriaFiltro(cat.slug)}
                      className="accent-[#ffffff]"
                    />
                    <span>{cat.nombre}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Marcas */}
            {marcas.length > 0 && (
              <div className="mb-6">
                <label className="block text-xs uppercase tracking-[1.5px] text-[#888] mb-3 font-[family-name:var(--font-heading)]">
                  Marcas
                </label>
                <div className="flex flex-col gap-2">
                  <label className="flex items-center gap-2 text-sm text-[#888] hover:text-white transition-colors cursor-pointer">
                    <input
                      type="radio"
                      name="marca_m"
                      checked={!marcaFiltro}
                      onChange={() => setMarcaFiltro("")}
                      className="accent-[#ffffff]"
                    />
                    <span>Todas</span>
                  </label>
                  {marcas.map((m) => (
                    <label
                      key={m.id}
                      className="flex items-center gap-2 text-sm text-[#888] hover:text-white transition-colors cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="marca_m"
                        checked={marcaFiltro === String(m.id)}
                        onChange={() => setMarcaFiltro(String(m.id))}
                        className="accent-[#ffffff]"
                      />
                      <span>{m.nombre}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Precio */}
            <div className="mb-6">
              <label className="block text-xs uppercase tracking-[1.5px] text-[#888] mb-3 font-[family-name:var(--font-heading)]">
                Precio
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={precioMin}
                  onChange={(e) => setPrecioMin(e.target.value)}
                  className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#2a2a2a] text-[#f5f5f5] text-sm rounded focus:outline-none focus:border-[#888]"
                />
                <span className="text-[#888]">—</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={precioMax}
                  onChange={(e) => setPrecioMax(e.target.value)}
                  className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#2a2a2a] text-[#f5f5f5] text-sm rounded focus:outline-none focus:border-[#888]"
                />
              </div>
            </div>

            {/* Ordenar */}
            <div className="mb-6">
              <label className="block text-xs uppercase tracking-[1.5px] text-[#888] mb-3 font-[family-name:var(--font-heading)]">
                Ordenar
              </label>
              <select
                value={orden}
                onChange={(e) => setOrden(e.target.value)}
                className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#2a2a2a] text-[#f5f5f5] text-sm rounded focus:outline-none focus:border-[#888]"
              >
                <option value="destacados">Destacados</option>
                <option value="nuevos">Más recientes</option>
                <option value="precio_asc">Precio: menor a mayor</option>
                <option value="precio_desc">Precio: mayor a menor</option>
                <option value="nombre_asc">Nombre A-Z</option>
              </select>
            </div>

            {hasActiveFilters && (
              <button
                onClick={() => {
                  clearFilters();
                  setShowMobileFilters(false);
                }}
                className="w-full border border-[#888] text-[#888] py-3 text-[0.7rem] uppercase tracking-[2px] font-[family-name:var(--font-heading)] rounded transition-all hover:border-white hover:text-white bg-transparent"
              >
                Limpiar Todo
              </button>
            )}
          </div>
        </>
      )}

      {/* Main Content */}
      <div>
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
          <div>
            <h1 className="font-[family-name:var(--font-heading)] text-2xl md:text-3xl font-semibold tracking-[-1px] mb-1">
              {busqueda ? "Resultados de búsqueda" : "Todos los Productos"}
            </h1>
            <p className="text-[#888] text-sm">
              {busqueda
                ? `Se encontraron ${productos.length} productos`
                : `${productos.length} productos disponibles`}
            </p>
          </div>
          <div className="flex items-center gap-2 w-full lg:w-auto">
            {/* Mobile Filter Toggle */}
            <button
              type="button"
              onClick={() => setShowMobileFilters(true)}
              className="lg:hidden flex items-center gap-2 border border-[#2a2a2a] text-[#888] px-4 py-3 rounded text-sm transition-colors hover:border-[#888] hover:text-white"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M3 6h18M10 12h8M6 18h12" />
              </svg>
              Filtros
              {hasActiveFilters && (
                <span className="w-2 h-2 bg-[#ffffff] rounded-full" />
              )}
            </button>
            <form
              className="flex flex-1 lg:w-[350px] rounded focus-within:border-[#888] border border-[#2a2a2a] transition-colors bg-[#1a1a1a] overflow-hidden"
              onSubmit={(e) => {
                e.preventDefault();
                handleFilter();
              }}
            >
              <input
                type="text"
                placeholder="Buscar productos..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="flex-1 px-4 py-3 bg-transparent text-[#f5f5f5] text-sm focus:outline-none"
              />
              <MagneticButton
                type="submit"
                className="px-4 py-3 bg-transparent text-[#888] hover:text-white transition-colors border-none"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
              </MagneticButton>
            </form>
          </div>
        </div>

        {/* Active filters */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-3 mb-6">
            {busqueda && (
              <span className="text-sm text-[#888] bg-[#1a1a1a] px-3 py-1 rounded border border-[#2a2a2a]">
                Búsqueda: &ldquo;{busqueda}&rdquo;
              </span>
            )}
            {categoriaFiltro && (
              <span className="text-sm text-[#888] bg-[#1a1a1a] px-3 py-1 rounded border border-[#2a2a2a]">
                {categorias.find((c) => c.slug === categoriaFiltro)?.nombre ||
                  categoriaFiltro}
              </span>
            )}
            {marcaFiltro && (
              <span className="text-sm text-[#888] bg-[#1a1a1a] px-3 py-1 rounded border border-[#2a2a2a]">
                {marcas.find((m) => String(m.id) === marcaFiltro)?.nombre ||
                  marcaFiltro}
              </span>
            )}
            {(precioMin || precioMax) && (
              <span className="text-sm text-[#888] bg-[#1a1a1a] px-3 py-1 rounded border border-[#2a2a2a]">
                ${precioMin || "0"} — ${precioMax || "∞"}
              </span>
            )}
            {soloDestacados && (
              <span className="text-sm text-[#888] bg-[#1a1a1a] px-3 py-1 rounded border border-[#2a2a2a]">
                Destacados
              </span>
            )}
            {soloNuevos && (
              <span className="text-sm text-[#888] bg-[#1a1a1a] px-3 py-1 rounded border border-[#2a2a2a]">
                Nuevos
              </span>
            )}
            <button
              onClick={clearFilters}
              className="text-sm text-[#ffffff] hover:text-[#d4d4d4] underline bg-transparent border-none cursor-pointer"
            >
              Limpiar todo
            </button>
          </div>
        )}

        {/* Product Grid */}
        <div>
          {loading ? (
            <div className="text-center py-16">
              <p className="text-[#888]">Cargando productos...</p>
            </div>
          ) : productos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {productos.map((prod) => (
                <article
                  key={prod.id}
                  className="relative bg-[#141414] border border-[#2a2a2a] overflow-hidden rounded-lg transition-all duration-300 hover:-translate-y-2 hover:border-[#3a3a3a] group"
                  data-categoria={prod.categoria_slug || "todos"}
                >
                  <Link
                    href={`/producto/${prod.slug}`}
                    className="absolute inset-0 z-10"
                    aria-label={`Ver ${prod.nombre}`}
                  />
                  <div className="relative aspect-[4/3] overflow-hidden bg-[#1a1a1a]">
                    <img
                      src={`/images/products/${prod.slug}.jpg`}
                      alt={prod.nombre}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {}}
                    />
                    {prod.destacado ? (
                      <span className="absolute top-3 left-3 bg-[#ffffff] text-[#0a0a0a] text-[0.6rem] uppercase tracking-[2px] font-semibold px-3 py-1 z-10 rounded">
                        Destacado
                      </span>
                    ) : null}
                  </div>
                  <div className="p-4">
                    <h3 className="font-[family-name:var(--font-heading)] text-base mb-1 truncate">
                      {prod.nombre}
                    </h3>
                    <p className="text-[#888] text-xs mb-3 leading-relaxed line-clamp-2">
                      {prod.descripcion
                        ? prod.descripcion.substring(0, 80) + "..."
                        : ""}
                    </p>
                    <div className="text-[#ffffff] font-semibold text-base mb-3">
                      ${Number(prod.precio_base).toFixed(2)}
                    </div>
                    {prod.tallas && prod.tallas.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {prod.tallas.map((t) => (
                          <span
                            key={t}
                            className="text-[0.6rem] uppercase tracking-[1px] text-[#888] border border-[#2a2a2a] px-2 py-0.5 rounded"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                    {userRol === "admin" ? (
                      <span className="inline-block border border-[#555] text-[#555] px-5 py-2 text-[0.65rem] uppercase tracking-[2px] font-[family-name:var(--font-heading)] font-semibold rounded cursor-not-allowed">
                        Solo clientes
                      </span>
                    ) : (
                      <MagneticButton
                        onClick={(e: React.MouseEvent) =>
                          handleAddToCart(e, prod)
                        }
                        className="relative z-20 inline-block bg-[#ffffff] text-[#0a0a0a] px-5 py-2 text-[0.65rem] uppercase tracking-[2px] font-[family-name:var(--font-heading)] font-semibold rounded hover:bg-[#d4d4d4] disabled:opacity-50"
                        disabled={addingIds.has(prod.id)}
                      >
                        {addingIds.has(prod.id)
                          ? "Agregando..."
                          : "Agregar al Carrito"}
                      </MagneticButton>
                    )}
                    {cartMessages[prod.id] && (
                      <p
                        className={`mt-2 text-xs ${
                          cartMessages[prod.id].includes("Error")
                            ? "text-red-400"
                            : "text-green-400"
                        }`}
                      >
                        {cartMessages[prod.id]}
                      </p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <h3 className="font-[family-name:var(--font-heading)] text-xl mb-2">
                No hay productos disponibles
              </h3>
              <p className="text-[#888]">
                Pronto añadiremos nuevos productos a nuestra colección.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
