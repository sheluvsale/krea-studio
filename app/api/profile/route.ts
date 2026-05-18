import { NextRequest, NextResponse } from "next/server";
import { execute, queryOne } from "@/app/lib/db";
import { getCurrentUser } from "@/app/lib/session";

export async function PUT(req: NextRequest) {
  const user = await getCurrentUser();
  console.log("Profile update - User:", user?.userId);

  if (!user?.userId) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  try {
    const body = await req.json();
    console.log("Profile update - Body:", body);
    const { nombre, apellido, telefono } = body;

    console.log("Profile update - Executing UPDATE with:", {
      nombre,
      apellido,
      telefono,
      userId: user.userId,
    });
    const updateResult = await execute(
      "UPDATE usuarios SET nombre = ?, apellido = ?, telefono = ? WHERE id = ?",
      [nombre, apellido, telefono || null, user.userId],
    );
    console.log("Profile update - Update result:", updateResult);

    if (updateResult.affectedRows === 0) {
      console.error("Profile update - No rows affected!");
      return NextResponse.json(
        { error: "No se pudo actualizar el perfil." },
        { status: 500 },
      );
    }

    // Devolver los datos actualizados
    const updatedUser = await queryOne(
      "SELECT id, nombre, apellido, telefono, correo, rol FROM usuarios WHERE id = ?",
      [user.userId],
    );
    console.log("Profile update - Updated user:", updatedUser);

    return NextResponse.json({ success: true, usuario: updatedUser });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: "Error al actualizar." },
      { status: 500 },
    );
  }
}
