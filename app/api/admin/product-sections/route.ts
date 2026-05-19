import { NextRequest, NextResponse } from "next/server";
import { query, queryOne, execute } from "@/app/lib/db";
import { getCurrentUser } from "@/app/lib/session";

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user?.userId || !["admin", "vendedor"].includes(user.rol || "")) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const productoId = searchParams.get("producto_id");
  if (!productoId) {
    return NextResponse.json({ error: "producto_id requerido." }, { status: 400 });
  }

  try {
    const secciones = await query(
      `SELECT id, producto_id, tipo, titulo, contenido, orden, activo
       FROM producto_secciones
       WHERE producto_id = ?
       ORDER BY orden ASC, creado_en DESC`,
      [Number(productoId)],
    );
    return NextResponse.json({ secciones: secciones || [] });
  } catch (error) {
    console.error("Error fetching sections:", error);
    return NextResponse.json({ error: "Error al obtener secciones." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user?.userId || !["admin", "vendedor"].includes(user.rol || "")) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { producto_id, tipo, titulo, contenido, orden, activo } = body;

    if (!producto_id || !tipo || !titulo?.trim()) {
      return NextResponse.json({ error: "producto_id, tipo y titulo requeridos." }, { status: 400 });
    }

    const result = await execute(
      `INSERT INTO producto_secciones (producto_id, tipo, titulo, contenido, orden, activo)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [Number(producto_id), tipo, titulo.trim(), contenido?.trim() || "", Number(orden) || 0, activo !== false],
    );

    const id = Number((result as Record<string, unknown>).insertId || (result as Record<string, unknown>).lastInsertRowid);
    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error("Error creating section:", error);
    return NextResponse.json({ error: "Error al crear sección." }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user?.userId || !["admin", "vendedor"].includes(user.rol || "")) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, tipo, titulo, contenido, orden, activo } = body;

    if (!id) {
      return NextResponse.json({ error: "id requerido." }, { status: 400 });
    }

    await execute(
      `UPDATE producto_secciones
       SET tipo = ?, titulo = ?, contenido = ?, orden = ?, activo = ?, actualizado_en = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [tipo, titulo.trim(), contenido?.trim() || "", Number(orden) || 0, activo !== false, Number(id)],
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating section:", error);
    return NextResponse.json({ error: "Error al actualizar sección." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user?.userId || !["admin", "vendedor"].includes(user.rol || "")) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "id requerido." }, { status: 400 });
    }
    await execute("DELETE FROM producto_secciones WHERE id = ?", [Number(id)]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting section:", error);
    return NextResponse.json({ error: "Error al eliminar sección." }, { status: 500 });
  }
}
