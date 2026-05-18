"use client";

import Link from "next/link";
import Image from "next/image";
import { useHelpModals } from "./HelpModals";

export default function Footer() {
  const { isOpen, openModal, closeModal, modalType, HelpModalsComponent } =
    useHelpModals();

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
              <button
                onClick={() => openModal("size")}
                className="text-[#888] text-sm hover:text-white transition-colors bg-transparent border-none cursor-pointer"
              >
                Guía de Tallas
              </button>
            </li>
            <li>
              <button
                onClick={() => openModal("shipping")}
                className="text-[#888] text-sm hover:text-white transition-colors bg-transparent border-none cursor-pointer"
              >
                Envíos
              </button>
            </li>
            <li>
              <button
                onClick={() => openModal("returns")}
                className="text-[#888] text-sm hover:text-white transition-colors bg-transparent border-none cursor-pointer"
              >
                Devoluciones
              </button>
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
                href="/sostenibilidad"
                className="text-[#888] text-sm hover:text-white transition-colors"
              >
                Sostenibilidad
              </Link>
            </li>
            <li>
              <Link
                href="/terminos"
                className="text-[#888] text-sm hover:text-white transition-colors"
              >
                Términos y Condiciones
              </Link>
            </li>
            <li>
              <Link
                href="/privacidad"
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
            &copy; 2026 Krea Studio. Todos los derechos reservados.
          </p>
          <div className="flex gap-6">
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.instagram.com/krea.studio.shop/"
              aria-label="Instagram"
              className="text-[#888] text-xs uppercase tracking-[2px] hover:text-white transition-colors"
            >
              Instagram
            </a>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.tiktok.com/@krea.studio.shop"
              aria-label="TikTok"
              className="text-[#888] text-xs uppercase tracking-[2px] hover:text-white transition-colors"
            >
              TikTok
            </a>
          </div>
        </div>
      </div>

      {/* Help Modals */}
      <HelpModalsComponent />
    </footer>
  );
}
