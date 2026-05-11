import "../globals.css";
import { NoCursorScript } from "./NoCursorScript";

export const metadata = {
  title: "Diseñador de Ropa | Krea Studio",
  description:
    "Diseña tu propia ropa personalizada con nuestro editor profesional.",
};

export default function DesignerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen overflow-hidden bg-[#0a0a0a] text-white">
      <NoCursorScript />
      {children}
    </div>
  );
}
