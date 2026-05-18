import { getCurrentUser } from "@/app/lib/session";
import { getProducts } from "@/app/lib/products";
import { getCategories } from "@/app/lib/categories";
import ProductListClient from "./ProductListClient";

export default async function ProductosPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const user = await getCurrentUser();

  const [productsData, categoriesData] = await Promise.all([
    getProducts({
      q: params.q ? String(params.q) : undefined,
      categoria: params.categoria ? String(params.categoria) : undefined,
      marca: params.marca ? String(params.marca) : undefined,
      precio_min: params.precio_min ? String(params.precio_min) : undefined,
      precio_max: params.precio_max ? String(params.precio_max) : undefined,
      destacados: params.destacados ? String(params.destacados) : undefined,
      nuevos: params.nuevos ? String(params.nuevos) : undefined,
      orden: params.orden ? String(params.orden) : undefined,
    }),
    getCategories(),
  ]);

  return (
    <ProductListClient
      initialProductos={productsData.productos || []}
      categorias={categoriesData.categorias || []}
      marcas={categoriesData.marcas || []}
      userRol={user?.rol || ""}
      searchParams={{
        q: params.q ? String(params.q) : undefined,
        categoria: params.categoria ? String(params.categoria) : undefined,
        marca: params.marca ? String(params.marca) : undefined,
        precio_min: params.precio_min ? String(params.precio_min) : undefined,
        precio_max: params.precio_max ? String(params.precio_max) : undefined,
        destacados: params.destacados ? String(params.destacados) : undefined,
        nuevos: params.nuevos ? String(params.nuevos) : undefined,
        orden: params.orden ? String(params.orden) : undefined,
      }}
    />
  );
}
