import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidad | Krea Studio",
  description: "Cómo protegemos y manejamos tu información personal.",
};

export default function PrivacidadPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      {/* Hero */}
      <section className="relative py-16 px-[5%] border-b border-[#2a2a2a]">
        <div className="max-w-[800px] mx-auto">
          <p className="text-[#888] text-xs uppercase tracking-[3px] mb-4">
            Legal
          </p>
          <h1 className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl lg:text-5xl font-semibold tracking-[-1.5px]">
            Política de Privacidad
          </h1>
          <p className="text-[#666] text-sm mt-4">
            Última actualización: Mayo 2026
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-[5%]">
        <div className="max-w-[800px] mx-auto space-y-12 text-[#888] leading-relaxed">
          <p className="text-lg">
            En Krea Studio, valoramos y respetamos tu privacidad. Esta política
            describe cómo recopilamos, usamos y protegemos tu información
            personal.
          </p>

          <section className="space-y-4">
            <h2 className="font-[family-name:var(--font-heading)] text-xl font-semibold text-white tracking-[-0.5px]">
              1. Información que Recopilamos
            </h2>
            <p>Podemos recopilar los siguientes tipos de información:</p>
            <ul className="space-y-2 ml-4">
              <li className="flex items-start gap-2">
                <span className="text-white">•</span>
                <strong className="text-white">
                  Información de contacto:
                </strong>{" "}
                nombre, correo electrónico, número de teléfono
              </li>
              <li className="flex items-start gap-2">
                <span className="text-white">•</span>
                <strong className="text-white">
                  Información de envío:
                </strong>{" "}
                dirección de entrega, instrucciones especiales
              </li>
              <li className="flex items-start gap-2">
                <span className="text-white">•</span>
                <strong className="text-white">
                  Información de pago:
                </strong>{" "}
                datos de tarjetas (procesados de forma segura por nuestros
                proveedores de pago)
              </li>
              <li className="flex items-start gap-2">
                <span className="text-white">•</span>
                <strong className="text-white">Información de uso:</strong>{" "}
                historial de compras, preferencias de productos, interacciones
                con el sitio
              </li>
              <li className="flex items-start gap-2">
                <span className="text-white">•</span>
                <strong className="text-white">Diseños:</strong> creaciones
                realizadas en nuestra herramienta de personalización
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="font-[family-name:var(--font-heading)] text-xl font-semibold text-white tracking-[-0.5px]">
              2. Cómo Usamos tu Información
            </h2>
            <p>Utilizamos tu información para:</p>
            <ul className="space-y-2 ml-4">
              <li className="flex items-start gap-2">
                <span className="text-white">•</span>
                Procesar y enviar tus pedidos
              </li>
              <li className="flex items-start gap-2">
                <span className="text-white">•</span>
                Comunicarnos sobre tu cuenta y pedidos
              </li>
              <li className="flex items-start gap-2">
                <span className="text-white">•</span>
                Mejorar nuestros productos y servicios
              </li>
              <li className="flex items-start gap-2">
                <span className="text-white">•</span>
                Enviar comunicaciones de marketing (solo con tu consentimiento)
              </li>
              <li className="flex items-start gap-2">
                <span className="text-white">•</span>
                Prevenir fraudes y proteger la seguridad
              </li>
              <li className="flex items-start gap-2">
                <span className="text-white">•</span>
                Cumplir con obligaciones legales
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="font-[family-name:var(--font-heading)] text-xl font-semibold text-white tracking-[-0.5px]">
              3. Protección de Datos
            </h2>
            <p>
              Implementamos medidas de seguridad técnicas y organizativas para
              proteger tu información:
            </p>
            <ul className="space-y-2 ml-4">
              <li className="flex items-start gap-2">
                <span className="text-white">•</span>
                Encriptación SSL/TLS en todas las transmisiones de datos
              </li>
              <li className="flex items-start gap-2">
                <span className="text-white">•</span>
                Almacenamiento seguro en servidores protegidos
              </li>
              <li className="flex items-start gap-2">
                <span className="text-white">•</span>
                Acceso restringido a personal autorizado
              </li>
              <li className="flex items-start gap-2">
                <span className="text-white">•</span>
                Auditorías regulares de seguridad
              </li>
            </ul>
            <p>
              Sin embargo, ningún sistema es completamente seguro. No podemos
              garantizar la seguridad absoluta de tu información.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-[family-name:var(--font-heading)] text-xl font-semibold text-white tracking-[-0.5px]">
              4. Compartir Información
            </h2>
            <p>
              No vendemos ni alquilamos tu información personal. Solo
              compartimos datos con:
            </p>
            <ul className="space-y-2 ml-4">
              <li className="flex items-start gap-2">
                <span className="text-white">•</span>
                <strong className="text-white">
                  Proveedores de servicios:
                </strong>{" "}
                empresas de envío, procesadores de pago, servicios de hosting
              </li>
              <li className="flex items-start gap-2">
                <span className="text-white">•</span>
                <strong className="text-white">Autoridades:</strong> cuando sea
                requerido por ley o para proteger nuestros derechos
              </li>
            </ul>
            <p>
              Todos nuestros proveedores están obligados a mantener la
              confidencialidad y seguridad de tu información.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-[family-name:var(--font-heading)] text-xl font-semibold text-white tracking-[-0.5px]">
              5. Cookies y Tecnologías Similares
            </h2>
            <p>Utilizamos cookies para:</p>
            <ul className="space-y-2 ml-4">
              <li className="flex items-start gap-2">
                <span className="text-white">•</span>
                Mantener tu sesión iniciada
              </li>
              <li className="flex items-start gap-2">
                <span className="text-white">•</span>
                Recordar tus preferencias
              </li>
              <li className="flex items-start gap-2">
                <span className="text-white">•</span>
                Analizar el uso del sitio para mejoras
              </li>
            </ul>
            <p>
              Puedes configurar tu navegador para rechazar cookies, pero esto
              puede afectar la funcionalidad del sitio.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-[family-name:var(--font-heading)] text-xl font-semibold text-white tracking-[-0.5px]">
              6. Tus Derechos
            </h2>
            <p>Tienes derecho a:</p>
            <ul className="space-y-2 ml-4">
              <li className="flex items-start gap-2">
                <span className="text-white">•</span>
                Acceder a tu información personal
              </li>
              <li className="flex items-start gap-2">
                <span className="text-white">•</span>
                Corregir información inexacta
              </li>
              <li className="flex items-start gap-2">
                <span className="text-white">•</span>
                Solicitar la eliminación de tus datos
              </li>
              <li className="flex items-start gap-2">
                <span className="text-white">•</span>
                Oponerte al procesamiento de tus datos
              </li>
              <li className="flex items-start gap-2">
                <span className="text-white">•</span>
                Retirar tu consentimiento en cualquier momento
              </li>
            </ul>
            <p>
              Para ejercer estos derechos, contáctanos a través de los medios
              proporcionados al final de esta política.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-[family-name:var(--font-heading)] text-xl font-semibold text-white tracking-[-0.5px]">
              7. Retención de Datos
            </h2>
            <p>
              Conservamos tu información personal durante el tiempo necesario
              para cumplir con los propósitos descritos en esta política:
            </p>
            <ul className="space-y-2 ml-4">
              <li className="flex items-start gap-2">
                <span className="text-white">•</span>
                Datos de cuenta: mientras mantengas tu cuenta activa
              </li>
              <li className="flex items-start gap-2">
                <span className="text-white">•</span>
                Datos de pedidos: 5 años (requerido por ley fiscal)
              </li>
              <li className="flex items-start gap-2">
                <span className="text-white">•</span>
                Comunicaciones: 2 años
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="font-[family-name:var(--font-heading)] text-xl font-semibold text-white tracking-[-0.5px]">
              8. Menores de Edad
            </h2>
            <p>
              Nuestros servicios no están dirigidos a menores de 16 años. No
              recopilamos intencionalmente información de menores. Si
              descubrimos que hemos recopilado datos de un menor, los
              eliminaremos de inmediato.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-[family-name:var(--font-heading)] text-xl font-semibold text-white tracking-[-0.5px]">
              9. Cambios a esta Política
            </h2>
            <p>
              Podemos actualizar esta política periódicamente. Te notificaremos
              sobre cambios significativos mediante un aviso en el sitio o por
              correo electrónico. El uso continuado de nuestros servicios
              después de los cambios constituye tu aceptación de la política
              revisada.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-[family-name:var(--font-heading)] text-xl font-semibold text-white tracking-[-0.5px]">
              10. Contacto
            </h2>
            <p>
              Para cualquier pregunta o solicitud relacionada con esta política
              de privacidad, contáctanos:
            </p>
            <p className="text-white">
              Email: kreastudio.business1604@gmail.com
              <br />
              Teléfono: 809-750-6092
              <br />
              Dirección: La Vega, República Dominicana
            </p>
          </section>
        </div>
      </section>
    </main>
  );
}
