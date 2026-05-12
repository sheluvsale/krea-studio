import { NextRequest, NextResponse } from "next/server";
import { execute, queryOne } from "@/app/lib/db";
import { getCurrentUser } from "@/app/lib/session";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user?.userId) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const paymentId = parseInt(params.id);

  try {
    const body = await req.json();
    const { tipo, nombre, numero_tarjeta, titular, fecha_expiracion, es_default } = body;

    // Check if payment method belongs to user
    const payment = await queryOne(
      "SELECT usuario_id FROM metodos_pago_usuario WHERE id = ?",
      [paymentId]
    );

    if (!payment || payment.usuario_id !== user.userId) {
      return NextResponse.json({ error: "Método de pago no encontrado." }, { status: 404 });
    }

    // If setting as default, remove default from other payment methods
    if (es_default) {
      await execute(
        "UPDATE metodos_pago_usuario SET es_default = false WHERE usuario_id = ? AND id != ?",
        [user.userId, paymentId]
      );
    }

    await execute(
      `UPDATE metodos_pago_usuario SET tipo = ?, nombre = ?, numero_tarjeta = ?, titular = ?, fecha_expiracion = ?, es_default = ?, actualizado_en = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [tipo, nombre, numero_tarjeta || null, titular || null, fecha_expiracion || null, es_default || false, paymentId]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Payment method update error:", error);
    return NextResponse.json({ error: "Error al actualizar método de pago." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user?.userId) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const paymentId = parseInt(params.id);

  try {
    // Check if payment method belongs to user
    const payment = await queryOne(
      "SELECT usuario_id, es_default FROM metodos_pago_usuario WHERE id = ?",
      [paymentId]
    );

    if (!payment || payment.usuario_id !== user.userId) {
      return NextResponse.json({ error: "Método de pago no encontrado." }, { status: 404 });
    }

    if (payment.es_default) {
      return NextResponse.json({ error: "No puedes eliminar el método de pago predeterminado." }, { status: 400 });
    }

    await execute(
      "UPDATE metodos_pago_usuario SET activo = false WHERE id = ?",
      [paymentId]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Payment method deletion error:", error);
    return NextResponse.json({ error: "Error al eliminar método de pago." }, { status: 500 });
  }
}
