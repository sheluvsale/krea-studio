import { Resend } from "resend";

export const FROM_EMAIL = process.env.FROM_EMAIL || "noreply@krea.studio";

interface SendEmailParams {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
}

let resend: Resend | null = null;

function getResend() {
  if (!resend) {
    resend = new Resend(process.env.RESEND_API_KEY || "");
  }
  return resend;
}

export async function sendEmail({ to, subject, html, text }: SendEmailParams) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY not configured. Email not sent.");
    return { success: false, error: "Resend not configured" };
  }

  try {
    const client = getResend();
    const { data, error } = await client.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html,
      text,
    } as Parameters<typeof client.emails.send>[0]);

    if (error) {
      console.error("Resend error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, id: data?.id };
  } catch (err) {
    console.error("Email send error:", err);
    return { success: false, error: String(err) };
  }
}

export function formatCurrency(value: number, currency = "DOP"): string {
  return new Intl.NumberFormat("es-DO", {
    style: "currency",
    currency,
  }).format(value);
}
