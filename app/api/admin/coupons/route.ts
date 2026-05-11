import { NextRequest, NextResponse } from "next/server";
import { query, execute } from "@/app/lib/db";
import { getCurrentUser } from "@/app/lib/session";

export async function GET() {
  const user = await getCurrentUser();
  if (!user?.userId || user.rol !== "admin") {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  try {
    const cupones = await query(
      "SELECT id, codigo, tipo_descuento, valor, minimo_compra, limite_usos, usos_actuales, fecha_fin, activo FROM cupones ORDER BY creado_en DESC"
    );
    return NextResponse.json({ cupones });
  } catch (error) {
    console.error("Admin coupons error:", error);
    return NextResponse.json({ error: "Error." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user?.userId || user.rol !== "admin") {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  try {
    const body = await req.json();
    await execute(
      `INSERT INTO cupones (codigo, tipo_descuento, valor, minimo_compra, limite_usos, fecha_fin, activo)
       VALUES (?, ?, ?, ?, ?, ?, 1)`,
      [body.codigo, body.tipo_descuento, body.valor, body.minimo_compra, body.limite_usos, body.fecha_fin || null]
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Create coupon error:", error);
    return NextResponse.json({ error: "Error al crear." }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user?.userId || user.rol !== "admin") {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  try {
    const { id, activo } = await req.json();
    await execute("UPDATE cupones SET activo = ? WHERE id = ?", [activo ? 1 : 0, id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update coupon error:", error);
    return NextResponse.json({ error: "Error al actualizar." }, { status: 500 });
  }
}
