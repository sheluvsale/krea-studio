import mysql from "mysql2/promise";

const pool = mysql.createPool({
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

export default pool;

export async function query<T = Record<string, unknown>>(
  sql: string,
  params?: (string | number | boolean | null)[],
): Promise<T[]> {
  const [rows] = await pool.execute(sql, params ?? []);
  return rows as T[];
}

export async function queryOne<T = Record<string, unknown>>(
  sql: string,
  params?: (string | number | boolean | null)[],
): Promise<T | null> {
  const rows = await query<T>(sql, params);
  return rows[0] || null;
}

export async function execute(
  sql: string,
  params?: (string | number | boolean | null)[],
): Promise<{ insertId: number; affectedRows: number }> {
  const [result] = await pool.execute(sql, params ?? []);
  const r = result as { insertId: number; affectedRows: number };
  return { insertId: r.insertId, affectedRows: r.affectedRows };
}
