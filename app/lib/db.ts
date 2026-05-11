import mysql from "mysql2/promise";
import postgres from "postgres";

const isDev = process.env.NODE_ENV !== "production";

const databaseUrl = isDev
  ? process.env.DEV_DATABASE_URL
  : process.env.DATABASE_URL || process.env.SUPABASE_DATABASE_URL;

const usePostgres = !!databaseUrl;

function toPgSql(sql: string): string {
  if (!sql.includes("?") || sql.includes("$1")) return sql;
  let i = 0;
  return sql.replace(/\?/g, () => `$${++i}`);
}

let pool: mysql.Pool | null = null;
let pgClient: postgres.Sql | null = null;

if (usePostgres && databaseUrl) {
  pgClient = postgres(databaseUrl, {
    max: 10,
    ssl: { rejectUnauthorized: false },
  });
  console.log(`🚀 PostgreSQL conectado (${isDev ? "dev" : "prod"})`);
} else {
  pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 3306,
    database: process.env.DB_NAME || "krea_db",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    charset: "utf8mb4",
  });
}

export const supabaseConfig = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  publishableKey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "",
};

export default pool;

export async function query<T = Record<string, unknown>>(
  sql: string,
  params?: (string | number | boolean | null)[],
): Promise<T[]> {
  if (usePostgres && pgClient) {
    const rows = await pgClient.unsafe(toPgSql(sql), params ?? []);
    return rows as unknown as T[];
  }
  const [rows] = await pool!.execute(sql, params ?? []);
  return rows as T[];
}

export async function queryOne<T = Record<string, unknown>>(
  sql: string,
  params?: (string | number | boolean | null)[],
): Promise<T | null> {
  const rows = await query<T>(sql, params);
  return rows[0] || null;
}

function addReturningId(sql: string): string {
  const trimmed = sql.trim();
  if (/^INSERT\s+INTO/i.test(trimmed) && !/RETURNING\s+\w+$/i.test(trimmed)) {
    return trimmed + " RETURNING id";
  }
  return trimmed;
}

export async function execute(
  sql: string,
  params?: (string | number | boolean | null)[],
): Promise<{ insertId: number; affectedRows: number }> {
  if (usePostgres && pgClient) {
    const pgSql = addReturningId(toPgSql(sql));
    const result = await pgClient.unsafe(pgSql, params ?? []);
    return {
      insertId: (result[0] as { id?: number })?.id ?? 0,
      affectedRows: (result as unknown as { count?: number }).count ?? 0,
    };
  }
  const [result] = await pool!.execute(sql, params ?? []);
  const r = result as { insertId: number; affectedRows: number };
  return { insertId: r.insertId, affectedRows: r.affectedRows };
}
