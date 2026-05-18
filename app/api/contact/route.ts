import { NextRequest, NextResponse } from "next/server";
import { execute } from "@/app/lib/db";

const BUSINESS_EMAIL = "kreastudio.business1604@gmail.com";

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
    pedido: "tu consulta sobre pedido",
    producto: "tu consulta sobre producto",
    envio: "tu consulta sobre envíos",
    devolucion: "tu solicitud de devolución",
    colaboracion: "tu propuesta de colaboración",
    otro: "tu mensaje",
  };

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Hemos recibido tu mensaje - Krea Studio</title>
  <style>
    body { margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0a0a0a; color: #f5f5f5; }
    .container { max-width: 600px; margin: 0 auto; background-color: #141414; }
    .header { background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%); padding: 40px 30px; text-align: center; border-bottom: 1px solid #2a2a2a; }
    .logo { font-size: 28px; font-weight: 700; letter-spacing: 4px; color: #ffffff; margin-bottom: 8px; }
    .tagline { font-size: 12px; color: #888; text-transform: uppercase; letter-spacing: 2px; }
    .content { padding: 40px 30px; }
    .greeting { font-size: 24px; font-weight: 600; margin-bottom: 24px; color: #ffffff; }
    .text { font-size: 14px; color: #d4d4d4; line-height: 1.8; margin-bottom: 16px; }
    .highlight { background-color: #1a1a1a; border: 1px solid #2a2a2a; padding: 24px; margin: 24px 0; text-align: center; }
    .highlight-text { font-size: 13px; color: #888; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 8px; }
    .highlight-value { font-size: 16px; color: #ffffff; font-weight: 500; }
    .cta-button { display: inline-block; background-color: #ffffff; color: #0a0a0a; padding: 16px 32px; text-decoration: none; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 2px; margin: 24px 0; }
    .social { margin-top: 32px; padding-top: 32px; border-top: 1px solid #2a2a2a; }
    .social-title { font-size: 12px; color: #888; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 16px; text-align: center; }
    .social-links { text-align: center; }
    .social-link { display: inline-block; color: #888; text-decoration: none; font-size: 12px; margin: 0 12px; text-transform: uppercase; letter-spacing: 1px; }
    .footer { background-color: #0a0a0a; padding: 30px; text-align: center; border-top: 1px solid #2a2a2a; }
    .footer-text { font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">KREA STUDIO</div>
      <div class="tagline">Streetwear Premium</div>
    </div>
    <div class="content">
      <div class="greeting">¡Hola ${data.nombre}!</div>
      <div class="text">Hemos recibido ${asuntosLabel[data.asunto] || "tu mensaje"} correctamente. Nuestro equipo lo está revisando y te responderemos en un plazo de 24 a 48 horas hábiles.</div>
      
      <div class="highlight">
        <div class="highlight-text">Tiempo de respuesta estimado</div>
        <div class="highlight-value">24-48 horas hábiles</div>
      </div>
      
      <div class="text">Mientras tanto, puedes explorar nuestra última colección y descubrir las piezas que están definiendo el streetwear dominicano.</div>
      
      <div style="text-align: center;">
        <a href="https://krea-studio.shop/productos" class="cta-button">Ver Colección</a>
      </div>
      
      <div class="social">
        <div class="social-title">Síguenos</div>
        <div class="social-links">
          <a href="https://www.instagram.com/krea.studio.shop/" class="social-link">Instagram</a>
          <a href="https://www.tiktok.com/@krea.studio.shop" class="social-link">TikTok</a>
        </div>
      </div>
    </div>
    <div class="footer">
      <p class="footer-text">© 2026 Krea Studio. Todos los derechos reservados.</p>
      <p class="footer-text" style="margin-top: 8px;">La Vega, República Dominicana</p>
      <p class="footer-text" style="margin-top: 16px; font-size: 11px;">Este es un correo automático, por favor no respondas a esta dirección.</p>
    </div>
  </div>
</body>
</html>`;
}

async function sendEmail({
  to,
  subject,
  html,
  replyTo,
}: {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}) {
  // For now, we'll log the email. In production, integrate with:
  // - SendGrid
  // - AWS SES
  // - Resend
  // - Hostinger Email (when ready)

  console.log("[EMAIL] Sending email:");
  console.log("  To:", to);
  console.log("  Subject:", subject);
  console.log("  Reply-To:", replyTo);
  console.log("  HTML length:", html.length);

  // TODO: Implement actual email sending when email service is configured
  // Example with SendGrid:
  // const sgMail = require('@sendgrid/mail');
  // sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  // await sgMail.send({ to, from: BUSINESS_EMAIL, subject, html, replyTo });

  return true;
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

    // Store in database
    await execute(`
      CREATE TABLE IF NOT EXISTS mensajes_contacto (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        asunto VARCHAR(100) NOT NULL,
        mensaje TEXT NOT NULL,
        leido BOOLEAN NOT NULL DEFAULT FALSE,
        creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await execute(
      `INSERT INTO mensajes_contacto (nombre, email, asunto, mensaje) VALUES (?, ?, ?, ?)`,
      [nombre, email, asunto, mensaje],
    );

    // Send notification email to business
    await sendEmail({
      to: BUSINESS_EMAIL,
      subject: `Nuevo mensaje: ${asunto} - ${nombre}`,
      html: getBusinessEmailTemplate({ nombre, email, asunto, mensaje }),
      replyTo: email,
    });

    // Send confirmation email to customer
    await sendEmail({
      to: email,
      subject: "Hemos recibido tu mensaje - Krea Studio",
      html: getCustomerEmailTemplate({ nombre, asunto }),
    });

    return NextResponse.json({
      success: true,
      message: "Mensaje enviado correctamente. Te responderemos pronto.",
    });
  } catch (error) {
    console.error("Contact POST error:", error);
    return NextResponse.json(
      { error: "Error al enviar el mensaje. Intenta de nuevo." },
      { status: 500 },
    );
  }
}
