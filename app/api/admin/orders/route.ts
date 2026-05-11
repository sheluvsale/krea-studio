import { NextRequest, NextResponse } from "next/server";
import { query, execute } from "@/app/lib/db";
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
       ORDER BY p.creado_en DESC`
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
    const { id, estado } = await req.json();
    await execute("UPDATE pedidos SET estado = ? WHERE id = ?", [estado, id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update order error:", error);
    return NextResponse.json({ error: "Error." }, { status: 500 });
  }
}
