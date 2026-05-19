import { NextRequest, NextResponse } from "next/server";
import { queryOne, execute, query } from "@/app/lib/db";
import { getCurrentUser } from "@/app/lib/session";

// GET /api/chat/conversations - Listar conversaciones del usuario
export async function GET() {
  const user = await getCurrentUser();
  if (!user?.userId) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  try {
    const conversations = await query(
      `SELECT c.*, 
              p.numero_pedido,
              u.nombre as cliente_nombre,
              u.apellido as cliente_apellido,
              COALESCE(mnl.cantidad, 0) as no_leidos
       FROM conversaciones c
       JOIN participantes_conversacion pc ON c.id = pc.conversacion_id
       LEFT JOIN pedidos p ON c.pedido_id = p.id
       LEFT JOIN usuarios u ON p.cliente_id = u.id
       LEFT JOIN mensajes_no_leidos mnl ON mnl.conversacion_id = c.id AND mnl.usuario_id = ?
       WHERE pc.usuario_id = ?
       ORDER BY c.ultimo_mensaje_en DESC NULLS LAST, c.creado_en DESC`,
      [user.userId, user.userId],
    );

    return NextResponse.json({ conversations });
  } catch (error) {
    console.error("Chat conversations error:", error);
    return NextResponse.json({ error: "Error al cargar conversaciones." }, { status: 500 });
  }
}

// POST /api/chat/conversations - Crear nueva conversación
export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user?.userId) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { pedido_id, tipo = "soporte", asunto } = body;

    // Verificar que el usuario tiene acceso al pedido (si aplica)
    if (pedido_id) {
      const pedido = await queryOne(
        "SELECT id, cliente_id FROM pedidos WHERE id = ?",
        [pedido_id],
      );
      if (!pedido) {
        return NextResponse.json({ error: "Pedido no encontrado." }, { status: 404 });
      }
      const p = pedido as Record<string, unknown>;
      // Si no es admin/soporte, solo puede crear chat de sus propios pedidos
      if (user.rol !== "admin" && Number(p.cliente_id) !== user.userId) {
        return NextResponse.json({ error: "No autorizado." }, { status: 403 });
      }
    }

    const result = await execute(
      `INSERT INTO conversaciones (pedido_id, tipo, estado, asunto, creado_por)
       VALUES (?, ?, 'abierta', ?, ?)`,
      [pedido_id || null, tipo, asunto || null, user.userId],
    );

    const conversacionId = Number(
      (result as Record<string, unknown>).insertId ||
      (result as Record<string, unknown>).lastInsertRowid,
    );

    // Agregar al creador como participante
    const rol = user.rol === "admin" ? "soporte" : "cliente";
    await execute(
      `INSERT INTO participantes_conversacion (conversacion_id, usuario_id, rol)
       VALUES (?, ?, ?)`,
      [conversacionId, user.userId, rol],
    );

    // Si es un chat de pedido, agregar automáticamente al otro participante
    if (pedido_id) {
      const pedido = await queryOne(
        "SELECT cliente_id FROM pedidos WHERE id = ?",
        [pedido_id],
      );
      if (pedido) {
        const p = pedido as Record<string, unknown>;
        const clienteId = Number(p.cliente_id);
        
        // Verificar que el cliente no sea el mismo que el creador
        if (clienteId !== user.userId) {
          await execute(
            `INSERT INTO participantes_conversacion (conversacion_id, usuario_id, rol)
             VALUES (?, ?, 'cliente')
             ON CONFLICT (conversacion_id, usuario_id) DO NOTHING`,
            [conversacionId, clienteId],
          );
        }

        // Si el creador es el cliente, agregar a un admin como soporte
        if (rol === "cliente") {
          const admin = await queryOne(
            "SELECT id FROM usuarios WHERE rol = 'admin' LIMIT 1",
          );
          if (admin) {
            const a = admin as Record<string, unknown>;
            await execute(
              `INSERT INTO participantes_conversacion (conversacion_id, usuario_id, rol)
               VALUES (?, ?, 'soporte')
               ON CONFLICT (conversacion_id, usuario_id) DO NOTHING`,
              [conversacionId, Number(a.id)],
            );
          }
        }
      }
    }

    return NextResponse.json({ success: true, id: conversacionId });
  } catch (error) {
    console.error("Create conversation error:", error);
    return NextResponse.json({ error: "Error al crear conversación." }, { status: 500 });
  }
}
