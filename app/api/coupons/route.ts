import { NextRequest, NextResponse } from "next/server";
import { query, execute } from "@/app/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { codigo, total } = await req.json();

    if (!codigo) {
      return NextResponse.json({ error: "Falta código de cupón." }, { status: 400 });
    }

    const cupon = await query(
      `SELECT * FROM cupones 
       WHERE codigo = ? 
       AND activo = TRUE 
       AND (fecha_fin IS NULL OR fecha_fin > CURRENT_TIMESTAMP) 
       AND (limite_usos IS NULL OR usos_actuales < limite_usos)`,
      [codigo.toUpperCase()],
    );

    if (!cupon || cupon.length === 0) {
      return NextResponse.json({ error: "Cupón inválido o expirado." }, { status: 400 });
    }

    const cuponData = cupon[0] as any;

    // Validar monto mínimo
    if (cuponData.minimo_compra && total < Number(cuponData.minimo_compra)) {
      return NextResponse.json(
        { error: `El cupón requiere un monto mínimo de $${cuponData.minimo_compra}` },
        { status: 400 },
      );
    }

    // Calcular descuento
    let descuento = 0;
    if (cuponData.tipo_descuento === "porcentaje") {
      descuento = total * (Number(cuponData.valor) / 100);
    } else {
      descuento = Number(cuponData.valor);
    }

    // No permitir descuento mayor al total
    descuento = Math.min(descuento, total);

    return NextResponse.json({
      success: true,
      descuento: descuento.toFixed(2),
      tipo_descuento: cuponData.tipo_descuento,
      valor: cuponData.valor,
    });
  } catch (error) {
    console.error("Coupon validation error:", error);
    return NextResponse.json({ error: "Error al validar cupón." }, { status: 500 });
  }
}
