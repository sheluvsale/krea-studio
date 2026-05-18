import { NextRequest, NextResponse } from "next/server";
import { execute, queryOne } from "@/app/lib/db";
import { getCurrentUser } from "@/app/lib/session";

export async function GET() {
  const user = await getCurrentUser();
  if (!user?.userId) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  try {
    let prefs = await queryOne(
      "SELECT * FROM preferencias_usuario WHERE usuario_id = ?",
      [user.userId],
    );

    if (!prefs) {
      await execute(
        `INSERT INTO preferencias_usuario
         (usuario_id, notificaciones_email, notificaciones_push, newsletter, idioma, moneda, tema)
         VALUES (?, true, false, false, 'es', 'DOP', 'dark')`,
        [user.userId],
      );
      prefs = await queryOne(
        "SELECT * FROM preferencias_usuario WHERE usuario_id = ?",
        [user.userId],
      );
    }

    return NextResponse.json(prefs);
  } catch (error) {
    console.error("Preferences fetch error:", error);
    return NextResponse.json(
      { error: "Error al cargar preferencias." },
      { status: 500 },
    );
  }
}

export async function PUT(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user?.userId) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      notificaciones_email,
      notificaciones_push,
      newsletter,
      idioma,
      moneda,
      tema,
    } = body;

    const existing = await queryOne(
      "SELECT id FROM preferencias_usuario WHERE usuario_id = ?",
      [user.userId],
    );

    if (!existing) {
      await execute(
        `INSERT INTO preferencias_usuario
         (usuario_id, notificaciones_email, notificaciones_push, newsletter, idioma, moneda, tema)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          user.userId,
          notificaciones_email ?? true,
          notificaciones_push ?? false,
          newsletter ?? false,
          idioma ?? "es",
          moneda ?? "DOP",
          tema ?? "dark",
        ],
      );
    } else {
      await execute(
        `UPDATE preferencias_usuario SET
         notificaciones_email = ?,
         notificaciones_push = ?,
         newsletter = ?,
         idioma = ?,
         moneda = ?,
         tema = ?,
         actualizado_en = CURRENT_TIMESTAMP
         WHERE usuario_id = ?`,
        [
          notificaciones_email ?? true,
          notificaciones_push ?? false,
          newsletter ?? false,
          idioma ?? "es",
          moneda ?? "DOP",
          tema ?? "dark",
          user.userId,
        ],
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Preferences update error:", error);
    return NextResponse.json(
      { error: "Error al actualizar preferencias." },
      { status: 500 },
    );
  }
}
