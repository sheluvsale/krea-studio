import { NextRequest, NextResponse } from "next/server";
import { query, execute } from "@/app/lib/db";
import { getCurrentUser } from "@/app/lib/session";

export async function GET() {
  const user = await getCurrentUser();
  if (!user?.userId || !["admin", "vendedor"].includes(user.rol || "")) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  try {
    const productos = await query(
      `SELECT p.*, c.nombre as categoria_nombre,
              (SELECT SUM(v.stock) FROM variantes_producto v WHERE v.producto_id = p.id) as stock_total
       FROM productos p
       LEFT JOIN categorias c ON p.categoria_id = c.id
       ORDER BY p.creado_en DESC`,
    );
    return NextResponse.json({ productos });
  } catch (error) {
    console.error("Admin products error:", error);
    return NextResponse.json({ error: "Error." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user?.userId || !["admin", "vendedor"].includes(user.rol || "")) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const slug = body.nombre
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const result = await execute(
      `INSERT INTO productos (nombre, slug, descripcion, precio_base, categoria_id, vendedor_id, estado, destacado, sku)
       VALUES (?, ?, ?, ?, ?, ?, 'borrador', ?, ?)`,
      [
        body.nombre,
        slug,
        body.descripcion || null,
        body.precio,
        body.categoria_id || null,
        user.userId,
        body.destacado ? 1 : 0,
        body.sku || null,
      ],
    );

    if (body.stock && result.insertId) {
      await execute(
        "INSERT INTO variantes_producto (producto_id, stock, activa) VALUES (?, ?, 1)",
        [result.insertId, body.stock],
      );
    }

    return NextResponse.json({ success: true, id: result.insertId });
  } catch (error) {
    console.error("Save product error:", error);
    return NextResponse.json({ error: "Error al guardar." }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user?.userId || !["admin", "vendedor"].includes(user.rol || "")) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, nombre, descripcion, precio_base, estado, categoria_id } = body;

    await execute(
      `UPDATE productos SET nombre = ?, descripcion = ?, precio_base = ?, estado = ?, categoria_id = ? WHERE id = ?`,
      [
        nombre,
        descripcion || null,
        precio_base,
        estado,
        categoria_id || null,
        id,
      ],
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update product error:", error);
    return NextResponse.json(
      { error: "Error al actualizar." },
      { status: 500 },
    );
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
      return NextResponse.json({ error: "Falta ID." }, { status: 400 });
    }

    await execute("DELETE FROM variantes_producto WHERE producto_id = ?", [id]);
    await execute("DELETE FROM productos WHERE id = ?", [id]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete product error:", error);
    return NextResponse.json({ error: "Error al eliminar." }, { status: 500 });
  }
}
