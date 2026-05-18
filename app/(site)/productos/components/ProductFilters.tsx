"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";

interface Categoria {
  id: number;
  nombre: string;
  slug: string;
}

interface Marca {
  id: number;
  nombre: string;
}

interface ProductFiltersProps {
  categorias: Categoria[];
  marcas: Marca[];
  busqueda: string;
  categoriaFiltro: string;
  marcaFiltro: string;
  precioMin: string;
  precioMax: string;
  soloDestacados: boolean;
  soloNuevos: boolean;
  orden: string;
}

export default function ProductFilters({
  categorias,
  marcas,
  busqueda,
  categoriaFiltro,
  marcaFiltro,
  precioMin,
  precioMax,
  soloDestacados,
  soloNuevos,
  orden,
}: ProductFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const [localBusqueda, setLocalBusqueda] = useState(busqueda);
  const [localCategoria, setLocalCategoria] = useState(categoriaFiltro);
  const [localMarca, setLocalMarca] = useState(marcaFiltro);
  const [localPrecioMin, setLocalPrecioMin] = useState(precioMin);
  const [localPrecioMax, setLocalPrecioMax] = useState(precioMax);
  const [localDestacados, setLocalDestacados] = useState(soloDestacados);
  const [localNuevos, setLocalNuevos] = useState(soloNuevos);
  const [localOrden, setLocalOrden] = useState(orden);

  const buildParams = (overrides: Record<string, string | boolean> = {}) => {
    const params = new URLSearchParams();
    const q = overrides.busqueda !== undefined ? String(overrides.busqueda) : localBusqueda;
    const cat = overrides.categoria !== undefined ? String(overrides.categoria) : localCategoria;
    const mar = overrides.marca !== undefined ? String(overrides.marca) : localMarca;
    const pMin = overrides.precioMin !== undefined ? String(overrides.precioMin) : localPrecioMin;
    const pMax = overrides.precioMax !== undefined ? String(overrides.precioMax) : localPrecioMax;
    const dest = overrides.destacados !== undefined ? Boolean(overrides.destacados) : localDestacados;
    const nuev = overrides.nuevos !== undefined ? Boolean(overrides.nuevos) : localNuevos;
    const ord = overrides.orden !== undefined ? String(overrides.orden) : localOrden;

    if (q) params.set("q", q);
    if (cat) params.set("categoria", cat);
    if (mar) params.set("marca", mar);
    if (pMin) params.set("precio_min", pMin);
    if (pMax) params.set("precio_max", pMax);
    if (dest) params.set("destacados", "1");
    if (nuev) params.set("nuevos", "1");
    if (ord) params.set("orden", ord);
    return params;
  };

  const applyFilters = () => {
    router.push(`${pathname}?${buildParams().toString()}`);
  };

  const clearFilters = () => {
    setLocalBusqueda("");
    setLocalCategoria("");
    setLocalMarca("");
    setLocalPrecioMin("");
    setLocalPrecioMax("");
    setLocalDestacados(false);
    setLocalNuevos(false);
    setLocalOrden("destacados");
    router.push(pathname);
  };

  const hasActiveFilters =
    localBusqueda ||
    localCategoria ||
    localMarca ||
    localPrecioMin ||
    localPrecioMax ||
    localDestacados ||
    localNuevos;

  const FilterContent = () => (
    <>
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

      <div className="mb-6">
        <label className="block text-xs uppercase tracking-[1.5px] text-[#888] mb-3 font-[family-name:var(--font-heading)]">
          Destacados
        </label>
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2 text-sm text-[#888] hover:text-white transition-colors cursor-pointer">
            <input
              type="checkbox"
              checked={localDestacados}
              onChange={(e) => {
                setLocalDestacados(e.target.checked);
                setTimeout(() => {
                  router.push(`${pathname}?${buildParams({ destacados: e.target.checked }).toString()}`);
                }, 0);
              }}
              className="accent-[#ffffff] w-4 h-4"
            />
            <span>Solo destacados</span>
          </label>
          <label className="flex items-center gap-2 text-sm text-[#888] hover:text-white transition-colors cursor-pointer">
            <input
              type="checkbox"
              checked={localNuevos}
              onChange={(e) => {
                setLocalNuevos(e.target.checked);
                setTimeout(() => {
                  router.push(`${pathname}?${buildParams({ nuevos: e.target.checked }).toString()}`);
                }, 0);
              }}
              className="accent-[#ffffff] w-4 h-4"
            />
            <span>Solo nuevos</span>
          </label>
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-xs uppercase tracking-[1.5px] text-[#888] mb-3 font-[family-name:var(--font-heading)]">
          Categorías
        </label>
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2 text-sm text-[#888] hover:text-white transition-colors cursor-pointer">
            <input
              type="radio"
              name="categoria"
              checked={!localCategoria}
              onChange={() => {
                setLocalCategoria("");
                setTimeout(() => {
                  router.push(`${pathname}?${buildParams({ categoria: "" }).toString()}`);
                }, 0);
              }}
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
                checked={localCategoria === cat.slug}
                onChange={() => {
                  setLocalCategoria(cat.slug);
                  setTimeout(() => {
                    router.push(`${pathname}?${buildParams({ categoria: cat.slug }).toString()}`);
                  }, 0);
                }}
                className="accent-[#ffffff]"
              />
              <span>{cat.nombre}</span>
            </label>
          ))}
        </div>
      </div>

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
                checked={!localMarca}
                onChange={() => {
                  setLocalMarca("");
                  setTimeout(() => {
                    router.push(`${pathname}?${buildParams({ marca: "" }).toString()}`);
                  }, 0);
                }}
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
                  checked={localMarca === String(m.id)}
                  onChange={() => {
                    setLocalMarca(String(m.id));
                    setTimeout(() => {
                      router.push(`${pathname}?${buildParams({ marca: String(m.id) }).toString()}`);
                    }, 0);
                  }}
                  className="accent-[#ffffff]"
                />
                <span>{m.nombre}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      <div className="mb-6">
        <label className="block text-xs uppercase tracking-[1.5px] text-[#888] mb-3 font-[family-name:var(--font-heading)]">
          Precio
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={localPrecioMin}
            onChange={(e) => setLocalPrecioMin(e.target.value)}
            className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#2a2a2a] text-[#f5f5f5] text-sm rounded focus:outline-none focus:border-[#888]"
          />
          <span className="text-[#888]">—</span>
          <input
            type="number"
            placeholder="Max"
            value={localPrecioMax}
            onChange={(e) => setLocalPrecioMax(e.target.value)}
            className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#2a2a2a] text-[#f5f5f5] text-sm rounded focus:outline-none focus:border-[#888]"
          />
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-xs uppercase tracking-[1.5px] text-[#888] mb-3 font-[family-name:var(--font-heading)]">
          Ordenar
        </label>
        <select
          value={localOrden}
          onChange={(e) => {
            setLocalOrden(e.target.value);
            setTimeout(() => {
              router.push(`${pathname}?${buildParams({ orden: e.target.value }).toString()}`);
            }, 0);
          }}
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
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block">
        <div className="sticky top-35 bg-[#111111] border border-[#2a2a2a] rounded-xl p-6 shadow-2xl shadow-black/40">
          <FilterContent />
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
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            <FilterContent />
          </div>
        </>
      )}

      {/* Mobile Filter Toggle Button */}
      <div className="lg:hidden">
        <button
          type="button"
          onClick={() => setShowMobileFilters(true)}
          className="flex items-center gap-2 border border-[#2a2a2a] text-[#888] px-4 py-3 rounded text-sm transition-colors hover:border-[#888] hover:text-white"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 6h18M10 12h8M6 18h12" />
          </svg>
          Filtros
          {hasActiveFilters && <span className="w-2 h-2 bg-[#ffffff] rounded-full" />}
        </button>
      </div>
    </>
  );
}
