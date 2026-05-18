import { Resend } from "resend";
import nodemailer, { type Transporter } from "nodemailer";

export const FROM_EMAIL =
  process.env.SMTP_FROM ||
  process.env.FROM_EMAIL ||
  process.env.SMTP_USER ||
  "noreply@krea.studio";

export const BUSINESS_EMAIL =
  process.env.BUSINESS_EMAIL || "kreastudio.business1604@gmail.com";

interface SendEmailParams {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  replyTo?: string;
}

// ---------- SMTP (nodemailer) ----------
// Variables soportadas:
//   SMTP_HOST   (ej: smtp.gmail.com  |  smtp.hostinger.com)
//   SMTP_PORT   (ej: 587 STARTTLS    |  465 SSL)
//   SMTP_SECURE ("true" para 465, "false" para 587)
//   SMTP_USER   correo completo (kreastudio.business1604@gmail.com)
//   SMTP_PASS   App Password (Gmail) o contraseña real (Hostinger)
//   SMTP_FROM   opcional, "Krea Studio <noreply@tudominio.com>"
let smtpTransporter: Transporter | null = null;

function getSmtpTransporter(): Transporter | null {
  if (
    !process.env.SMTP_HOST ||
    !process.env.SMTP_USER ||
    !process.env.SMTP_PASS
  ) {
    return null;
  }
  if (smtpTransporter) return smtpTransporter;

  const port = Number(process.env.SMTP_PORT || 587);
  const secure =
    process.env.SMTP_SECURE !== undefined
      ? process.env.SMTP_SECURE === "true"
      : port === 465;

  smtpTransporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  return smtpTransporter;
}

// ---------- Resend ----------
let resend: Resend | null = null;

function getResend() {
  if (!resend) {
    resend = new Resend(process.env.RESEND_API_KEY || "");
  }
  return resend;
}

async function sendViaSmtp(params: SendEmailParams) {
  const transporter = getSmtpTransporter();
  if (!transporter) return null;

  try {
    const info = await transporter.sendMail({
      from: FROM_EMAIL,
      to: Array.isArray(params.to) ? params.to.join(", ") : params.to,
      subject: params.subject,
      html: params.html,
      text: params.text,
      replyTo: params.replyTo,
    });
    return { success: true as const, id: info.messageId };
  } catch (err) {
    console.error("SMTP send error:", err);
    return { success: false as const, error: String(err) };
  }
}

async function sendViaResend(params: SendEmailParams) {
  if (!process.env.RESEND_API_KEY) return null;
  try {
    const client = getResend();
    const { data, error } = await client.emails.send({
      from: FROM_EMAIL,
      to: params.to,
      subject: params.subject,
      html: params.html,
      text: params.text,
      replyTo: params.replyTo,
    } as Parameters<typeof client.emails.send>[0]);

    if (error) {
      console.error("Resend error:", error);
      return { success: false as const, error: error.message };
    }
    return { success: true as const, id: data?.id };
  } catch (err) {
    console.error("Resend send error:", err);
    return { success: false as const, error: String(err) };
  }
}

export async function sendEmail(params: SendEmailParams) {
  // Prioriza SMTP (Gmail/Hostinger). Cae a Resend si SMTP no está configurado.
  const smtpResult = await sendViaSmtp(params);
  if (smtpResult) return smtpResult;

  const resendResult = await sendViaResend(params);
  if (resendResult) return resendResult;

  console.warn(
    "[email] No mail provider configured. Set SMTP_* env vars or RESEND_API_KEY.",
  );
  return { success: false as const, error: "No mail provider configured" };
}

export function formatCurrency(value: number, currency = "DOP"): string {
  return new Intl.NumberFormat("es-DO", {
    style: "currency",
    currency,
  }).format(value);
}
