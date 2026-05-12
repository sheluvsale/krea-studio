
export async function GET() {
  return Response.json({
    hasDbUrl: !!process.env.DATABASE_URL,
  })
}