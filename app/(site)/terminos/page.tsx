import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Términos y Condiciones | Krea Studio",
  description: "Términos y condiciones de uso de Krea Studio.",
};

export default function TerminosPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      {/* Hero */}
      <section className="relative py-16 px-[5%] border-b border-[#2a2a2a]">
        <div className="max-w-[800px] mx-auto">
          <p className="text-[#888] text-xs uppercase tracking-[3px] mb-4">
            Legal
          </p>
          <h1 className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl lg:text-5xl font-semibold tracking-[-1.5px]">
            Términos y Condiciones
          </h1>
          <p className="text-[#666] text-sm mt-4">
            Última actualización: Mayo 2026
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-[5%]">
        <div className="max-w-[800px] mx-auto space-y-12 text-[#888] leading-relaxed">
          <section className="space-y-4">
            <h2 className="font-[family-name:var(--font-heading)] text-xl font-semibold text-white tracking-[-0.5px]">
              1. Aceptación de los Términos
            </h2>
            <p>
              Al acceder y utilizar el sitio web de Krea Studio, usted acepta estar 
              sujeto a estos términos y condiciones. Si no está de acuerdo con alguna 
              parte de estos términos, no podrá acceder al servicio.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-[family-name:var(--font-heading)] text-xl font-semibold text-white tracking-[-0.5px]">
              2. Descripción del Servicio
            </h2>
            <p>
              Krea Studio es una marca de streetwear que ofrece:
            </p>
            <ul className="space-y-2 ml-4">
              <li className="flex items-start gap-2">
                <span className="text-white">•</span>
                Venta de ropa y accesorios de diseño propio
              </li>
              <li className="flex items-start gap-2">
                <span className="text-white">•</span>
                Herramienta de personalización de prendas (diseñador)
              </li>
              <li className="flex items-start gap-2">
                <span className="text-white">•</span>
                Servicios de envío a domicilio
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="font-[family-name:var(--font-heading)] text-xl font-semibold text-white tracking-[-0.5px]">
              3. Cuentas de Usuario
            </h2>
            <p>
              Para realizar compras y acceder a ciertas funciones, debe crear una cuenta. 
              Usted es responsable de mantener la confidencialidad de su contraseña y 
              de todas las actividades que ocurran bajo su cuenta.
            </p>
            <p>
              Krea Studio se reserva el derecho de suspender o eliminar cuentas que:
            </p>
            <ul className="space-y-2 ml-4">
              <li className="flex items-start gap-2">
                <span className="text-white">•</span>
                Violen estos términos
              </li>
              <li className="flex items-start gap-2">
                <span className="text-white">•</span>
                Presenten actividad fraudulenta
              </li>
              <li className="flex items-start gap-2">
                <span className="text-white">•</span>
                Permanezcan inactivas por más de 24 meses
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="font-[family-name:var(--font-heading)] text-xl font-semibold text-white tracking-[-0.5px]">
              4. Precios y Pagos
            </h2>
            <p>
              Todos los precios están expresados en Pesos Dominicanos (DOP) e incluyen 
              impuestos aplicables. Nos reservamos el derecho de modificar precios 
              sin previo aviso, pero los cambios no afectarán pedidos ya confirmados.
            </p>
            <p>
              Aceptamos los siguientes métodos de pago:
            </p>
            <ul className="space-y-2 ml-4">
              <li className="flex items-start gap-2">
                <span className="text-white">•</span>
                Tarjetas de crédito/débito (Visa, Mastercard, American Express)
              </li>
              <li className="flex items-start gap-2">
                <span className="text-white">•</span>
                Transferencias bancarias
              </li>
              <li className="flex items-start gap-2">
                <span className="text-white">•</span>
                PayPal
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="font-[family-name:var(--font-heading)] text-xl font-semibold text-white tracking-[-0.5px]">
              5. Envíos y Entregas
            </h2>
            <p>
              Realizamos envíos a todo el territorio dominicano. Los tiempos de entrega 
              son estimados y pueden variar según la ubicación:
            </p>
            <ul className="space-y-2 ml-4">
              <li className="flex items-start gap-2">
                <span className="text-white">•</span>
                Santo Domingo: 1-2 días hábiles
              </li>
              <li className="flex items-start gap-2">
                <span className="text-white">•</span>
                Otras provincias: 2-5 días hábiles
              </li>
            </ul>
            <p>
              El envío gratuito aplica en compras superiores a RD$3,000.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-[family-name:var(--font-heading)] text-xl font-semibold text-white tracking-[-0.5px]">
              6. Propiedad Intelectual
            </h2>
            <p>
              Todo el contenido del sitio, incluyendo logotipos, diseños, textos, 
              gráficos e imágenes, es propiedad de Krea Studio y está protegido por 
              leyes de derechos de autor y marcas registradas.
            </p>
            <p>
              Los diseños creados por usuarios en nuestra herramienta de personalización 
              pueden ser utilizados por Krea Studio con fines promocionales, siempre 
              dando crédito al creador.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-[family-name:var(--font-heading)] text-xl font-semibold text-white tracking-[-0.5px]">
              7. Limitación de Responsabilidad
            </h2>
            <p>
              Krea Studio no será responsable por daños indirectos, incidentales, 
              especiales o consecuentes que resulten del uso o la imposibilidad de 
              usar nuestros servicios.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-[family-name:var(--font-heading)] text-xl font-semibold text-white tracking-[-0.5px]">
              8. Modificaciones
            </h2>
            <p>
              Nos reservamos el derecho de modificar estos términos en cualquier momento. 
              Los cambios entrarán en vigor inmediatamente después de su publicación. 
              El uso continuado del sitio después de cualquier modificación constituye 
              su aceptación de los nuevos términos.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-[family-name:var(--font-heading)] text-xl font-semibold text-white tracking-[-0.5px]">
              9. Contacto
            </h2>
            <p>
              Para cualquier pregunta sobre estos términos, contáctenos en:
            </p>
            <p className="text-white">
              Email: kreastudio.business1604@gmail.com<br />
              Teléfono: 809-750-6092<br />
              Ubicación: La Vega, República Dominicana
            </p>
          </section>
        </div>
      </section>
    </main>
  );
}
