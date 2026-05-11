import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-[#0a0a0a] border-t border-[#2a2a2a]">
      <div className="max-w-[1600px] mx-auto px-[5%] py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 min-h-[40vh]">
        <div className="lg:col-span-1">
          <Image
            src="/images/logo/Krea-blanco-sinfondo.png"
            alt="Krea"
            width={120}
            height={40}
            className="mb-6"
          />
          <p className="text-[#888] text-sm leading-relaxed">
            Krea es más que ropa. Es una actitud. Diseñamos streetwear premium
            para creadores, innovadores y soñadores que no siguen las reglas.
          </p>
        </div>

        <div>
          <h4 className="font-[family-name:var(--font-heading)] text-xs uppercase tracking-[2px] mb-6">
            Tienda
          </h4>
          <ul className="space-y-3">
            <li>
              <Link
                href="/productos"
                className="text-[#888] text-sm hover:text-white transition-colors"
              >
                Todos los Productos
              </Link>
            </li>
            <li>
              <Link
                href="/productos"
                className="text-[#888] text-sm hover:text-white transition-colors"
              >
                Nuevos Drops
              </Link>
            </li>
            <li>
              <Link
                href="/productos"
                className="text-[#888] text-sm hover:text-white transition-colors"
              >
                Más Vendidos
              </Link>
            </li>
            <li>
              <Link
                href="/productos"
                className="text-[#888] text-sm hover:text-white transition-colors"
              >
                Accesorios
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-[family-name:var(--font-heading)] text-xs uppercase tracking-[2px] mb-6">
            Ayuda
          </h4>
          <ul className="space-y-3">
            <li>
              <Link
                href="/contacto"
                className="text-[#888] text-sm hover:text-white transition-colors"
              >
                Contacto
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="text-[#888] text-sm hover:text-white transition-colors"
              >
                Guía de Tallas
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="text-[#888] text-sm hover:text-white transition-colors"
              >
                Envíos
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="text-[#888] text-sm hover:text-white transition-colors"
              >
                Devoluciones
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-[family-name:var(--font-heading)] text-xs uppercase tracking-[2px] mb-6">
            Krea
          </h4>
          <ul className="space-y-3">
            <li>
              <Link
                href="/nosotros"
                className="text-[#888] text-sm hover:text-white transition-colors"
              >
                Sobre Nosotros
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="text-[#888] text-sm hover:text-white transition-colors"
              >
                Sostenibilidad
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="text-[#888] text-sm hover:text-white transition-colors"
              >
                Términos y Condiciones
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="text-[#888] text-sm hover:text-white transition-colors"
              >
                Política de Privacidad
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-[#2a2a2a]">
        <div className="max-w-[1600px] mx-auto px-[5%] py-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[#888] text-xs">
            &copy; 2026 Krea Streetwear. Todos los derechos reservados.
          </p>
          <div className="flex gap-6">
            <a
              href="#"
              aria-label="Instagram"
              className="text-[#888] text-xs uppercase tracking-[2px] hover:text-white transition-colors"
            >
              Instagram
            </a>
            <a
              href="#"
              aria-label="TikTok"
              className="text-[#888] text-xs uppercase tracking-[2px] hover:text-white transition-colors"
            >
              TikTok
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
