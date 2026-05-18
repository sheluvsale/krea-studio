import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { queryOne, execute } from "@/app/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { nombre, apellido, correo, telefono, contrasena, confirmar } =
      await req.json();

    if (!nombre || !apellido || !correo || !contrasena) {
      return NextResponse.json(
        { error: "Por favor, completa todos los campos obligatorios." },
        { status: 400 },
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) {
      return NextResponse.json(
        { error: "El correo electrónico no es válido." },
        { status: 400 },
      );
    }

    if (contrasena.length < 6) {
      return NextResponse.json(
        { error: "La contraseña debe tener al menos 6 caracteres." },
        { status: 400 },
      );
    }

    if (contrasena !== confirmar) {
      return NextResponse.json(
        { error: "Las contraseñas no coinciden." },
        { status: 400 },
      );
    }

    const existing = await queryOne(
      "SELECT id FROM usuarios WHERE correo = ?",
      [correo],
    );

    if (existing) {
      return NextResponse.json(
        { error: "Este correo ya está registrado." },
        { status: 409 },
      );
    }

    const hash = bcrypt.hashSync(contrasena, 10);
    await execute(
      "INSERT INTO usuarios (nombre, apellido, correo, telefono, contrasena_hash, rol) VALUES (?, ?, ?, ?, ?, 'cliente')",
      [nombre, apellido, correo, telefono || null, hash],
    );

    return NextResponse.json({
      success: true,
      message: "¡Cuenta creada exitosamente!",
    });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Error al crear la cuenta." },
      { status: 500 },
    );
  }
}
