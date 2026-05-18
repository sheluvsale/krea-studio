import { query, queryOne } from "@/app/lib/db";

export interface Producto {
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

export async function getProducts(filters: {
  q?: string;
  categoria?: string;
  marca?: string;
  precio_min?: string;
  precio_max?: string;
  destacados?: string;
  nuevos?: string;
  orden?: string;
}): Promise<{ productos: Producto[]; total: number }> {
  const q = filters.q || "";
  const categoria = filters.categoria || "";
  const marca = filters.marca || "0";
  const precioMin = filters.precio_min || "0";
  const precioMax = filters.precio_max || "0";
  const destacados = filters.destacados || "";
  const nuevos = filters.nuevos || "";
  const orden = filters.orden || "destacados";

  let sql = `SELECT p.*, c.nombre as categoria_nombre, c.slug as categoria_slug, m.nombre as marca_nombre
             FROM productos p
             LEFT JOIN categorias c ON p.categoria_id = c.id
             LEFT JOIN marcas m ON p.marca_id = m.id
             WHERE p.estado = 'publicado'`;
  const params: (string | number)[] = [];

  if (q) {
    sql += " AND (p.nombre ILIKE ? OR p.descripcion ILIKE ?)";
    params.push(`%${q}%`, `%${q}%`);
  }
  if (categoria) {
    sql += " AND c.slug = ?";
    params.push(categoria);
  }
  if (Number(marca) > 0) {
    sql += " AND p.marca_id = ?";
    params.push(Number(marca));
  }
  if (Number(precioMin) > 0) {
    sql += " AND p.precio_base >= ?";
    params.push(Number(precioMin));
  }
  if (Number(precioMax) > 0) {
    sql += " AND p.precio_base <= ?";
    params.push(Number(precioMax));
  }
  if (destacados === "1") {
    sql += " AND p.destacado = TRUE";
  }
  if (nuevos === "1") {
    sql += " AND p.nuevo = TRUE";
  }

  switch (orden) {
    case "precio_asc":
      sql += " ORDER BY p.precio_base ASC";
      break;
    case "precio_desc":
      sql += " ORDER BY p.precio_base DESC";
      break;
    case "nombre_asc":
      sql += " ORDER BY p.nombre ASC";
      break;
    case "nombre_desc":
      sql += " ORDER BY p.nombre DESC";
      break;
    case "nuevos":
      sql += " ORDER BY p.creado_en DESC";
      break;
    default:
      sql += " ORDER BY p.destacado DESC, p.creado_en DESC";
  }

  const productos = await query(sql, params);

  const productoIds = (productos as Record<string, unknown>[])
    .map((p) => Number(p.id))
    .filter((id) => !isNaN(id));

  const tallasPorProducto: Record<number, string[]> = {};
  if (productoIds.length > 0) {
    const placeholders = productoIds.map(() => "?").join(",");
    const tallasResult = await query(
      `SELECT v.producto_id, STRING_AGG(DISTINCT av.valor, ',') as tallas
       FROM variantes_producto v
       JOIN atributos_variante av ON av.variante_id = v.id
       WHERE v.producto_id IN (${placeholders}) AND av.valor IN ('XS','S','M','L','XL','XXL') AND v.stock > 0
       GROUP BY v.producto_id`,
      productoIds as (string | number | boolean | null)[],
    );
    (tallasResult as Record<string, unknown>[]).forEach((row) => {
      const pid = Number(row.producto_id);
      const tallas = String(row.tallas || "")
        .split(",")
        .filter(Boolean);
      tallasPorProducto[pid] = tallas;
    });
  }

  const productosConTallas = (productos as Record<string, unknown>[]).map(
    (p) => ({
      ...p,
      tallas: tallasPorProducto[Number(p.id)] || [],
    }),
  ) as Producto[];

  return { productos: productosConTallas, total: productosConTallas.length };
}

export async function getProductBySlug(slug: string): Promise<{
  producto: Record<string, unknown> | null;
  variantes: Record<string, unknown>[];
  imagenes: Record<string, unknown>[];
  resenas: Record<string, unknown>[];
}> {
  const producto = await queryOne(
    `SELECT p.*, c.nombre as categoria_nombre, m.nombre as marca_nombre
     FROM productos p
     LEFT JOIN categorias c ON p.categoria_id = c.id
     LEFT JOIN marcas m ON p.marca_id = m.id
     WHERE p.slug = ? AND p.estado = 'publicado'`,
    [slug],
  );

  if (!producto) {
    return { producto: null, variantes: [], imagenes: [], resenas: [] };
  }

  const productoId = (producto as Record<string, unknown>).id as number;

  const variantes = await query(
    `SELECT v.*, (SELECT STRING_AGG(valor, ',') FROM atributos_variante WHERE variante_id = v.id) as atributos
     FROM variantes_producto v WHERE v.producto_id = ? AND v.stock > 0`,
    [productoId],
  );

  const imagenes = await query(
    "SELECT url_imagen FROM imagenes_producto WHERE producto_id = ? ORDER BY es_principal DESC, orden ASC",
    [productoId],
  );

  const resenas = await query(
    `SELECT r.*, u.nombre as usuario_nombre, u.url_avatar
     FROM resenas r JOIN usuarios u ON r.usuario_id = u.id
     WHERE r.producto_id = ? AND r.aprobada = TRUE ORDER BY r.creado_en DESC`,
    [productoId],
  );

  return {
    producto: producto as Record<string, unknown>,
    variantes,
    imagenes,
    resenas,
  };
}
