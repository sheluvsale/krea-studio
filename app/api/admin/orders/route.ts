import { NextRequest, NextResponse } from "next/server";
import { query, queryOne, execute } from "@/app/lib/db";
import { getCurrentUser } from "@/app/lib/session";

export async function GET() {
  const user = await getCurrentUser();
  if (!user?.userId || !["admin", "vendedor"].includes(user.rol || "")) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  try {
    const pedidos = await query(
      `SELECT p.*, u.nombre as cliente_nombre, u.apellido as cliente_apellido, u.correo as cliente_correo
       FROM pedidos p
       JOIN usuarios u ON p.cliente_id = u.id
       ORDER BY p.creado_en DESC`,
    );
    return NextResponse.json({ pedidos });
  } catch (error) {
    console.error("Admin orders error:", error);
    return NextResponse.json({ error: "Error." }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user?.userId || !["admin", "vendedor"].includes(user.rol || "")) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  try {
    const { id, estado, justificacion } = await req.json();

    if (!justificacion || String(justificacion).trim().length < 5) {
      return NextResponse.json(
        {
          error:
            "Debes proporcionar una justificación de al menos 5 caracteres.",
        },
        { status: 400 },
      );
    }

    const pedidoActual = await queryOne(
      "SELECT estado FROM pedidos WHERE id = ?",
      [id],
    );

    if (!pedidoActual) {
      return NextResponse.json(
        { error: "Pedido no encontrado." },
        { status: 404 },
      );
    }

    const estadoAnterior = String(
      (pedidoActual as Record<string, unknown>).estado,
    );

    await execute("UPDATE pedidos SET estado = ? WHERE id = ?", [estado, id]);

    await execute(
      `INSERT INTO historial_estados_pedido (pedido_id, estado_anterior, estado_nuevo, justificacion, cambiado_por, origen)
       VALUES (?, ?, ?, ?, ?, 'admin')`,
      [id, estadoAnterior, estado, String(justificacion).trim(), user.userId],
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update order error:", error);
    return NextResponse.json({ error: "Error." }, { status: 500 });
  }
}
