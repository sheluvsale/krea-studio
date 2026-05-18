import { NextResponse } from "next/server";
import { query } from "@/app/lib/db";

export async function GET() {
  try {
    const metodos = await query(
      `SELECT id, codigo, nombre, descripcion, comision_porcentaje, imagen_url
       FROM metodos_pago_config
       WHERE activo = true
       ORDER BY orden ASC`,
      [],
    );

    return NextResponse.json({ metodos });
  } catch (error) {
    console.error("Payment methods config error:", error);
    return NextResponse.json(
      { error: "Error al cargar métodos de pago." },
      { status: 500 },
    );
  }
}
