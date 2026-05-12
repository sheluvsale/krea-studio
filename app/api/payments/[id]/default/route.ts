import { NextRequest, NextResponse } from "next/server";
import { execute, queryOne } from "@/app/lib/db";
import { getCurrentUser } from "@/app/lib/session";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getCurrentUser();
  if (!user?.userId) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const { id } = await params;
  const paymentId = parseInt(id);

  try {
    // Check if payment method belongs to user
    const payment = await queryOne(
      "SELECT usuario_id FROM metodos_pago_usuario WHERE id = ?",
      [paymentId],
    );

    if (!payment || payment.usuario_id !== user.userId) {
      return NextResponse.json(
        { error: "Método de pago no encontrado." },
        { status: 404 },
      );
    }

    // Remove default from all payment methods
    await execute(
      "UPDATE metodos_pago_usuario SET es_default = false WHERE usuario_id = ?",
      [user.userId],
    );

    // Set default to selected payment method
    await execute(
      "UPDATE metodos_pago_usuario SET es_default = true WHERE id = ?",
      [paymentId],
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Set default payment error:", error);
    return NextResponse.json(
      { error: "Error al establecer método de pago predeterminado." },
      { status: 500 },
    );
  }
}
