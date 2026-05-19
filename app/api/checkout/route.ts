import { NextRequest, NextResponse } from "next/server";
import { queryOne, execute, query } from "@/app/lib/db";
import { getCurrentUser } from "@/app/lib/session";

function generateOrderNumber(): string {
  const prefix = "KRE";
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  return `${prefix}-${timestamp}-${random}`;
}

async function resolveVarianteId(
  productoId: number,
  talla: string | null,
): Promise<number | null> {
  if (talla) {
    const variante = await queryOne(
      "SELECT id FROM variantes_producto WHERE producto_id = ? AND sku ILIKE ? LIMIT 1",
      [productoId, `%${talla}%`],
    );
    if (variante) return Number((variante as Record<string, unknown>).id);
  }
  const primera = await queryOne(
    "SELECT id FROM variantes_producto WHERE producto_id = ? LIMIT 1",
    [productoId],
  );
  return primera ? Number((primera as Record<string, unknown>).id) : null;
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user?.userId) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { direccion_id, metodo_pago_id, notas, modo } = body;

    const ENVIO_GRATIS_MINIMO = 3000;
    const COSTO_ENVIO = 150;

    let itemsToProcess: Record<string, unknown>[] = [];

    // Modo directo (buy now) — un solo producto
    if (modo === "directo") {
      const { producto_id, cantidad, talla } = body;
      if (!producto_id || !cantidad || cantidad < 1) {
        return NextResponse.json(
          { error: "Producto y cantidad requeridos." },
          { status: 400 },
        );
      }

      const producto = await queryOne(
        "SELECT id, nombre, precio_base, vendedor_id FROM productos WHERE id = ?",
        [producto_id],
      );
      if (!producto) {
        return NextResponse.json(
          { error: "Producto no encontrado." },
          { status: 404 },
        );
      }

      const p = producto as Record<string, unknown>;
      const varianteId = await resolveVarianteId(Number(p.id), talla || null);

      itemsToProcess = [
        {
          producto_id: p.id,
          variante_id: varianteId,
          nombre_producto: p.nombre,
          cantidad,
          precio_unitario: p.precio_base,
          vendedor_id: p.vendedor_id,
          talla: talla || null,
        },
      ];
    } else {
      // Modo carrito
      const cartItems = await query(
        `SELECT c.id, c.producto_id, c.variante_id, c.nombre_producto, c.cantidad, c.precio_unitario, c.talla,
                p.vendedor_id
         FROM carrito c
         JOIN productos p ON c.producto_id = p.id
         WHERE c.usuario_id = ?`,
        [user.userId],
      );

      if (!cartItems || cartItems.length === 0) {
        return NextResponse.json(
          { error: "El carrito está vacío." },
          { status: 400 },
        );
      }

      // Resolver variantes faltantes
      for (const item of cartItems) {
        const i = item as Record<string, unknown>;
        let varianteId = i.variante_id ? Number(i.variante_id) : null;
        if (!varianteId) {
          varianteId = await resolveVarianteId(
            Number(i.producto_id),
            String(i.talla || ""),
          );
        }
        itemsToProcess.push({
          ...i,
          variante_id: varianteId,
        });
      }
    }

    // Calculate totals
    let subtotal = 0;
    for (const item of itemsToProcess) {
      subtotal += Number(item.precio_unitario) * Number(item.cantidad);
    }

    const envio = subtotal >= ENVIO_GRATIS_MINIMO ? 0 : COSTO_ENVIO;
    const impuestos = subtotal * 0.16;
    const total = subtotal + envio + impuestos;

    // Generate order number
    const numeroPedido = generateOrderNumber();

    // Create order
    const orderResult = await execute(
      `INSERT INTO pedidos (numero_pedido, cliente_id, direccion_envio_id, estado, subtotal, total, metodo_pago_id, notas)
       VALUES (?, ?, ?, 'pendiente', ?, ?, ?, ?)`,
      [
        numeroPedido,
        user.userId,
        (body.direccion_id as string | number | null) || null,
        subtotal,
        total,
        (body.metodo_pago_id as string | number | null) || null,
        (body.notas as string | null) || null,
      ],
    );

    const pedidoId = Number(
      (orderResult as Record<string, unknown>).insertId ||
        (orderResult as Record<string, unknown>).lastInsertRowid,
    );

    // Create order items
    for (const item of itemsToProcess) {
      const cantidad = Number(item.cantidad);
      const precioUnitario = Number(item.precio_unitario);
      const precioTotal = cantidad * precioUnitario;

      await execute(
        `INSERT INTO items_pedido (pedido_id, producto_id, variante_id, vendedor_id, nombre_producto, cantidad, precio_unitario, precio_total)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          pedidoId,
          Number(item.producto_id),
          (item.variante_id as number | null) || null,
          Number(item.vendedor_id || 1),
          String(item.nombre_producto),
          cantidad,
          precioUnitario,
          precioTotal,
        ],
      );
    }

    // Clear cart only if carrito mode
    if (modo !== "directo") {
      await execute("DELETE FROM carrito WHERE usuario_id = ?", [user.userId]);
    }

    // Create chat conversation for this order
    await execute(
      `INSERT INTO conversaciones (pedido_id, tipo, estado, asunto, creado_por)
       VALUES (?, 'pedido', 'abierta', ?, ?)`,
      [pedidoId, `Pedido ${numeroPedido}`, user.userId],
    );

    // Add participants
    const conversacion = await queryOne(
      "SELECT id FROM conversaciones WHERE pedido_id = ?",
      [pedidoId],
    );

    if (conversacion) {
      const conv = conversacion as Record<string, unknown>;
      const conversacionId = Number(conv.id);
      await execute(
        `INSERT INTO participantes_conversacion (conversacion_id, usuario_id, rol)
         VALUES (?, ?, 'cliente')`,
        [conversacionId, user.userId],
      );
      await execute(
        `INSERT INTO mensajes_chat (conversacion_id, remitente_id, contenido, tipo, estado)
         VALUES (?, ?, ?, 'sistema', 'entregado')`,
        [
          conversacionId,
          user.userId,
          `¡Hola! Tu pedido ${numeroPedido} ha sido registrado. Puedes usar este chat para cualquier consulta relacionada con tu orden.`,
        ],
      );
    }

    return NextResponse.json({
      success: true,
      pedido_id: pedidoId,
      numero_pedido: numeroPedido,
      total,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Error al procesar el pedido." },
      { status: 500 },
    );
  }
}
