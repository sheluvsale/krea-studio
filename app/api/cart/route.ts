import { NextRequest, NextResponse } from "next/server";
import { query, queryOne, execute } from "@/app/lib/db";
import { getCurrentUser } from "@/app/lib/session";

export async function GET() {
  const user = await getCurrentUser();
  if (!user?.userId) {
    return NextResponse.json({ items: [], total: 0 });
  }

  try {
    const items = await query(
      `SELECT c.id, c.usuario_id, c.producto_id, c.nombre_producto as nombre, c.cantidad,
              c.precio_unitario as precio_base, c.talla,
              p.slug, p.descripcion,
              (SELECT url_imagen FROM imagenes_producto WHERE producto_id = p.id ORDER BY es_principal DESC LIMIT 1) as imagen
       FROM carrito c
       JOIN productos p ON c.producto_id = p.id
       WHERE c.usuario_id = ?
       ORDER BY c.creado_en DESC`,
      [user.userId],
    );

    let total = 0;
    for (const item of items) {
      const i = item as Record<string, unknown>;
      total += Number(i.precio_unitario || i.precio_base) * Number(i.cantidad);
    }

    return NextResponse.json({ items, total });
  } catch (error) {
    console.error("Cart error:", error);
    return NextResponse.json(
      { error: "Error al obtener carrito." },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user?.userId) {
    return NextResponse.json(
      { error: "Debes iniciar sesión." },
      { status: 401 },
    );
  }

  try {
    const { producto_id, cantidad, talla } = await req.json();

    const producto = await queryOne(
      "SELECT nombre, precio_base FROM productos WHERE id = ?",
      [producto_id],
    );

    if (!producto) {
      return NextResponse.json(
        { error: "Producto no encontrado." },
        { status: 404 },
      );
    }

    const p = producto as Record<string, unknown>;
    const nombreProducto = String(p.nombre);
    const precioUnitario = Number(p.precio_base);
    const qty = cantidad || 1;
    const tallaValor = talla || null;

    const existing = await queryOne(
      "SELECT id, cantidad FROM carrito WHERE usuario_id = ? AND producto_id = ? AND (talla = ? OR (talla IS NULL AND ? IS NULL))",
      [user.userId, producto_id, tallaValor, tallaValor],
    );

    if (existing) {
      const ex = existing as Record<string, unknown>;
      await execute("UPDATE carrito SET cantidad = ? WHERE id = ?", [
        Number(ex.cantidad) + qty,
        Number(ex.id),
      ]);
    } else {
      await execute(
        "INSERT INTO carrito (usuario_id, producto_id, nombre_producto, cantidad, precio_unitario, talla) VALUES (?, ?, ?, ?, ?, ?)",
        [
          user.userId,
          producto_id,
          nombreProducto,
          qty,
          precioUnitario,
          tallaValor,
        ],
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Add to cart error:", error);
    return NextResponse.json(
      { error: "Error al agregar al carrito." },
      { status: 500 },
    );
  }
}

export async function PUT(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user?.userId) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  try {
    const { id, cantidad } = await req.json();
    if (cantidad <= 0) {
      await execute("DELETE FROM carrito WHERE id = ? AND usuario_id = ?", [
        id,
        user.userId,
      ]);
    } else {
      await execute(
        "UPDATE carrito SET cantidad = ? WHERE id = ? AND usuario_id = ?",
        [cantidad, id, user.userId],
      );
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update cart error:", error);
    return NextResponse.json(
      { error: "Error al actualizar carrito." },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user?.userId) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  try {
    const { id } = await req.json();
    await execute("DELETE FROM carrito WHERE id = ? AND usuario_id = ?", [
      id,
      user.userId,
    ]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Remove cart error:", error);
    return NextResponse.json(
      { error: "Error al eliminar del carrito." },
      { status: 500 },
    );
  }
}
