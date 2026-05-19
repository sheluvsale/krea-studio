import { NextRequest, NextResponse } from "next/server";
import { query } from "@/app/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const productoId = searchParams.get("producto_id");
  if (!productoId) {
    return NextResponse.json({ error: "producto_id requerido." }, { status: 400 });
  }

  try {
    const secciones = await query(
      `SELECT id, tipo, titulo, contenido, orden
       FROM producto_secciones
       WHERE producto_id = ? AND activo = true
       ORDER BY orden ASC, creado_en DESC`,
      [Number(productoId)],
    );
    return NextResponse.json({ secciones: secciones || [] });
  } catch (error) {
    console.error("Error fetching product sections:", error);
    return NextResponse.json({ error: "Error al obtener secciones." }, { status: 500 });
  }
}
