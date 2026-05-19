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
    const estado = searchParams.get("estado");
    const busqueda = searchParams.get("q");

    let sql = "SELECT * FROM pedidos WHERE cliente_id = ?";
    const params: (string | number)[] = [user.userId];

    if (estado) {
      sql += " AND estado = ?";
      params.push(estado);
    }

    if (busqueda) {
      sql += " AND (numero_pedido ILIKE ? OR CAST(id AS TEXT) ILIKE ?)";
      params.push(`%${busqueda}%`, `%${busqueda}%`);
    }

    sql += " ORDER BY creado_en DESC";

    const pedidos = await query(sql, params);

    return NextResponse.json({ pedidos: pedidos || [] });
  } catch (error) {
    console.error("Pedidos error:", error);
    return NextResponse.json(
      { error: "Error al cargar pedidos." },
      { status: 500 },
    );
  }
}
