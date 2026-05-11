import { NextRequest, NextResponse } from "next/server";
import { query, execute } from "@/app/lib/db";
import { getCurrentUser } from "@/app/lib/session";

export async function GET() {
  const user = await getCurrentUser();
  if (!user?.userId || user.rol !== "admin") {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  try {
    const mensajes = await query(
      `SELECT id, nombre, email, asunto, mensaje, leido, creado_en
       FROM mensajes_contacto ORDER BY creado_en DESC`
    );
    return NextResponse.json({ mensajes });
  } catch (error) {
    console.error("Admin contacts error:", error);
    return NextResponse.json({ error: "Error." }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user?.userId || user.rol !== "admin") {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  try {
    const { id, leido } = await req.json();
    await execute(
      `UPDATE mensajes_contacto SET leido = ? WHERE id = ?`,
      [leido ? 1 : 0, id]
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update contact error:", error);
    return NextResponse.json({ error: "Error al actualizar." }, { status: 500 });
  }
}
