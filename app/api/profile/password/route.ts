import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { queryOne, execute } from "@/app/lib/db";
import { getCurrentUser } from "@/app/lib/session";

export async function PUT(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    console.log("Step 1 - User:", user?.userId);

    if (!user?.userId) {
      return NextResponse.json({ error: "No autorizado." }, { status: 401 });
    }

    const { currentPassword, newPassword } = await req.json();
    console.log("Step 2 - Passwords received");

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Ambas contraseñas son requeridas." },
        { status: 400 },
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "La nueva contraseña debe tener al menos 6 caracteres." },
        { status: 400 },
      );
    }

    const row = await queryOne<{ contrasena_hash: string }>(
      "SELECT contrasena_hash FROM usuarios WHERE id = ?",
      [user.userId],
    );
    console.log("Step 3 - User found:", !!row);

    if (!row) {
      return NextResponse.json(
        { error: "Usuario no encontrado." },
        { status: 404 },
      );
    }

    console.log("Step 4 - Comparing passwords");
    if (!bcrypt.compareSync(currentPassword, row.contrasena_hash)) {
      return NextResponse.json(
        { error: "Contraseña actual incorrecta." },
        { status: 401 },
      );
    }

    console.log("Step 5 - Hashing new password");
    const hashed = bcrypt.hashSync(newPassword, 10);

    console.log("Step 6 - Updating database");
    const result = await execute(
      "UPDATE usuarios SET contrasena_hash = ? WHERE id = ?",
      [hashed, user.userId],
    );

    console.log("Step 7 - Update result:", result);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Password change error:", error);
    return NextResponse.json(
      { error: error?.message || "Error al cambiar contraseña." },
      { status: 500 },
    );
  }
}
