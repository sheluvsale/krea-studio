import { NextRequest, NextResponse } from "next/server";
import { query, execute } from "@/app/lib/db";
import { getCurrentUser } from "@/app/lib/session";

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user?.userId || !["admin", "vendedor"].includes(user.rol || "")) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const productoId = searchParams.get("productoId");

  if (!productoId) {
    return NextResponse.json({ error: "Falta productoId." }, { status: 400 });
  }

  try {
    const imagenes = await query(
      "SELECT * FROM imagenes_producto WHERE producto_id = ? ORDER BY orden, es_principal DESC, id ASC",
      [productoId],
    );
    return NextResponse.json({ imagenes });
  } catch (error) {
    console.error("Get product images error:", error);
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
    const { productoId, url_imagen, es_principal = false } = body;

    if (!productoId || !url_imagen) {
      return NextResponse.json(
        { error: "Faltan campos requeridos." },
        { status: 400 },
      );
    }

    // Si es principal, quitar la marca de principal de otras imágenes
    if (es_principal) {
      await execute(
        "UPDATE imagenes_producto SET es_principal = FALSE WHERE producto_id = ?",
        [productoId],
      );
    }

    // Obtener el orden máximo actual
    const maxOrden = await query(
      "SELECT MAX(orden) as max_orden FROM imagenes_producto WHERE producto_id = ?",
      [productoId],
    );
    const orden = Number(maxOrden[0]?.max_orden || 0) + 1;

    const result = await execute(
      "INSERT INTO imagenes_producto (producto_id, url_imagen, es_principal, orden) VALUES (?, ?, ?, ?)",
      [productoId, url_imagen, es_principal, orden],
    );

    return NextResponse.json({ success: true, id: result.insertId });
  } catch (error) {
    console.error("Add product image error:", error);
    return NextResponse.json(
      { error: "Error al agregar imagen." },
      { status: 500 },
    );
  }
}

export async function PUT(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user?.userId || !["admin", "vendedor"].includes(user.rol || "")) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, es_principal, orden } = body;

    if (!id) {
      return NextResponse.json({ error: "Falta ID." }, { status: 400 });
    }

    // Si se establece como principal, quitar la marca de principal de otras imágenes del mismo producto
    if (es_principal === true) {
      const imagen = await query(
        "SELECT producto_id FROM imagenes_producto WHERE id = ?",
        [id],
      );
      if (imagen[0]?.producto_id) {
        await execute(
          "UPDATE imagenes_producto SET es_principal = FALSE WHERE producto_id = ? AND id != ?",
          [imagen[0].producto_id, id],
        );
      }
    }

    await execute(
      "UPDATE imagenes_producto SET es_principal = ?, orden = ? WHERE id = ?",
      [es_principal !== undefined ? es_principal : false, orden || 0, id],
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update product image error:", error);
    return NextResponse.json(
      { error: "Error al actualizar imagen." },
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

    await execute("DELETE FROM imagenes_producto WHERE id = ?", [id]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete product image error:", error);
    return NextResponse.json(
      { error: "Error al eliminar imagen." },
      { status: 500 },
    );
  }
}
