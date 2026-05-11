import { NextResponse } from "next/server";
import { query, queryOne } from "@/app/lib/db";
import { getCurrentUser } from "@/app/lib/session";

export async function GET() {
  const user = await getCurrentUser();
  if (!user?.userId) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  try {
    const usuario = await queryOne(
      "SELECT telefono, url_avatar, creado_en FROM usuarios WHERE id = ?",
      [user.userId],
    );

    const pedidos = await query(
      "SELECT * FROM pedidos WHERE cliente_id = ? ORDER BY creado_en DESC LIMIT 5",
      [user.userId],
    );

    const direcciones = await query(
      `SELECT id, etiqueta, nombre_destinatario, ciudad, estado, codigo_postal, linea_1, predeterminada
       FROM direcciones WHERE usuario_id = ? ORDER BY predeterminada DESC, creado_en DESC LIMIT 6`,
      [user.userId],
    );

    const response: Record<string, unknown> = {
      usuario: {
        ...usuario,
        nombre: user.nombre,
        apellido: user.apellido,
        correo: user.correo,
        rol: user.rol,
      },
      pedidos,
      direcciones,
    };

    if (["vendedor", "admin"].includes(user.rol || "")) {
      const misProductos = await queryOne<{ total: number }>(
        "SELECT COUNT(*) as total FROM productos WHERE vendedor_id = ?",
        [user.userId],
      );

      const misVentas = await queryOne<{ total: number; ingresos: number }>(
        `SELECT COUNT(DISTINCT p.id) as total, SUM(p.total) as ingresos
         FROM pedidos p
         JOIN items_pedido ip ON p.id = ip.pedido_id
         JOIN variantes_producto v ON ip.variante_id = v.id
         JOIN productos prod ON v.producto_id = prod.id
         WHERE prod.vendedor_id = ? AND p.estado != 'cancelado'`,
        [user.userId],
      );

      const topProductos = await query(
        `SELECT prod.nombre, SUM(ip.cantidad) as total_vendido, SUM(ip.precio_total) as ingresos
         FROM items_pedido ip
         JOIN variantes_producto v ON ip.variante_id = v.id
         JOIN productos prod ON v.producto_id = prod.id
         JOIN pedidos p ON ip.pedido_id = p.id
         WHERE prod.vendedor_id = ? AND p.estado != 'cancelado'
         GROUP BY prod.id, prod.nombre
         ORDER BY total_vendido DESC LIMIT 5`,
        [user.userId],
      );

      response.vendedor = {
        totalProductos: misProductos?.total || 0,
        totalVentas: misVentas?.total || 0,
        ingresosTotales: misVentas?.ingresos || 0,
        topProductos,
      };
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error("Dashboard error:", error);
    return NextResponse.json(
      { error: "Error al cargar datos." },
      { status: 500 },
    );
  }
}
