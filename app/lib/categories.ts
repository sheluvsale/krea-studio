import { query } from "@/app/lib/db";

export interface Categoria {
  id: number;
  nombre: string;
  slug: string;
}

export interface Marca {
  id: number;
  nombre: string;
}

export async function getCategories(): Promise<{
  categorias: Categoria[];
  marcas: Marca[];
}> {
  const categorias = await query<Categoria>(
    "SELECT id, nombre, slug FROM categorias WHERE activa = TRUE ORDER BY nombre",
  );
  const marcas = await query<Marca>(
    "SELECT id, nombre FROM marcas ORDER BY nombre",
  );
  return { categorias, marcas };
}
