import { NextRequest, NextResponse } from "next/server";
import { execute, query } from "@/app/lib/db";
import { getCurrentUser } from "@/app/lib/session";

export async function GET() {
  const user = await getCurrentUser();
  if (!user?.userId) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  try {
    const direcciones = await query(
      `SELECT id, etiqueta, nombre_destinatario, telefono_destinatario, pais, ciudad, estado, codigo_postal, linea_1, linea_2, predeterminada
       FROM direcciones WHERE usuario_id = ? ORDER BY predeterminada DESC, creado_en DESC`,
      [user.userId],
    );

    return NextResponse.json(direcciones);
  } catch (error) {
    console.error("Addresses fetch error:", error);
    return NextResponse.json(
      { error: "Error al cargar direcciones." },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user?.userId) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      etiqueta,
      nombre_destinatario,
      telefono_destinatario,
      pais,
      ciudad,
      estado,
      codigo_postal,
      linea_1,
      linea_2,
      predeterminada,
    } = body;

    // If setting as default, remove default from other addresses
    if (predeterminada) {
      await execute(
        "UPDATE direcciones SET predeterminada = false WHERE usuario_id = ?",
        [user.userId],
      );
    }

    const result = await execute(
      `INSERT INTO direcciones (usuario_id, etiqueta, nombre_destinatario, telefono_destinatario, pais, ciudad, estado, codigo_postal, linea_1, linea_2, predeterminada)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        user.userId,
        etiqueta || null,
        nombre_destinatario,
        telefono_destinatario || null,
        pais,
        ciudad,
        estado,
        codigo_postal,
        linea_1,
        linea_2 || null,
        predeterminada || false,
      ],
    );

    return NextResponse.json({ success: true, id: result.insertId });
  } catch (error) {
    console.error("Address creation error:", error);
    return NextResponse.json(
      { error: "Error al crear dirección." },
      { status: 500 },
    );
  }
}
