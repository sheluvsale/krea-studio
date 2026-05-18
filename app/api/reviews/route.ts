import { NextRequest, NextResponse } from "next/server";
import { execute, query, queryOne } from "@/app/lib/db";
import { getCurrentUser } from "@/app/lib/session";

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user?.userId) {
      return NextResponse.json({
        canReview: false,
        reason: "not_authenticated",
      });
    }

    const { searchParams } = new URL(req.url);
    const producto_id = searchParams.get("producto_id");
    if (!producto_id) {
      return NextResponse.json({ canReview: false, reason: "missing_product" });
    }

    // Check if user already reviewed this product
    const existing = await queryOne(
      "SELECT id FROM resenas WHERE usuario_id = ? AND producto_id = ?",
      [user.userId, Number(producto_id)],
    );

    if (existing) {
      return NextResponse.json({
        canReview: false,
        reason: "already_reviewed",
      });
    }

    // Verify user purchased this product and order is delivered
    const purchase = await queryOne(
      `SELECT 1 as tiene_compra
       FROM pedidos p
       JOIN items_pedido ip ON ip.pedido_id = p.id
       JOIN variantes_producto v ON v.id = ip.variante_id
       WHERE p.cliente_id = ? AND v.producto_id = ? AND p.estado = 'entregado'
       LIMIT 1`,
      [user.userId, Number(producto_id)],
    );

    if (!purchase) {
      return NextResponse.json({ canReview: false, reason: "not_purchased" });
    }

    return NextResponse.json({ canReview: true });
  } catch (error) {
    console.error("Review eligibility error:", error);
    return NextResponse.json({ canReview: false, reason: "error" });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user?.userId) {
      return NextResponse.json(
        { error: "Debes iniciar sesión." },
        { status: 401 },
      );
    }

    const body = await req.json();
    const { producto_id, calificacion, comentario } = body;

    if (!producto_id || !calificacion || !comentario) {
      return NextResponse.json(
        { error: "Faltan campos requeridos." },
        { status: 400 },
      );
    }

    if (calificacion < 1 || calificacion > 5) {
      return NextResponse.json(
        { error: "La calificación debe estar entre 1 y 5." },
        { status: 400 },
      );
    }

    // Verify user purchased this product and order is delivered
    const purchase = await queryOne(
      `SELECT 1 as tiene_compra
       FROM pedidos p
       JOIN items_pedido ip ON ip.pedido_id = p.id
       JOIN variantes_producto v ON v.id = ip.variante_id
       WHERE p.cliente_id = ? AND v.producto_id = ? AND p.estado = 'entregado'
       LIMIT 1`,
      [user.userId, producto_id],
    );

    if (!purchase) {
      return NextResponse.json(
        {
          error:
            "Solo los clientes que han recibido este producto pueden dejar una reseña.",
        },
        { status: 403 },
      );
    }

    // Check if user already reviewed this product
    const existing = await query(
      "SELECT id FROM resenas WHERE usuario_id = ? AND producto_id = ?",
      [user.userId, producto_id],
    );

    if (existing.length > 0) {
      return NextResponse.json(
        { error: "Ya has dejado una reseña para este producto." },
        { status: 400 },
      );
    }

    // Insert review (aprobada defaults to FALSE in DB)
    const result = await execute(
      "INSERT INTO resenas (usuario_id, producto_id, calificacion, comentario) VALUES (?, ?, ?, ?)",
      [user.userId, producto_id, calificacion, comentario],
    );

    return NextResponse.json({ success: true, id: result.insertId });
  } catch (error) {
    console.error("Review error:", error);
    return NextResponse.json(
      { error: "Error al agregar reseña." },
      { status: 500 },
    );
  }
}
