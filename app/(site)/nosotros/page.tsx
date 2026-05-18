import Link from "next/link";
import Image from "next/image";

export default function NosotrosPage() {
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
        <div className="relative z-10 px-8">
          <h1 className="font-[family-name:var(--font-heading)] text-[clamp(3rem,8vw,6rem)] font-semibold tracking-[-2px] leading-[1.1] mb-6 opacity-0 animate-[fadeInUp_1s_ease_forwards]">
            <span className="text-[#888] font-light">Krea</span> nuestra
            historia
          </h1>
          <p className="text-[1.1rem] text-[#888] max-w-[500px] mx-auto mb-8 opacity-0 animate-[fadeInUp_1s_ease_0.3s_forwards]">
            Nacimos de la necesidad de crear algo auténtico. Sin seguir
            tendencias, sin pedir permiso. Solo ropa real para personas reales.
          </p>
          <div className="flex gap-6 justify-center opacity-0 animate-[fadeInUp_1s_ease_0.6s_forwards]">
            <Link
              href="/productos"
              className="inline-block bg-[#ffffff] text-[#0a0a0a] px-8 py-3 text-[0.75rem] uppercase tracking-[2px] font-[family-name:var(--font-heading)] font-semibold transition-all duration-300 hover:bg-[#d4d4d4]"
            >
              Ver Colección
            </Link>
            <a
              href="#historia"
              className="inline-block border border-[#888] text-[#888] px-8 py-3 text-[0.75rem] uppercase tracking-[2px] font-[family-name:var(--font-heading)] transition-all duration-300 hover:border-white hover:text-white"
            >
              Leer Más
            </a>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-0 animate-[fadeIn_1s_ease_1.5s_forwards]">
          <span className="text-[0.65rem] tracking-[3px] uppercase text-[#888]">
            Descubrir
          </span>
          <div className="w-[25px] h-[40px] border border-[#888] rounded-[12px] relative">
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-1 h-2 bg-[#888] rounded-full animate-[fadeInUp_1.5s_ease_infinite]" />
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section id="historia" className="py-24 px-[5%] bg-[#0a0a0a]">
        <div className="text-center mb-16 reveal">
          <p className="text-[#ffffff] text-xs uppercase tracking-[3px] mb-4">
            Desde 2024
          </p>
          <h2 className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl font-semibold tracking-[-1px]">
            El Origen de Krea
          </h2>
          <div className="w-12 h-px bg-[#ffffff] mx-auto mt-6" />
        </div>
        <div className="max-w-[1200px] mx-auto px-[5%]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="reveal">
              <h3 className="font-[family-name:var(--font-heading)] text-2xl mb-6 font-medium">
                Creado por y para creadores
              </h3>
              <p className="text-[#888] leading-[1.8] mb-6">
                Krea nació en un pequeño taller donde la pasión por el diseño
                superaba los recursos. Empezamos con una simple pregunta: ¿Por
                qué la ropa de calidad tiene que costar el triple?
              </p>
              <p className="text-[#888] leading-[1.8] mb-6">
                Decidimos eliminar el intermediario. Diseño propio, producción
                local y venta directa. Así nació nuestra fórmula: calidad de
                lujo a precios honestos.
              </p>
              <p className="text-[#888] leading-[1.8]">
                Hoy seguimos siendo independientes. Cada drop es limitado porque
                creemos en la exclusividad real, no en la producción masiva.
                Cuando compras Krea, compras algo que pocas personas tendrán.
              </p>
            </div>
            <div className="reveal bg-[#1a1a1a] h-[400px] flex items-center justify-center border border-[#2a2a2a]">
              <span className="text-[#888] text-sm">
                [Imagen: El taller fundador de Krea]
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section id="valores" className="py-24 px-[5%] bg-[#0a0a0a]">
        <div className="text-center mb-16 reveal">
          <p className="text-[#ffffff] text-xs uppercase tracking-[3px] mb-4">
            Nuestros Pilares
          </p>
          <h2 className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl font-semibold tracking-[-1px]">
            Lo Que Nos Define
          </h2>
          <div className="w-12 h-px bg-[#ffffff] mx-auto mt-6" />
        </div>
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              badge: "Calidad",
              title: "Calidad Sin Compromisos",
              desc: "Usamos algodón orgánico certificado de 240-450gsm. Nuestros hoodies pesan el doble que los de marca convencional. Cada costura está reforzada para durar años, no temporadas.",
            },
            {
              badge: "Exclusividad",
              title: "Ediciones Limitadas",
              desc: "Nunca reponemos stock. Cada drop tiene una cantidad fija y cuando se agota, se agota. Esto elimina el desperdicio y garantiza que tu pieza sea exclusiva.",
            },
            {
              badge: "Ética",
              title: "Producción Ética",
              desc: "Fabricamos en talleres locales donde conocemos a cada persona que toca nuestra ropa. Salarios justos, condiciones dignas y cero tolerancia a la explotación.",
            },
            {
              badge: "Atemporal",
              title: "Diseño Atemporal",
              desc: "No seguimos tendencias pasajeras. Creamos piezas que se verán bien dentro de 5 años. Minimalismo funcional, siluetas oversized y detalles que importan.",
            },
          ].map((v) => (
            <article
              key={v.badge}
              className="bg-[#141414] border border-[#2a2a2a] p-8 relative transition-all duration-300 hover:-translate-y-2 hover:border-[#3a3a3a] reveal"
            >
              <span className="inline-block bg-[#ffffff] text-[#0a0a0a] text-[0.6rem] uppercase tracking-[2px] font-semibold px-3 py-1 mb-4">
                {v.badge}
              </span>
              <h3 className="font-[family-name:var(--font-heading)] text-xl mb-3">
                {v.title}
              </h3>
              <p className="text-[#888] text-sm leading-relaxed">{v.desc}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="py-24 px-[5%] bg-[#0a0a0a]">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {[
            {
              num: "12",
              title: "Drops Realizados",
              desc: "Cada uno agotado en menos de 72 horas",
            },
            {
              num: "50K+",
              title: "Clientes Satisfechos",
              desc: "En más de 30 países diferentes",
            },
            {
              num: "100%",
              title: "Algodón Orgánico",
              desc: "Certificado GOTS en todas nuestras piezas",
            },
            {
              num: "0",
              title: "Toneladas de Residuos",
              desc: "Producción bajo demanda, nunca inventario destruido",
            },
          ].map((s) => (
            <div key={s.title} className="text-center reveal">
              <div className="font-[family-name:var(--font-heading)] text-4xl md:text-5xl font-semibold text-[#ffffff] mb-2">
                {s.num}
              </div>
              <h4 className="font-[family-name:var(--font-heading)] text-sm uppercase tracking-[2px] mb-3">
                {s.title}
              </h4>
              <p className="text-[#888] text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="py-24 px-[5%] bg-[#0a0a0a]">
        <div className="text-center mb-16 reveal">
          <p className="text-[#ffffff] text-xs uppercase tracking-[3px] mb-4">
            Quienes Somos
          </p>
          <h2 className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl font-semibold tracking-[-1px]">
            El Equipo Krea
          </h2>
          <div className="w-12 h-px bg-[#ffffff] mx-auto mt-6" />
        </div>
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              name: "Manuel Castillo",
              role: "Fundador & Director Creativo",
              img: "/images/team/founder.jpg",
            },
            {
              name: "John Doe",
              role: "Director de Diseño",
              img: "/images/team/designer.jpg",
            },
            {
              name: "Jane Doe",
              role: "Directora de Operaciones",
              img: "/images/team/operations.jpg",
            },
          ].map((m) => (
            <article
              key={m.name}
              className="bg-[#141414] border border-[#2a2a2a] overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:border-[#3a3a3a] reveal"
            >
              <div className="h-[350px] overflow-hidden">
                <Image
                  src={m.img}
                  alt={m.name}
                  width={400}
                  height={350}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="font-[family-name:var(--font-heading)] text-lg mb-1">
                  {m.name}
                </h3>
                <p className="text-[#888] text-sm">{m.role}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
