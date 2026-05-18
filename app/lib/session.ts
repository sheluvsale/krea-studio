import { getIronSession, IronSession } from "iron-session";
import { cookies } from "next/headers";

export interface SessionData {
  userId?: number;
  nombre?: string;
  apellido?: string;
  correo?: string;
  rol?: string;
  isLoggedIn?: boolean;
}

const sessionOptions = {
  password:
    process.env.SESSION_SECRET ||
    "krea-default-secret-change-this-in-production-2026",
  cookieName: "krea_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax" as const,
    maxAge: 60 * 60 * 24 * 7,
  },
};

export async function getSession(): Promise<IronSession<SessionData>> {
  const cookieStore = await cookies();
  return getIronSession<SessionData>(cookieStore, sessionOptions);
}

export async function getCurrentUser(): Promise<SessionData | null> {
  const session = await getSession();
  if (!session.isLoggedIn) return null;
  return {
    userId: session.userId,
    nombre: session.nombre,
    apellido: session.apellido,
    correo: session.correo,
    rol: session.rol,
    isLoggedIn: true,
  };
}
