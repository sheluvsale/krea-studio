import { queryOne } from "@/app/lib/db";

export async function canUserReview(
  productoId: number,
  userId?: number,
): Promise<boolean> {
  if (!userId) return false;

  const existing = await queryOne(
    "SELECT id FROM resenas WHERE usuario_id = ? AND producto_id = ?",
    [userId, productoId],
  );
  if (existing) return false;

  const purchase = await queryOne(
    `SELECT 1 as tiene_compra
     FROM pedidos p
     JOIN items_pedido ip ON ip.pedido_id = p.id
     JOIN variantes_producto v ON v.id = ip.variante_id
     WHERE p.cliente_id = ? AND v.producto_id = ? AND p.estado = 'entregado'
     LIMIT 1`,
    [userId, productoId],
  );

  return !!purchase;
}
