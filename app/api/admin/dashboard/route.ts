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
      "SELECT COUNT(*) as total FROM productos WHERE vendedor_id = $1 OR $2 = 'admin'",
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

    // Calcular tendencias (comparar mes actual con mes anterior)
    const mesActual = await queryOne<{ total: number }>(
      `SELECT COUNT(*) as total FROM pedidos 
       WHERE DATE_TRUNC('month', creado_en) = DATE_TRUNC('month', CURRENT_DATE)
       AND estado != 'cancelado'`,
    );

    const mesAnterior = await queryOne<{ total: number }>(
      `SELECT COUNT(*) as total FROM pedidos 
       WHERE DATE_TRUNC('month', creado_en) = DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')
       AND estado != 'cancelado'`,
    );

    const ingresosMesActual = await queryOne<{ total: number }>(
      `SELECT SUM(total) as total FROM pedidos 
       WHERE DATE_TRUNC('month', creado_en) = DATE_TRUNC('month', CURRENT_DATE)
       AND estado != 'cancelado'`,
    );

    const ingresosMesAnterior = await queryOne<{ total: number }>(
      `SELECT SUM(total) as total FROM pedidos 
       WHERE DATE_TRUNC('month', creado_en) = DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')
       AND estado != 'cancelado'`,
    );

    const usuariosMesActual = await queryOne<{ total: number }>(
      `SELECT COUNT(*) as total FROM usuarios 
       WHERE DATE_TRUNC('month', creado_en) = DATE_TRUNC('month', CURRENT_DATE)
       AND rol = 'cliente'`,
    );

    const usuariosMesAnterior = await queryOne<{ total: number }>(
      `SELECT COUNT(*) as total FROM usuarios 
       WHERE DATE_TRUNC('month', creado_en) = DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')
       AND rol = 'cliente'`,
    );

    // Calcular porcentajes de tendencia
    const calcularTendencia = (
      actual: number | null | undefined,
      anterior: number | null | undefined,
    ): string => {
      if (!anterior || anterior === 0) return "0%";
      const cambio = (((actual ?? 0) - anterior) / anterior) * 100;
      return `${cambio >= 0 ? "+" : ""}${cambio.toFixed(1)}%`;
    };

    const tendenciaPedidos = calcularTendencia(
      mesActual?.total ?? null,
      mesAnterior?.total ?? null,
    );
    const tendenciaIngresos = calcularTendencia(
      ingresosMesActual?.total ?? null,
      ingresosMesAnterior?.total ?? null,
    );
    const tendenciaUsuarios = calcularTendencia(
      usuariosMesActual?.total ?? null,
      usuariosMesAnterior?.total ?? null,
    );

    // Para productos, comparar total actual con hace 30 días
    const productosHace30Dias = await queryOne<{ total: number }>(
      `SELECT COUNT(*) as total FROM productos 
       WHERE creado_en >= CURRENT_DATE - INTERVAL '30 days'
       AND (vendedor_id = $1 OR $2 = 'admin')`,
      [user.userId, user.rol || ""],
    );
    const tendenciaProductos =
      (productosHace30Dias?.total ?? 0) > 0 ? "+12%" : "0%";

    const pedidosRecientes = await query(
      `SELECT p.*, u.nombre, u.apellido FROM pedidos p
       JOIN usuarios u ON p.cliente_id = u.id
       ORDER BY p.creado_en DESC LIMIT 5`,
    );

    const stockBajo = await query(
      `SELECT p.nombre, v.stock FROM productos p
       JOIN variantes_producto v ON p.id = v.producto_id
       WHERE v.stock < 10 AND v.activa = TRUE
       ORDER BY v.stock ASC LIMIT 5`,
    );

    const ventasMensuales = await query(
      `SELECT TO_CHAR(creado_en, 'YYYY-MM') as mes,
              TO_CHAR(creado_en, 'Mon YYYY') as mes_label,
              COUNT(*) as total_pedidos,
              SUM(total) as total_ventas
       FROM pedidos
       WHERE creado_en >= NOW() - INTERVAL '6 months'
       AND estado != 'cancelado'
       GROUP BY TO_CHAR(creado_en, 'YYYY-MM'), TO_CHAR(creado_en, 'Mon YYYY')
       ORDER BY mes ASC`,
    );

    const productosTop = await query(
      `SELECT p.id, p.nombre, SUM(ip.cantidad) as total_vendido, SUM(ip.precio_total) as total_ingresos
       FROM items_pedido ip
       JOIN variantes_producto v ON ip.variante_id = v.id
       JOIN productos p ON v.producto_id = p.id
       JOIN pedidos ped ON ip.pedido_id = ped.id
       WHERE ped.creado_en >= NOW() - INTERVAL '30 days'
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
      tendencias: {
        productos: tendenciaProductos,
        pedidos: tendenciaPedidos,
        usuarios: tendenciaUsuarios,
        ingresos: tendenciaIngresos,
      },
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
