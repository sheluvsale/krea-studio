import { NextRequest, NextResponse } from "next/server";
import { queryOne, query } from "@/app/lib/db";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  try {
    const producto = await queryOne(
      `SELECT p.*, c.nombre as categoria_nombre, m.nombre as marca_nombre
       FROM productos p
       LEFT JOIN categorias c ON p.categoria_id = c.id
       LEFT JOIN marcas m ON p.marca_id = m.id
       WHERE p.slug = ? AND p.estado = 'publicado'`,
      [slug],
    );

    if (!producto) {
      return NextResponse.json(
        { error: "Producto no encontrado." },
        { status: 404 },
      );
    }

    const variantes = await query(
      `SELECT v.*, (SELECT STRING_AGG(valor, ',') FROM atributos_variante WHERE variante_id = v.id) as atributos
       FROM variantes_producto v WHERE v.producto_id = ? AND v.stock > 0`,
      [(producto as Record<string, unknown>).id as number],
    );

    const imagenes = await query(
      "SELECT url_imagen FROM imagenes_producto WHERE producto_id = ? ORDER BY es_principal DESC, orden ASC",
      [(producto as Record<string, unknown>).id as number],
    );

    const resenas = await query(
      `SELECT r.*, u.nombre as usuario_nombre, u.url_avatar
       FROM reseñas r JOIN usuarios u ON r.usuario_id = u.id
       WHERE r.producto_id = ? AND r.aprobada = TRUE ORDER BY r.creado_en DESC`,
      [(producto as Record<string, unknown>).id as number],
    );

    return NextResponse.json({ producto, variantes, imagenes, resenas });
  } catch (error) {
    console.error("Product detail error:", error);
    return NextResponse.json(
      { error: "Error al obtener producto." },
      { status: 500 },
    );
  }
}
