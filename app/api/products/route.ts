import { NextRequest, NextResponse } from "next/server";
import { query } from "@/app/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";
  const categoria = searchParams.get("categoria") || "";
  const marca = searchParams.get("marca") || "0";
  const precioMin = searchParams.get("precio_min") || "0";
  const precioMax = searchParams.get("precio_max") || "0";
  const destacados = searchParams.get("destacados") || "";
  const nuevos = searchParams.get("nuevos") || "";
  const orden = searchParams.get("orden") || "destacados";

  try {
    let sql = `SELECT p.*, c.nombre as categoria_nombre, c.slug as categoria_slug, m.nombre as marca_nombre
               FROM productos p
               LEFT JOIN categorias c ON p.categoria_id = c.id
               LEFT JOIN marcas m ON p.marca_id = m.id
               WHERE p.estado = 'publicado'`;
    const params: (string | number)[] = [];

    if (q) {
      sql += " AND (p.nombre LIKE ? OR p.descripcion LIKE ?)";
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
      sql += " AND p.destacado = 1";
    }
    if (nuevos === "1") {
      sql += " AND p.nuevo = 1";
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

    // Obtener tallas disponibles por producto
    const productoIds = (productos as Record<string, unknown>[])
      .map((p) => Number(p.id))
      .filter((id) => !isNaN(id));
    const tallasPorProducto: Record<number, string[]> = {};
    if (productoIds.length > 0) {
      const placeholders = productoIds.map(() => "?").join(",");
      const tallasResult = await query(
        `SELECT v.producto_id, GROUP_CONCAT(DISTINCT av.valor SEPARATOR ',') as tallas
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
    );

    return NextResponse.json({
      success: true,
      productos: productosConTallas,
      total: productosConTallas.length,
    });
  } catch (error) {
    console.error("Products error:", error);
    return NextResponse.json(
      { error: "Error al obtener productos." },
      { status: 500 },
    );
  }
}
