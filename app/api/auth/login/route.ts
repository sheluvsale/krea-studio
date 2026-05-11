import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { queryOne } from "@/app/lib/db";
import { getSession } from "@/app/lib/session";

interface UserRow {
  id: number;
  nombre: string;
  apellido: string;
  correo: string;
  contrasena_hash: string;
  rol: string;
}

export async function POST(req: NextRequest) {
  try {
    const { correo, contrasena } = await req.json();

    if (!correo || !contrasena) {
      return NextResponse.json(
        { error: "Por favor, completa todos los campos." },
        { status: 400 }
      );
    }

    const user = await queryOne<UserRow>(
      "SELECT id, nombre, apellido, correo, contrasena_hash, rol FROM usuarios WHERE correo = ? AND activo = 1",
      [correo]
    );

    if (!user || !bcrypt.compareSync(contrasena, user.contrasena_hash)) {
      return NextResponse.json(
        { error: "Correo o contraseña incorrectos." },
        { status: 401 }
      );
    }

    const session = await getSession();
    session.userId = user.id;
    session.nombre = user.nombre;
    session.apellido = user.apellido;
    session.correo = user.correo;
    session.rol = user.rol;
    session.isLoggedIn = true;
    await session.save();

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        nombre: user.nombre,
        apellido: user.apellido,
        correo: user.correo,
        rol: user.rol,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Error del servidor." },
      { status: 500 }
    );
  }
}
