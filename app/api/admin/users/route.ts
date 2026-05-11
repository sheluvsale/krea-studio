import { NextRequest, NextResponse } from "next/server";
import { query, execute } from "@/app/lib/db";
import { getCurrentUser } from "@/app/lib/session";

export async function GET() {
  const user = await getCurrentUser();
  if (!user?.userId || user.rol !== "admin") {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  try {
    const usuarios = await query(
      `SELECT id, nombre, apellido, correo, telefono, rol, activo, creado_en
       FROM usuarios ORDER BY creado_en DESC`,
    );
    return NextResponse.json({ usuarios });
  } catch (error) {
    console.error("Admin users error:", error);
    return NextResponse.json({ error: "Error." }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user?.userId || user.rol !== "admin") {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  try {
    const { id, rol, activo } = await req.json();
    await execute(`UPDATE usuarios SET rol = ?, activo = ? WHERE id = ?`, [
      rol,
      activo ? true : false,
      id,
    ]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update user error:", error);
    return NextResponse.json(
      { error: "Error al actualizar." },
      { status: 500 },
    );
  }
}
