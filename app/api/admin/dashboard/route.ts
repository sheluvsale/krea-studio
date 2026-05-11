import { NextResponse } from "next/server";
import { query, queryOne } from "@/app/lib/db";
import { getCurrentUser } from "@/app/lib/session";

export async function GET() {
  const user = await getCurrentUser();
  if (!user?.userId || !["admin", "vendedor"].includes(user.rol || "")) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  try {
    const totalProductos = await queryOne<{ total: number }>(
      "SELECT COUNT(*) as total FROM productos WHERE vendedor_id = ? OR ? = 'admin'",
      [user.userId, user.rol || ""],
    );

    const totalPedidos = await queryOne<{ total: number }>(
      "SELECT COUNT(*) as total FROM pedidos",
    );

    const totalUsuarios = await queryOne<{ total: number }>(
      "SELECT COUNT(*) as total FROM usuarios WHERE rol = 'cliente'",
    );

    const ingresosTotales = await queryOne<{ total: number }>(
      "SELECT SUM(total) as total FROM pedidos WHERE estado != 'cancelado'",
    );

    const pedidosRecientes = await query(
      `SELECT p.*, u.nombre, u.apellido FROM pedidos p
       JOIN usuarios u ON p.cliente_id = u.id
       ORDER BY p.creado_en DESC LIMIT 5`,
    );

    const stockBajo = await query(
      `SELECT p.nombre, v.stock FROM productos p
       JOIN variantes_producto v ON p.id = v.producto_id
       WHERE v.stock < 10 AND v.activa = 1
       ORDER BY v.stock ASC LIMIT 5`,
    );

    const ventasMensuales = await query(
      `SELECT DATE_FORMAT(creado_en, '%Y-%m') as mes,
              DATE_FORMAT(creado_en, '%b %Y') as mes_label,
              COUNT(*) as total_pedidos,
              SUM(total) as total_ventas
       FROM pedidos
       WHERE creado_en >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
       AND estado != 'cancelado'
       GROUP BY DATE_FORMAT(creado_en, '%Y-%m')
       ORDER BY mes ASC`,
    );

    const productosTop = await query(
      `SELECT p.id, p.nombre, SUM(ip.cantidad) as total_vendido, SUM(ip.precio_total) as total_ingresos
       FROM items_pedido ip
       JOIN variantes_producto v ON ip.variante_id = v.id
       JOIN productos p ON v.producto_id = p.id
       JOIN pedidos ped ON ip.pedido_id = ped.id
       WHERE ped.creado_en >= DATE_SUB(NOW(), INTERVAL 30 DAY)
       AND ped.estado != 'cancelado'
       GROUP BY p.id, p.nombre
       ORDER BY total_vendido DESC LIMIT 5`,
    );

    const pedidosPorEstado = await query(
      "SELECT estado, COUNT(*) as cantidad FROM pedidos GROUP BY estado",
    );

    return NextResponse.json({
      totalProductos: totalProductos?.total || 0,
      totalPedidos: totalPedidos?.total || 0,
      totalUsuarios: totalUsuarios?.total || 0,
      ingresosTotales: ingresosTotales?.total || 0,
      pedidosRecientes,
      stockBajo,
      ventasMensuales,
      productosTop,
      pedidosPorEstado,
      rol: user.rol,
      nombre: user.nombre,
    });
  } catch (error) {
    console.error("Admin dashboard error:", error);
    return NextResponse.json(
      { error: "Error al cargar datos." },
      { status: 500 },
    );
  }
}
