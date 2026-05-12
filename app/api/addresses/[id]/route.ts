import { NextRequest, NextResponse } from "next/server";
import { execute, queryOne } from "@/app/lib/db";
import { getCurrentUser } from "@/app/lib/session";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user?.userId) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const addressId = parseInt(params.id);

  try {
    const body = await req.json();
    const { etiqueta, nombre_destinatario, telefono_destinatario, pais, ciudad, estado, codigo_postal, linea_1, linea_2, predeterminada } = body;

    // Check if address belongs to user
    const address = await queryOne(
      "SELECT usuario_id FROM direcciones WHERE id = ?",
      [addressId]
    );

    if (!address || address.usuario_id !== user.userId) {
      return NextResponse.json({ error: "Dirección no encontrada." }, { status: 404 });
    }

    // If setting as default, remove default from other addresses
    if (predeterminada) {
      await execute(
        "UPDATE direcciones SET predeterminada = false WHERE usuario_id = ? AND id != ?",
        [user.userId, addressId]
      );
    }

    await execute(
      `UPDATE direcciones SET etiqueta = ?, nombre_destinatario = ?, telefono_destinatario = ?, pais = ?, ciudad = ?, estado = ?, codigo_postal = ?, linea_1 = ?, linea_2 = ?, predeterminada = ?
       WHERE id = ?`,
      [etiqueta || null, nombre_destinatario, telefono_destinatario || null, pais, ciudad, estado, codigo_postal, linea_1, linea_2 || null, predeterminada || false, addressId]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Address update error:", error);
    return NextResponse.json({ error: "Error al actualizar dirección." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user?.userId) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const addressId = parseInt(params.id);

  try {
    // Check if address belongs to user
    const address = await queryOne(
      "SELECT usuario_id, predeterminada FROM direcciones WHERE id = ?",
      [addressId]
    );

    if (!address || address.usuario_id !== user.userId) {
      return NextResponse.json({ error: "Dirección no encontrada." }, { status: 404 });
    }

    if (address.predeterminada) {
      return NextResponse.json({ error: "No puedes eliminar la dirección predeterminada." }, { status: 400 });
    }

    await execute(
      "DELETE FROM direcciones WHERE id = ?",
      [addressId]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Address deletion error:", error);
    return NextResponse.json({ error: "Error al eliminar dirección." }, { status: 500 });
  }
}
