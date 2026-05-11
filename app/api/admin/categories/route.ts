import { NextRequest, NextResponse } from "next/server";
import { query, execute } from "@/app/lib/db";
import { getCurrentUser } from "@/app/lib/session";

export async function GET() {
  const user = await getCurrentUser();
  if (!user?.userId || user.rol !== "admin") {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  try {
    const categorias = await query(
      "SELECT id, nombre, slug, padre_id, orden, activa FROM categorias ORDER BY orden, nombre",
    );
    return NextResponse.json({ categorias });
  } catch (error) {
    console.error("Admin categories error:", error);
    return NextResponse.json({ error: "Error." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user?.userId || user.rol !== "admin") {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  try {
    const { nombre, slug } = await req.json();
    const result = await execute(
      "INSERT INTO categorias (nombre, slug, activa) VALUES (?, ?, TRUE)",
      [nombre, slug],
    );
    return NextResponse.json({ success: true, id: result.insertId });
  } catch (error) {
    console.error("Create category error:", error);
    return NextResponse.json({ error: "Error al crear." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user?.userId || user.rol !== "admin") {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Falta ID." }, { status: 400 });
    }

    await execute(
      "UPDATE productos SET categoria_id = NULL WHERE categoria_id = ?",
      [id],
    );
    await execute("DELETE FROM categorias WHERE id = ?", [id]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete category error:", error);
    return NextResponse.json({ error: "Error al eliminar." }, { status: 500 });
  }
}
