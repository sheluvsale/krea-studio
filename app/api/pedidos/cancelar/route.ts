import { NextRequest, NextResponse } from "next/server";
import { queryOne, execute } from "@/app/lib/db";
import { getCurrentUser } from "@/app/lib/session";

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user?.userId) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { pedido_id } = body;

    if (!pedido_id) {
      return NextResponse.json(
        { error: "ID de pedido requerido." },
        { status: 400 },
      );
    }

    const pedido = await queryOne(
      "SELECT id, estado, creado_en, cliente_id FROM pedidos WHERE id = ?",
      [pedido_id],
    );

    if (!pedido) {
      return NextResponse.json(
        { error: "Pedido no encontrado." },
        { status: 404 },
      );
    }

    const p = pedido as Record<string, unknown>;

    if (Number(p.cliente_id) !== user.userId) {
      return NextResponse.json(
        { error: "No autorizado para cancelar este pedido." },
        { status: 403 },
      );
    }

    if (String(p.estado) === "cancelado") {
      return NextResponse.json(
        { error: "El pedido ya está cancelado." },
        { status: 400 },
      );
    }

    const creadoEn = new Date(String(p.creado_en));
    const ahora = new Date();
    const diffMs = ahora.getTime() - creadoEn.getTime();
    const diffHoras = diffMs / (1000 * 60 * 60);

    if (diffHoras > 1) {
      return NextResponse.json(
        {
          error:
            "No puedes cancelar un pedido después de la primera hora.",
        },
        { status: 400 },
      );
    }

    await execute(
      "UPDATE pedidos SET estado = 'cancelado' WHERE id = ?",
      [pedido_id],
    );

    await execute(
      `INSERT INTO historial_estados_pedido (pedido_id, estado_anterior, estado_nuevo, justificacion, cambiado_por, origen)
       VALUES (?, ?, ?, ?, ?, 'cliente')`,
      [pedido_id, String(p.estado), "cancelado", "Cancelado por el cliente", user.userId],
    );

    return NextResponse.json({
      success: true,
      message: "Pedido cancelado correctamente.",
    });
  } catch (error) {
    console.error("Cancelar pedido error:", error);
    return NextResponse.json(
      { error: "Error al cancelar el pedido." },
      { status: 500 },
    );
  }
}
