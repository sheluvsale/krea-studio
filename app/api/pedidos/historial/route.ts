import { NextRequest, NextResponse } from "next/server";
import { query, queryOne } from "@/app/lib/db";
import { getCurrentUser } from "@/app/lib/session";

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user?.userId) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const pedidoId = searchParams.get("pedido_id");

    if (!pedidoId) {
      return NextResponse.json(
        { error: "ID de pedido requerido." },
        { status: 400 },
      );
    }

    const pedido = await queryOne(
      "SELECT id, cliente_id FROM pedidos WHERE id = ?",
      [pedidoId],
    );

    if (!pedido) {
      return NextResponse.json(
        { error: "Pedido no encontrado." },
        { status: 404 },
      );
    }

    const p = pedido as Record<string, unknown>;
    const esAdmin = user.rol === "admin";
    const esCliente = Number(p.cliente_id) === user.userId;

    if (!esAdmin && !esCliente) {
      return NextResponse.json(
        { error: "No autorizado." },
        { status: 403 },
      );
    }

    const historial = await query(
      `SELECT h.*, u.nombre as cambiado_por_nombre, u.apellido as cambiado_por_apellido
       FROM historial_estados_pedido h
       LEFT JOIN usuarios u ON h.cambiado_por = u.id
       WHERE h.pedido_id = ?
       ORDER BY h.creado_en DESC`,
      [pedidoId],
    );

    return NextResponse.json({ historial: historial || [] });
  } catch (error) {
    console.error("Historial pedido error:", error);
    return NextResponse.json(
      { error: "Error al cargar historial." },
      { status: 500 },
    );
  }
}
