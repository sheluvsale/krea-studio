import { NextRequest, NextResponse } from "next/server";
import { execute, query, queryOne } from "@/app/lib/db";
import { getCurrentUser } from "@/app/lib/session";

// DELETE chats inactivos por 24h (auto-cleanup) o manual (admin)
export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user?.userId) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { manual, conversacion_id } = body;

    // Manual delete: solo admin
    if (manual) {
      if (user.rol !== "admin") {
        return NextResponse.json(
          { error: "Solo administradores pueden borrar chats manualmente." },
          { status: 403 },
        );
      }

      let targetConversacionId = conversacion_id;

      // Si no hay conversacion_id pero sí pedido_id, buscar la conversación
      if (!targetConversacionId && body.pedido_id) {
        const conv = await queryOne(
          "SELECT id FROM conversaciones WHERE pedido_id = ?",
          [body.pedido_id],
        );
        if (conv) {
          targetConversacionId = Number((conv as Record<string, unknown>).id);
        }
      }

      if (!targetConversacionId) {
        return NextResponse.json(
          { error: "ID de conversación o pedido requerido." },
          { status: 400 },
        );
      }

      await execute("DELETE FROM mensajes_chat WHERE conversacion_id = ?", [
        targetConversacionId,
      ]);
      await execute(
        "DELETE FROM participantes_conversacion WHERE conversacion_id = ?",
        [targetConversacionId],
      );
      await execute(
        "DELETE FROM mensajes_no_leidos WHERE conversacion_id = ?",
        [targetConversacionId],
      );
      await execute("DELETE FROM conversaciones WHERE id = ?", [
        targetConversacionId,
      ]);

      return NextResponse.json({ success: true, message: "Chat eliminado." });
    }

    // Auto cleanup: borrar chats inactivos por 24h
    const chatsInactivos = await query(
      `SELECT id FROM conversaciones
       WHERE ultimo_mensaje_en < NOW() - INTERVAL '24 hours'
       OR (ultimo_mensaje_en IS NULL AND creado_en < NOW() - INTERVAL '24 hours')`,
    );

    let eliminados = 0;
    if (chatsInactivos && chatsInactivos.length > 0) {
      for (const chat of chatsInactivos) {
        const c = chat as Record<string, unknown>;
        const cid = Number(c.id);
        await execute("DELETE FROM mensajes_chat WHERE conversacion_id = ?", [
          cid,
        ]);
        await execute(
          "DELETE FROM participantes_conversacion WHERE conversacion_id = ?",
          [cid],
        );
        await execute(
          "DELETE FROM mensajes_no_leidos WHERE conversacion_id = ?",
          [cid],
        );
        await execute("DELETE FROM conversaciones WHERE id = ?", [cid]);
        eliminados++;
      }
    }

    return NextResponse.json({ success: true, eliminados });
  } catch (error) {
    console.error("Chat cleanup error:", error);
    return NextResponse.json({ error: "Error." }, { status: 500 });
  }
}
