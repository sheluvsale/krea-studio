import { NextRequest, NextResponse } from "next/server";
import { sendEmail, FROM_EMAIL } from "@/app/lib/email";

export const dynamic = "force-dynamic";

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface OrderData {
  orderNumber: string;
  customerEmail: string;
  customerName: string;
  items: OrderItem[];
  total: number;
  currency?: string;
}

function formatCurrency(value: number, currency = "DOP"): string {
  return new Intl.NumberFormat("es-DO", {
    style: "currency",
    currency,
  }).format(value);
}

function buildOrderEmailHTML(data: OrderData): string {
  const { orderNumber, customerName, items, total, currency = "DOP" } = data;

  const itemsHtml = items
    .map(
      (item) => `
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid #2a2a2a;color:#f5f5f5;">${item.name}</td>
          <td style="padding:12px 0;border-bottom:1px solid #2a2a2a;color:#f5f5f5;text-align:center;">${item.quantity}</td>
          <td style="padding:12px 0;border-bottom:1px solid #2a2a2a;color:#f5f5f5;text-align:right;">${formatCurrency(item.price, currency)}</td>
        </tr>
      `,
    )
    .join("");

  return `
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body style="background-color:#0a0a0a;color:#f5f5f5;font-family:'Inter','Helvetica Neue',Arial,sans-serif;margin:0;padding:0;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a0a0a;">
          <tr>
            <td align="center" style="padding:40px 20px;">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color:#141414;border:1px solid #2a2a2a;max-width:600px;width:100%;">
                <tr>
                  <td style="padding:40px;">
                    <h1 style="margin:0 0 8px;font-size:24px;letter-spacing:-0.5px;">¡Gracias por tu compra, ${customerName}!</h1>
                    <p style="margin:0 0 24px;color:#888;font-size:14px;">Pedido <strong style="color:#fff;">#${orderNumber}</strong></p>
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                      <thead>
                        <tr>
                          <th align="left" style="padding:12px 0;border-bottom:1px solid #2a2a2a;color:#888;font-size:12px;text-transform:uppercase;letter-spacing:1.5px;">Producto</th>
                          <th align="center" style="padding:12px 0;border-bottom:1px solid #2a2a2a;color:#888;font-size:12px;text-transform:uppercase;letter-spacing:1.5px;">Cant.</th>
                          <th align="right" style="padding:12px 0;border-bottom:1px solid #2a2a2a;color:#888;font-size:12px;text-transform:uppercase;letter-spacing:1.5px;">Precio</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${itemsHtml}
                      </tbody>
                    </table>
                    <div style="border-top:1px solid #2a2a2a;padding-top:16px;text-align:right;">
                      <p style="margin:0;font-size:18px;font-weight:600;">Total: ${formatCurrency(total, currency)}</p>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="padding:20px 40px;border-top:1px solid #2a2a2a;color:#888;font-size:12px;text-align:center;">
                    Krea Studio - Streetwear Premium
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as OrderData;

    if (!body.customerEmail || !body.orderNumber || !body.items) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const html = buildOrderEmailHTML(body);

    const result = await sendEmail({
      to: body.customerEmail,
      subject: `Confirmación de pedido #${body.orderNumber} - Krea Studio`,
      html,
      text: `Gracias por tu compra, ${body.customerName}. Pedido #${body.orderNumber}. Total: ${formatCurrency(body.total, body.currency)}`,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, id: result.id });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
