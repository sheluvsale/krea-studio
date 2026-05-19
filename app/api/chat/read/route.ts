import { NextRequest, NextResponse } from "next/server";
import { execute } from "@/app/lib/db";
import { getCurrentUser } from "@/app/lib/session";

// POST /api/chat/read - Marcar mensajes como leídos
export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user?.userId) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { conversacion_id } = body;

    if (!conversacion_id) {
      return NextResponse.json(
        { error: "conversacion_id requerido." },
        { status: 400 },
      );
    }

    const conversacionId = Number(conversacion_id);

    // Marcar mensajes como leídos
    await execute(
      `UPDATE mensajes_chat 
       SET estado = 'leido', leido_en = CURRENT_TIMESTAMP
       WHERE conversacion_id = ? AND remitente_id != ? AND estado != 'leido'`,
      [conversacionId, user.userId],
    );

    // Resetear contador de no leídos
    await execute(
      `DELETE FROM mensajes_no_leidos WHERE conversacion_id = ? AND usuario_id = ?`,
      [conversacionId, user.userId],
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Mark read error:", error);
    return NextResponse.json({ error: "Error al marcar como leído." }, { status: 500 });
  }
}
