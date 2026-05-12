import { NextRequest, NextResponse } from "next/server";
import { execute, query } from "@/app/lib/db";
import { getCurrentUser } from "@/app/lib/session";

export async function GET() {
  const user = await getCurrentUser();
  if (!user?.userId) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  try {
    const metodos_pago = await query(
      `SELECT id, tipo, nombre, numero_tarjeta, titular, fecha_expiracion, es_default, activo
       FROM metodos_pago_usuario WHERE usuario_id = ? AND activo = true ORDER BY es_default DESC, creado_en DESC`,
      [user.userId],
    );

    return NextResponse.json(metodos_pago);
  } catch (error) {
    console.error("Payments fetch error:", error);
    return NextResponse.json({ error: "Error al cargar métodos de pago." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user?.userId) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { tipo, nombre, numero_tarjeta, titular, fecha_expiracion, es_default } = body;

    // If setting as default, remove default from other payment methods
    if (es_default) {
      await execute(
        "UPDATE metodos_pago_usuario SET es_default = false WHERE usuario_id = ?",
        [user.userId]
      );
    }

    const result = await execute(
      `INSERT INTO metodos_pago_usuario (usuario_id, tipo, nombre, numero_tarjeta, titular, fecha_expiracion, es_default, activo)
       VALUES (?, ?, ?, ?, ?, ?, ?, true)`,
      [user.userId, tipo, nombre, numero_tarjeta || null, titular || null, fecha_expiracion || null, es_default || false]
    );

    return NextResponse.json({ success: true, id: result.insertId });
  } catch (error) {
    console.error("Payment method creation error:", error);
    return NextResponse.json({ error: "Error al crear método de pago." }, { status: 500 });
  }
}
