// app/api/test-db/route.ts

import postgres from "postgres"

const sql = postgres(process.env.DATABASE_URL!, {
  ssl: "require",
})

export async function GET() {
  try {
    const result = await sql`SELECT NOW()`

    return Response.json({
      success: true,
      result,
    })
  } catch (error) {
    return Response.json({
      success: false,
      error: String(error),
    })
  }
}