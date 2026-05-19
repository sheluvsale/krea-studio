import { NextRequest, NextResponse } from "next/server";
import { execute } from "@/app/lib/db";
import { sendEmail, BUSINESS_EMAIL } from "@/app/lib/email";
import { getCurrentUser } from "@/app/lib/session";

// Email template for business notification
function getBusinessEmailTemplate(data: {
  nombre: string;
  email: string;
  asunto: string;
  mensaje: string;
}) {
  const asuntosLabel: Record<string, string> = {
    pedido: "Consulta sobre pedido",
    producto: "Información de producto",
    envio: "Envíos y entregas",
    devolucion: "Devoluciones",
    colaboracion: "Colaboraciones",
    otro: "Otro",
  };

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nuevo mensaje de contacto - Krea Studio</title>
  <style>
    body { margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0a0a0a; color: #f5f5f5; }
    .container { max-width: 600px; margin: 0 auto; background-color: #141414; }
    .header { background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%); padding: 40px 30px; text-align: center; border-bottom: 1px solid #2a2a2a; }
    .logo { font-size: 28px; font-weight: 700; letter-spacing: 4px; color: #ffffff; margin-bottom: 8px; }
    .tagline { font-size: 12px; color: #888; text-transform: uppercase; letter-spacing: 2px; }
    .content { padding: 40px 30px; }
    .section { background-color: #1a1a1a; border: 1px solid #2a2a2a; padding: 24px; margin-bottom: 20px; }
    .label { font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #888; margin-bottom: 8px; }
    .value { font-size: 14px; color: #f5f5f5; line-height: 1.6; }
    .message-box { background-color: #0a0a0a; border-left: 3px solid #ffffff; padding: 20px; margin-top: 16px; }
    .message-text { font-size: 14px; color: #d4d4d4; line-height: 1.7; white-space: pre-wrap; }
    .footer { background-color: #0a0a0a; padding: 30px; text-align: center; border-top: 1px solid #2a2a2a; }
    .footer-text { font-size: 12px; color: #666; }
    .divider { height: 1px; background-color: #2a2a2a; margin: 24px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">KREA STUDIO</div>
      <div class="tagline">Streetwear Premium</div>
    </div>
    <div class="content">
      <div style="text-align: center; margin-bottom: 32px;">
        <h1 style="font-size: 20px; font-weight: 600; color: #ffffff; margin: 0 0 8px 0; text-transform: uppercase; letter-spacing: 2px;">Nuevo Mensaje de Contacto</h1>
        <p style="font-size: 13px; color: #888; margin: 0;">Has recibido un nuevo mensaje desde el formulario de contacto</p>
      </div>
      
      <div class="section">
        <div class="label">Remitente</div>
        <div class="value" style="font-size: 18px; font-weight: 600; margin-bottom: 16px;">${data.nombre}</div>
        <div class="label">Correo Electrónico</div>
        <div class="value"><a href="mailto:${data.email}" style="color: #ffffff; text-decoration: none;">${data.email}</a></div>
      </div>
      
      <div class="section">
        <div class="label">Asunto</div>
        <div class="value" style="font-weight: 500;">${asuntosLabel[data.asunto] || data.asunto}</div>
        <div class="divider"></div>
        <div class="label">Mensaje</div>
        <div class="message-box">
          <div class="message-text">${data.mensaje.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</div>
        </div>
      </div>
      
      <div style="text-align: center; margin-top: 32px;">
        <p style="font-size: 12px; color: #666; margin-bottom: 16px;">Responde directamente a este cliente respondiendo a este correo</p>
      </div>
    </div>
    <div class="footer">
      <p class="footer-text">© 2026 Krea Studio. Todos los derechos reservados.</p>
      <p class="footer-text" style="margin-top: 8px;">La Vega, República Dominicana</p>
    </div>
  </div>
</body>
</html>`;
}

// Auto-reply template for customer
function getCustomerEmailTemplate(data: { nombre: string; asunto: string }) {
  const asuntosLabel: Record<string, string> = {
    pedido: "consulta sobre pedido",
    producto: "consulta sobre producto",
    envio: "consulta sobre envíos",
    devolucion: "solicitud de devolución",
    colaboracion: "propuesta de colaboración",
    otro: "mensaje",
  };

  const asuntoTexto = asuntosLabel[data.asunto] || "mensaje";

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Krea Studio — Hemos recibido tu ${asuntoTexto}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap');
    body { margin: 0; padding: 0; background-color: #080808; color: #e5e5e5; font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; -webkit-font-smoothing: antialiased; }
    .wrapper { background-color: #080808; padding: 40px 16px; }
    .container { max-width: 560px; margin: 0 auto; background-color: #0f0f0f; border: 1px solid #1f1f1f; border-radius: 16px; overflow: hidden; }
    .header { background: linear-gradient(145deg, #111111 0%, #0a0a0a 100%); padding: 48px 40px 40px; text-align: center; border-bottom: 1px solid #1f1f1f; }
    .logo-icon { width: 48px; height: 48px; background: #ffffff; border-radius: 12px; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; }
    .logo-icon svg { width: 24px; height: 24px; }
    .logo-text { font-family: 'Space Grotesk', sans-serif; font-size: 22px; font-weight: 700; letter-spacing: 6px; color: #ffffff; text-transform: uppercase; }
    .tagline { font-size: 11px; color: #666; text-transform: uppercase; letter-spacing: 3px; margin-top: 8px; font-family: 'Space Grotesk', sans-serif; }
    .content { padding: 40px; }
    .badge { display: inline-block; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.08); color: #888; font-size: 10px; text-transform: uppercase; letter-spacing: 2px; padding: 6px 14px; border-radius: 100px; margin-bottom: 24px; font-family: 'Space Grotesk', sans-serif; }
    .greeting { font-family: 'Space Grotesk', sans-serif; font-size: 26px; font-weight: 600; color: #ffffff; margin-bottom: 20px; line-height: 1.2; letter-spacing: -0.5px; }
    .text { font-size: 15px; color: #a0a0a0; line-height: 1.75; margin-bottom: 16px; }
    .divider { height: 1px; background: linear-gradient(90deg, transparent, #1f1f1f, transparent); margin: 32px 0; }
    .info-card { background: #141414; border: 1px solid #1f1f1f; border-radius: 12px; padding: 24px; margin: 24px 0; }
    .info-label { font-size: 10px; text-transform: uppercase; letter-spacing: 2px; color: #555; margin-bottom: 6px; font-family: 'Space Grotesk', sans-serif; }
    .info-value { font-size: 14px; color: #d4d4d4; }
    .cta { text-align: center; margin: 32px 0; }
    .cta a { display: inline-block; background: #ffffff; color: #0a0a0a; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-family: 'Space Grotesk', sans-serif; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 2px; transition: all 0.3s; }
    .cta a:hover { background: #d4d4d4; }
    .social-row { text-align: center; padding: 0 40px 32px; }
    .social-label { font-size: 10px; text-transform: uppercase; letter-spacing: 2px; color: #444; margin-bottom: 12px; font-family: 'Space Grotesk', sans-serif; }
    .social-link { display: inline-block; color: #777; text-decoration: none; font-size: 13px; margin: 0 10px; transition: color 0.2s; }
    .social-link:hover { color: #ffffff; }
    .footer { background: #0a0a0a; padding: 28px 40px; text-align: center; border-top: 1px solid #1f1f1f; }
    .footer-brand { font-family: 'Space Grotesk', sans-serif; font-size: 14px; font-weight: 600; letter-spacing: 4px; color: #333; margin-bottom: 8px; }
    .footer-text { font-size: 12px; color: #444; line-height: 1.6; }
    .footer-note { font-size: 11px; color: #333; margin-top: 12px; }
    @media (max-width: 520px) {
      .wrapper { padding: 20px 12px; }
      .header { padding: 32px 24px 28px; }
      .content { padding: 28px 24px; }
      .greeting { font-size: 22px; }
      .text { font-size: 14px; }
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <div class="logo-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </div>
        <div class="logo-text">KREA</div>
        <div class="tagline">Streetwear Premium</div>
      </div>
      <div class="content">
        <div class="badge">Confirmación de recepción</div>
        <div class="greeting">¡Gracias por escribirnos, ${data.nombre}!</div>
        <div class="text">Hemos recibido tu <strong style="color:#ffffff; font-weight:500;">${asuntoTexto}</strong> y nuestro equipo de soporte ya lo tiene en revisión. Nos tomamos cada consulta en serio.</div>
        <div class="text">Puedes esperar una respuesta personalizada dentro de las próximas <strong style="color:#ffffff; font-weight:500;">24 a 48 horas hábiles</strong>. Te notificaremos directamente a este correo.</div>
        
        <div class="divider"></div>
        
        <div class="info-card">
          <div class="info-label">Estado de tu consulta</div>
          <div class="info-value">Recibida — En revisión por el equipo Krea</div>
        </div>
        
        <div class="text" style="text-align:center; color:#666; font-size:13px;">Mientras tanto, descubre lo nuevo en nuestra tienda.</div>
        
        <div class="cta">
          <a href="https://krea-studio.shop/productos">Explorar Colección</a>
        </div>
      </div>
      
      <div class="social-row">
        <div class="social-label">Síguenos</div>
        <a href="https://www.instagram.com/krea.studio.shop/" class="social-link">Instagram</a>
        <span style="color:#333;">·</span>
        <a href="https://www.tiktok.com/@krea.studio.shop" class="social-link">TikTok</a>
      </div>
      
      <div class="footer">
        <div class="footer-brand">KREA</div>
        <div class="footer-text">La Vega, República Dominicana<br/>© 2026 Krea Studio. Todos los derechos reservados.</div>
        <div class="footer-note">Este es un correo automático. Para responder, usa el formulario de contacto en nuestro sitio.</div>
      </div>
    </div>
  </div>
</body>
</html>`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { nombre, email, asunto, mensaje } = body;

    if (!nombre || !email || !asunto || !mensaje) {
      return NextResponse.json(
        { error: "Todos los campos son obligatorios." },
        { status: 400 },
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "El correo electrónico no es válido." },
        { status: 400 },
      );
    }

    // Si hay sesión, asociamos el mensaje al usuario.
    const currentUser = await getCurrentUser();
    const usuarioId = currentUser?.userId ?? null;

    // 1) Guardar en DB. Si falla aquí, devolvemos 500 con detalle (es el error
    //    más probable: tabla inexistente).
    try {
      await execute(
        `INSERT INTO mensajes_contacto (usuario_id, nombre, email, asunto, mensaje)
         VALUES (?, ?, ?, ?, ?)`,
        [usuarioId, nombre, email, asunto, mensaje],
      );
    } catch (dbErr) {
      console.error("Contact DB insert error:", dbErr);
      const detail =
        process.env.NODE_ENV !== "production"
          ? ` (${(dbErr as Error).message})`
          : "";
      return NextResponse.json(
        { error: `Error al guardar el mensaje.${detail}` },
        { status: 500 },
      );
    }

    // 2) Enviar correos. No lanzan: sendEmail captura sus propios errores.
    //    Si algún proveedor falla, lo registramos pero devolvemos éxito porque
    //    el mensaje ya está guardado y el admin lo verá en su panel.
    const [businessRes, clientRes] = await Promise.all([
      sendEmail({
        to: BUSINESS_EMAIL,
        subject: `Nuevo mensaje: ${asunto} - ${nombre}`,
        html: getBusinessEmailTemplate({ nombre, email, asunto, mensaje }),
        replyTo: email,
      }),
      sendEmail({
        to: email,
        subject: "Hemos recibido tu mensaje - Krea Studio",
        html: getCustomerEmailTemplate({ nombre, asunto }),
      }),
    ]);

    if (!businessRes.success) {
      console.warn("[contact] business email failed:", businessRes.error);
    }
    if (!clientRes.success) {
      console.warn("[contact] client email failed:", clientRes.error);
    }

    return NextResponse.json({
      success: true,
      message: "Mensaje enviado correctamente. Te responderemos pronto.",
      emailDelivered: businessRes.success && clientRes.success,
    });
  } catch (error) {
    console.error("Contact POST error:", error);
    const detail =
      process.env.NODE_ENV !== "production"
        ? ` (${(error as Error).message})`
        : "";
    return NextResponse.json(
      { error: `Error al enviar el mensaje.${detail}` },
      { status: 500 },
    );
  }
}
