import { NextResponse } from "next/server";
import { query } from "@/app/lib/db";

export async function GET() {
  try {
    const categorias = await query("SELECT * FROM categorias WHERE activa = 1 ORDER BY nombre");
    const marcas = await query("SELECT * FROM marcas ORDER BY nombre");
    return NextResponse.json({ categorias, marcas });
  } catch (error) {
    console.error("Categories error:", error);
    return NextResponse.json({ categorias: [], marcas: [] });
  }
}
