import React from "react";

interface Props {
  children: React.ReactNode;
  preview?: string;
}

export default function BaseEmail({ children, preview }: Props) {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {preview && (
          <meta name="description" content={preview} />
        )}
      </head>
      <body
        style={{
          backgroundColor: "#0a0a0a",
          color: "#f5f5f5",
          fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
          margin: 0,
          padding: 0,
        }}
      >
        <table
          width="100%"
          cellPadding="0"
          cellSpacing="0"
          style={{ backgroundColor: "#0a0a0a" }}
        >
          <tr>
            <td align="center" style={{ padding: "40px 20px" }}>
              <table
                width="600"
                cellPadding="0"
                cellSpacing="0"
                style={{
                  backgroundColor: "#141414",
                  border: "1px solid #2a2a2a",
                  maxWidth: "600px",
                  width: "100%",
                }}
              >
                <tr>
                  <td style={{ padding: "40px" }}>{children}</td>
                </tr>
                <tr>
                  <td
                    style={{
                      padding: "20px 40px",
                      borderTop: "1px solid #2a2a2a",
                      color: "#888",
                      fontSize: "12px",
                      textAlign: "center",
                    }}
                  >
                    Krea Studio - Streetwear Premium
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  );
}
