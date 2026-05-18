import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sostenibilidad | Krea Studio",
  description: "Nuestro compromiso con la moda sostenible y responsable.",
};

export default function SostenibilidadPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      {/* Hero */}
      <section className="relative py-24 px-[5%] border-b border-[#2a2a2a]">
        <div className="max-w-[1000px] mx-auto text-center">
          <p className="text-[#888] text-xs uppercase tracking-[3px] mb-4">
            Nuestro Compromiso
          </p>
          <h1 className="font-[family-name:var(--font-heading)] text-4xl md:text-5xl lg:text-6xl font-semibold tracking-[-2px] mb-6">
            Sostenibilidad
          </h1>
          <p className="text-[#888] text-lg max-w-[600px] mx-auto leading-relaxed">
            Creemos en un futuro donde la moda streetwear puede coexistir con el respeto 
            por nuestro planeta. Cada decisión que tomamos considera su impacto ambiental.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-[5%] border-b border-[#2a2a2a]">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { number: "80%", label: "Materiales orgánicos o reciclados" },
            { number: "0%", label: "Plásticos de un solo uso en empaques" },
            { number: "100%", label: "Producción local en República Dominicana" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-5xl md:text-6xl font-bold text-white mb-3 tracking-[-2px]">
                {stat.number}
              </div>
              <p className="text-[#888] text-sm uppercase tracking-[2px]">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Content */}
      <section className="py-20 px-[5%]">
        <div className="max-w-[800px] mx-auto space-y-16">
          {/* Section 1 */}
          <div className="space-y-6">
            <h2 className="font-[family-name:var(--font-heading)] text-2xl md:text-3xl font-semibold tracking-[-1px]">
              Materiales Responsables
            </h2>
            <p className="text-[#888] leading-relaxed">
              Priorizamos el uso de algodón orgánico, poliéster reciclado y tintes 
              de bajo impacto ambiental. Nuestras prendas están diseñadas para durar, 
              reduciendo la necesidad de reemplazo frecuente y minimizando residuos textiles.
            </p>
            <ul className="space-y-3 text-[#888]">
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 bg-white mt-2" />
                Algodón 100% orgánico certificado
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 bg-white mt-2" />
                Poliéster reciclado de botellas PET
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 bg-white mt-2" />
                Tintes libres de metales pesados
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 bg-white mt-2" />
                Botones y accesorios de materiales naturales
              </li>
            </ul>
          </div>

          {/* Section 2 */}
          <div className="space-y-6">
            <h2 className="font-[family-name:var(--font-heading)] text-2xl md:text-3xl font-semibold tracking-[-1px]">
              Producción Local
            </h2>
            <p className="text-[#888] leading-relaxed">
              Todas nuestras prendas son confeccionadas en la República Dominicana, 
              apoyando la economía local y reduciendo la huella de carbono asociada 
              al transporte internacional. Trabajamos con talleres que garantizan 
              condiciones laborales justas y seguras.
            </p>
          </div>

          {/* Section 3 */}
          <div className="space-y-6">
            <h2 className="font-[family-name:var(--font-heading)] text-2xl md:text-3xl font-semibold tracking-[-1px]">
              Empaque Consciente
            </h2>
            <p className="text-[#888] leading-relaxed">
              Nuestros empaques están fabricados con materiales 100% reciclables y 
              biodegradables. Evitamos el plástico de un solo uso y optamos por 
              soluciones de embalaje que protegen tus prendas sin dañar el medio ambiente.
            </p>
          </div>

          {/* Section 4 */}
          <div className="space-y-6">
            <h2 className="font-[family-name:var(--font-heading)] text-2xl md:text-3xl font-semibold tracking-[-1px]">
              Programa de Reciclaje
            </h2>
            <p className="text-[#888] leading-relaxed">
              Próximamente lanzaremos nuestro programa Krea Circular, donde podrás 
              devolver prendas usadas de nuestra marca para reciclaje o reacondicionamiento. 
              Recibirás descuentos en futuras compras por participar.
            </p>
          </div>

          {/* CTA */}
          <div className="pt-8 border-t border-[#2a2a2a]">
            <p className="text-[#888] text-center mb-6">
              ¿Tienes preguntas sobre nuestras prácticas sostenibles?
            </p>
            <div className="text-center">
              <a
                href="/contacto"
                className="inline-block bg-[#ffffff] text-[#0a0a0a] px-8 py-4 text-[0.75rem] uppercase tracking-[2px] font-[family-name:var(--font-heading)] font-semibold transition-all hover:bg-[#d4d4d4]"
              >
                Contáctanos
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
