import { NextRequest, NextResponse } from "next/server";
import { execute, queryOne } from "@/app/lib/db";
import { getCurrentUser, getSession } from "@/app/lib/session";

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
    const updatedUser = await queryOne<{
      id: number;
      nombre: string;
      apellido: string;
      telefono: string | null;
      correo: string;
      rol: string;
    }>(
      "SELECT id, nombre, apellido, telefono, correo, rol FROM usuarios WHERE id = ?",
      [user.userId],
    );
    console.log("Profile update - Updated user:", updatedUser);

    // Actualizar la sesión para que getCurrentUser() devuelva datos frescos
    // en futuros requests (sino el dashboard mostraría valores cacheados).
    if (updatedUser) {
      const session = await getSession();
      session.nombre = updatedUser.nombre;
      session.apellido = updatedUser.apellido;
      await session.save();
    }

    return NextResponse.json({ success: true, usuario: updatedUser });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: "Error al actualizar." },
      { status: 500 },
    );
  }
}
