import { NextRequest, NextResponse } from "next/server";
import { execute, queryOne } from "@/app/lib/db";
import { getCurrentUser } from "@/app/lib/session";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getCurrentUser();
  if (!user?.userId) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const { id } = await params;
  const addressId = parseInt(id);

  try {
    // Check if address belongs to user
    const address = await queryOne(
      "SELECT usuario_id FROM direcciones WHERE id = ?",
      [addressId],
    );

    if (!address || address.usuario_id !== user.userId) {
      return NextResponse.json(
        { error: "Dirección no encontrada." },
        { status: 404 },
      );
    }

    // Remove default from all addresses
    await execute(
      "UPDATE direcciones SET predeterminada = false WHERE usuario_id = ?",
      [user.userId],
    );

    // Set default to selected address
    await execute("UPDATE direcciones SET predeterminada = true WHERE id = ?", [
      addressId,
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Set default address error:", error);
    return NextResponse.json(
      { error: "Error al establecer dirección predeterminada." },
      { status: 500 },
    );
  }
}
