import Link from "next/link";
import MagneticButton from "../components/MagneticButton";

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section
        id="inicio"
        className="h-screen flex flex-col justify-center items-center text-center relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #0a0a0a 0%, #141414 50%, #0f0f0f 100%)",
        }}
      >
        <div
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c9a962' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}
        />
        <div className="relative z-10 px-8 pt-28">
          <h1 className="font-[family-name:var(--font-heading)] text-[clamp(3rem,8vw,6rem)] font-semibold tracking-[-2px] leading-[1.1] mb-6 opacity-0 animate-[fadeInUp_1s_ease_forwards]">
            <span className="text-[#888] font-light">Krea</span> viste tu idea
          </h1>
          <p className="text-[1.1rem] text-[#888] max-w-[500px] mx-auto mb-8 opacity-0 animate-[fadeInUp_1s_ease_0.3s_forwards]">
            Streetwear premium diseñado para quienes crean tendencias, no las
            siguen. Ediciones limitadas, calidad insuperable.
          </p>
          <div className="flex gap-6 justify-center opacity-0 animate-[fadeInUp_1s_ease_0.6s_forwards]">
            <MagneticButton
              href="/productos"
              className="inline-block bg-[#ffffff] text-[#0a0a0a] px-8 py-3 text-[0.75rem] uppercase tracking-[2px] font-[family-name:var(--font-heading)] font-semibold transition-all duration-300 hover:bg-[#d4d4d4]"
            >
              Ver Colección
            </MagneticButton>
            <MagneticButton
              href="/nosotros"
              className="inline-block border border-[#888] text-[#888] px-8 py-3 text-[0.75rem] uppercase tracking-[2px] font-[family-name:var(--font-heading)] transition-all duration-300 hover:border-white hover:text-white"
            >
              Conoce Krea
            </MagneticButton>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-0 animate-[fadeIn_1s_ease_1.5s_forwards]">
          <span className="text-[0.65rem] tracking-[3px] uppercase text-[#888]">
            Explorar
          </span>
          <div className="w-[25px] h-[40px] border border-[#888] rounded-[12px] relative">
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-1 h-2 bg-[#888] rounded-full animate-[fadeInUp_1.5s_ease_infinite]" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-[5%] bg-[#0a0a0a]">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="feature-item reveal text-center">
            <div className="text-[#ffffff] text-2xl mb-4">&#9733;</div>
            <h4 className="font-[family-name:var(--font-heading)] text-sm uppercase tracking-[2px] mb-3">
              Ediciones Limitadas
            </h4>
            <p className="text-[#888] text-sm leading-relaxed">
              Cada pieza es producida en cantidades limitadas para mantener la
              exclusividad.
            </p>
          </div>
          <div className="feature-item reveal text-center">
            <div className="text-[#ffffff] text-2xl mb-4">&#9874;</div>
            <h4 className="font-[family-name:var(--font-heading)] text-sm uppercase tracking-[2px] mb-3">
              Calidad Premium
            </h4>
            <p className="text-[#888] text-sm leading-relaxed">
              Algodón orgánico 100% y técnicas de impresión de alta durabilidad.
            </p>
          </div>
          <div className="feature-item reveal text-center">
            <div className="text-[#ffffff] text-2xl mb-4">&#9992;</div>
            <h4 className="font-[family-name:var(--font-heading)] text-sm uppercase tracking-[2px] mb-3">
              Envío Gratuito
            </h4>
            <p className="text-[#888] text-sm leading-relaxed">
              En todos los pedidos superiores a $3,000. Entrega en 24-48h.
            </p>
          </div>
          <div className="feature-item reveal text-center">
            <div className="text-[#ffffff] text-2xl mb-4">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mx-auto"
              >
                <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
                <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
              </svg>
            </div>
            <h4 className="font-[family-name:var(--font-heading)] text-sm uppercase tracking-[2px] mb-3">
              Sostenible
            </h4>
            <p className="text-[#888] text-sm leading-relaxed">
              Producción ética y materiales eco-friendly certificados.
            </p>
          </div>
        </div>
      </section>

      {/* Products CTA Section */}
      <section id="productos" className="py-24 px-[5%] bg-[#0a0a0a]">
        <div className="text-center mb-16 reveal">
          <p className="text-[#ffffff] text-xs uppercase tracking-[3px] mb-4">
            Nueva Colección
          </p>
          <h2 className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl font-semibold tracking-[-1px]">
            Drop Exclusivo SS/26
          </h2>
          <div className="w-12 h-px bg-[#ffffff] mx-auto mt-6" />
        </div>
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <article className="bg-[#141414] border border-[#2a2a2a] p-8 relative transition-all duration-300 hover:-translate-y-2 hover:border-[#3a3a3a] reveal">
            <span className="inline-block bg-[#ffffff] text-[#0a0a0a] text-[0.6rem] uppercase tracking-[2px] font-semibold px-3 py-1 mb-4">
              Nuevo
            </span>
            <h3 className="font-[family-name:var(--font-heading)] text-xl mb-3">
              Hoodies Premium
            </h3>
            <p className="text-[#888] text-sm leading-relaxed mb-6">
              Algodón orgánico 450gsm. Corte oversized. Disponible en 6 colores
              exclusivos de esta temporada.
            </p>
            <MagneticButton
              href="/productos"
              className="inline-block bg-[#ffffff] text-[#0a0a0a] px-8 py-3 text-[0.75rem] uppercase tracking-[2px] font-[family-name:var(--font-heading)] font-semibold transition-all duration-300 hover:bg-[#d4d4d4]"
            >
              Ver más
            </MagneticButton>
          </article>
          <article className="bg-[#141414] border border-[#2a2a2a] p-8 relative transition-all duration-300 hover:-translate-y-2 hover:border-[#3a3a3a] reveal">
            <span className="inline-block bg-[#ffffff] text-[#0a0a0a] text-[0.6rem] uppercase tracking-[2px] font-semibold px-3 py-1 mb-4">
              Limitado
            </span>
            <h3 className="font-[family-name:var(--font-heading)] text-xl mb-3">
              Camisetas Gráficas
            </h3>
            <p className="text-[#888] text-sm leading-relaxed mb-6">
              Diseños artísticos únicos impresos con técnica DTG de alta
              resolución. Solo 100 unidades por diseño.
            </p>
            <MagneticButton
              href="/productos"
              className="inline-block bg-[#ffffff] text-[#0a0a0a] px-8 py-3 text-[0.75rem] uppercase tracking-[2px] font-[family-name:var(--font-heading)] font-semibold transition-all duration-300 hover:bg-[#d4d4d4]"
            >
              Ver más
            </MagneticButton>
          </article>
          <article className="bg-[#141414] border border-[#2a2a2a] p-8 relative transition-all duration-300 hover:-translate-y-2 hover:border-[#3a3a3a] reveal">
            <span className="inline-block bg-[#ffffff] text-[#0a0a0a] text-[0.6rem] uppercase tracking-[2px] font-semibold px-3 py-1 mb-4">
              Exclusivo
            </span>
            <h3 className="font-[family-name:var(--font-heading)] text-xl mb-3">
              Pantalones Cargo
            </h3>
            <p className="text-[#888] text-sm leading-relaxed mb-6">
              Corte relajado con bolsillos funcionales. Tela ripstop premium. El
              básico que tu closet necesita.
            </p>
            <MagneticButton
              href="/productos"
              className="inline-block bg-[#ffffff] text-[#0a0a0a] px-8 py-3 text-[0.75rem] uppercase tracking-[2px] font-[family-name:var(--font-heading)] font-semibold transition-all duration-300 hover:bg-[#d4d4d4]"
            >
              Ver más
            </MagneticButton>
          </article>
        </div>
      </section>

      {/* Design Your Own Section */}
      <section className="py-24 px-[5%] bg-[#0a0a0a]">
        <div className="text-center mb-16 reveal">
          <p className="text-[#ffffff] text-xs uppercase tracking-[3px] mb-4">
            Personalización Total
          </p>
          <h2 className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl font-semibold tracking-[-1px]">
            Diseña Tu Propia Ropa
          </h2>
          <div className="w-12 h-px bg-[#ffffff] mx-auto mt-6" />
        </div>
        <div className="max-w-[1200px] mx-auto px-[5%] text-center">
          <p className="reveal text-[#888] max-w-[700px] mx-auto mb-8 leading-[1.8] text-[1.1rem]">
            Usa nuestro diseñador profesional para crear prendas únicas. Sube
            tus diseños, elige colores y materiales, y visualiza tu creación en
            3D antes de ordenar.
          </p>
          <MagneticButton
            href="/designer"
            target="_blank"
            rel="noopener"
            className="reveal inline-block bg-[#ffffff] text-[#0a0a0a] px-10 py-4 text-[1.2rem] uppercase tracking-[2px] font-[family-name:var(--font-heading)] font-semibold transition-all duration-300 hover:bg-[#d4d4d4]"
          >
            Abrir Diseñador
          </MagneticButton>
        </div>
      </section>
    </>
  );
}
