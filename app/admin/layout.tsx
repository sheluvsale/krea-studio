import "../globals.css";

export const metadata = {
  title: "Panel de Administración | Krea",
  description: "Panel de control para administradores de Krea.",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#080808] text-[#e5e5e5]">{children}</div>
  );
}
