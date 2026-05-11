import { NextRequest, NextResponse } from "next/server";
import { query, execute } from "@/app/lib/db";
import { getCurrentUser } from "@/app/lib/session";

export async function GET() {
  const user = await getCurrentUser();
  if (!user?.userId || user.rol !== "admin") {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  try {
    const resenas = await query(
      `SELECT r.id, r.producto_id, r.usuario_id, r.calificacion, r.comentario, r.aprobada, r.creado_en,
              p.nombre as producto_nombre, u.nombre as usuario_nombre, u.apellido as usuario_apellido
       FROM reseñas r
       JOIN productos p ON r.producto_id = p.id
       JOIN usuarios u ON r.usuario_id = u.id
       ORDER BY r.creado_en DESC`
    );
    return NextResponse.json({ resenas });
  } catch (error) {
    console.error("Admin reviews error:", error);
    return NextResponse.json({ error: "Error." }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user?.userId || user.rol !== "admin") {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  try {
    const { id, aprobada } = await req.json();
    await execute("UPDATE reseñas SET aprobada = ? WHERE id = ?", [aprobada ? 1 : 0, id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update review error:", error);
    return NextResponse.json({ error: "Error al actualizar." }, { status: 500 });
  }
}
