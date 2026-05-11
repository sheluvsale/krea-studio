import { NextRequest, NextResponse } from "next/server";
import { execute } from "@/app/lib/db";
import { getCurrentUser } from "@/app/lib/session";

export async function PUT(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user?.userId) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { nombre, apellido, telefono } = body;

    await execute(
      "UPDATE usuarios SET nombre = ?, apellido = ?, telefono = ? WHERE id = ?",
      [nombre, apellido, telefono || null, user.userId]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: "Error al actualizar." }, { status: 500 });
  }
}
