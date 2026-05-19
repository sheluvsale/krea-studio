import { NextRequest, NextResponse } from "next/server";
import { queryOne, execute, query } from "@/app/lib/db";
import { getCurrentUser } from "@/app/lib/session";

// GET /api/chat/messages?conversacion_id=X - Obtener mensajes de una conversación
export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user?.userId) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const conversacionId = searchParams.get("conversacion_id");

    if (!conversacionId) {
      return NextResponse.json(
        { error: "conversacion_id requerido." },
        { status: 400 },
      );
    }

    // Verificar que el usuario es participante
    const participante = await queryOne(
      `SELECT rol FROM participantes_conversacion 
       WHERE conversacion_id = ? AND usuario_id = ?`,
      [Number(conversacionId), user.userId],
    );

    if (!participante && user.rol !== "admin") {
      return NextResponse.json({ error: "No autorizado." }, { status: 403 });
    }

    const messages = await query(
      `SELECT m.*, 
              u.nombre as remitente_nombre, 
              u.apellido as remitente_apellido,
              u.url_avatar as remitente_avatar
       FROM mensajes_chat m
       JOIN usuarios u ON m.remitente_id = u.id
       WHERE m.conversacion_id = ?
       ORDER BY m.creado_en ASC`,
      [Number(conversacionId)],
    );

    return NextResponse.json({ messages });
  } catch (error) {
    console.error("Chat messages error:", error);
    return NextResponse.json({ error: "Error al cargar mensajes." }, { status: 500 });
  }
}

// POST /api/chat/messages - Enviar mensaje
export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user?.userId) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { conversacion_id, contenido, tipo = "texto" } = body;

    if (!conversacion_id || !contenido?.trim()) {
      return NextResponse.json(
        { error: "conversacion_id y contenido son requeridos." },
        { status: 400 },
      );
    }

    const conversacionId = Number(conversacion_id);

    // Verificar que el usuario es participante
    const participante = await queryOne(
      `SELECT rol FROM participantes_conversacion 
       WHERE conversacion_id = ? AND usuario_id = ?`,
      [conversacionId, user.userId],
    );

    if (!participante && user.rol !== "admin") {
      return NextResponse.json({ error: "No autorizado." }, { status: 403 });
    }

    // Insertar mensaje
    const result = await execute(
      `INSERT INTO mensajes_chat (conversacion_id, remitente_id, contenido, tipo, estado)
       VALUES (?, ?, ?, ?, 'enviado')`,
      [conversacionId, user.userId, contenido.trim(), tipo],
    );

    const mensajeId = Number(
      (result as Record<string, unknown>).insertId ||
      (result as Record<string, unknown>).lastInsertRowid,
    );

    // Actualizar conversación con último mensaje
    await execute(
      `UPDATE conversaciones 
       SET ultimo_mensaje_en = CURRENT_TIMESTAMP, 
           ultimo_mensaje_preview = ?,
           actualizado_en = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [contenido.trim().substring(0, 200), conversacionId],
    );

    // Actualizar contadores de no leídos para los otros participantes
    const otrosParticipantes = await query(
      `SELECT usuario_id FROM participantes_conversacion 
       WHERE conversacion_id = ? AND usuario_id != ?`,
      [conversacionId, user.userId],
    );

    for (const p of otrosParticipantes) {
      const op = p as Record<string, unknown>;
      const otroId = Number(op.usuario_id);
      
      await execute(
        `INSERT INTO mensajes_no_leidos (conversacion_id, usuario_id, cantidad, ultimo_mensaje_id)
         VALUES (?, ?, 1, ?)
         ON CONFLICT (conversacion_id, usuario_id) 
         DO UPDATE SET cantidad = mensajes_no_leidos.cantidad + 1, 
                       ultimo_mensaje_id = ?,
                       actualizado_en = CURRENT_TIMESTAMP`,
        [conversacionId, otroId, mensajeId, mensajeId],
      );
    }

    return NextResponse.json({ success: true, id: mensajeId });
  } catch (error) {
    console.error("Send message error:", error);
    return NextResponse.json({ error: "Error al enviar mensaje." }, { status: 500 });
  }
}
