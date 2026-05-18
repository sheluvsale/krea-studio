import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Guía de Tallas | Krea Studio",
  description: "Encuentra tu talla perfecta en Krea Studio. Tablas de medidas para camisetas, hoodies y más.",
};

interface SizeRow {
  talla: string;
  pecho: string;
  largo: string;
  hombros: string;
  manga?: string;
}

interface SizeTable {
  title: string;
  description: string;
  headers: string[];
  rows: SizeRow[];
  fitNote: string;
}

const camisetasTable: SizeTable = {
  title: "CAMISETAS",
  description: "Corte moderno y ligeramente ajustado. Las medidas corresponden a la prenda plana.",
  headers: ["Talla", "Pecho (cm)", "Largo (cm)", "Hombros (cm)"],
  rows: [
    { talla: "S", pecho: "48", largo: "68", hombros: "42" },
    { talla: "M", pecho: "50", largo: "70", hombros: "44" },
    { talla: "L", pecho: "52", largo: "72", hombros: "46" },
    { talla: "XL", pecho: "54", largo: "74", hombros: "48" },
  ],
  fitNote: "Si estás entre dos tallas, considera tu preferencia de fit: para ajustado elige la menor, para relajado elige la mayor.",
};

const hoodiesTable: SizeTable = {
  title: "HOODIES & SUDADERAS",
  description: "Corte oversize relaxed. Diseñadas para comodidad y estilo streetwear.",
  headers: ["Talla", "Pecho (cm)", "Largo (cm)", "Hombros (cm)", "Manga (cm)"],
  rows: [
    { talla: "S", pecho: "54", largo: "66", hombros: "48", manga: "62" },
    { talla: "M", pecho: "56", largo: "68", hombros: "50", manga: "64" },
    { talla: "L", pecho: "58", largo: "70", hombros: "52", manga: "66" },
    { talla: "XL", pecho: "60", largo: "72", hombros: "54", manga: "68" },
  ],
  fitNote: "Si prefieres un look fitted en lugar de oversize, considera una talla menos.",
};

const accesoriosTable = {
  title: "GORRAS",
  description: "Tallas ajustables para mayor comodidad.",
  headers: ["Talla", "Circunferencia (cm)", "Ajuste"],
  rows: [
    { talla: "S/M", medida: "54-57", ajuste: "Strap trasero" },
    { talla: "L/XL", medida: "57-60", ajuste: "Strap trasero" },
  ],
};

export default function GuiaTallasPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      {/* Hero */}
      <section className="relative py-20 px-[5%] border-b border-[#2a2a2a]">
        <div className="max-w-[1000px] mx-auto">
          <p className="text-[#888] text-xs uppercase tracking-[3px] mb-4 text-center">
            Encuentra tu Fit Perfecto
          </p>
          <h1 className="font-[family-name:var(--font-heading)] text-4xl md:text-5xl lg:text-6xl font-semibold tracking-[-2px] mb-6 text-center">
            Guía de Tallas
          </h1>
          <p className="text-[#888] text-lg max-w-[600px] mx-auto leading-relaxed text-center">
            Todas las medidas están en centímetros. Te recomendamos medir una prenda 
            similar que ya te quede bien y comparar con nuestra tabla.
          </p>
        </div>
      </section>

      {/* How to Measure */}
      <section className="py-16 px-[5%] border-b border-[#2a2a2a]">
        <div className="max-w-[1000px] mx-auto">
          <h2 className="font-[family-name:var(--font-heading)] text-2xl font-semibold tracking-[-1px] mb-10 text-center">
            Cómo Medir
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "PECHO",
                desc: "Medir de axila a axila con la prenda plana. Multiplica por 2 para circunferencia total.",
              },
              {
                title: "LARGO",
                desc: "Desde el punto más alto del hombro hasta el borde inferior de la prenda.",
              },
              {
                title: "HOMBROS",
                desc: "De costura a costura en la parte superior de la espalda.",
              },
            ].map((item) => (
              <div key={item.title} className="text-center">
                <div className="w-16 h-16 bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-sm">{item.title[0]}</span>
                </div>
                <h3 className="font-[family-name:var(--font-heading)] text-sm uppercase tracking-[2px] mb-3">
                  {item.title}
                </h3>
                <p className="text-[#888] text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Size Tables */}
      <section className="py-16 px-[5%]">
        <div className="max-w-[1000px] mx-auto space-y-20">
          {/* Camisetas */}
          <div>
            <div className="mb-8">
              <h2 className="font-[family-name:var(--font-heading)] text-2xl md:text-3xl font-semibold tracking-[-1px] mb-3">
                {camisetasTable.title}
              </h2>
              <p className="text-[#888]">{camisetasTable.description}</p>
            </div>

            <div className="border border-[#2a2a2a] overflow-hidden mb-6">
              <table className="w-full text-sm">
                <thead className="bg-[#1a1a1a]">
                  <tr>
                    {camisetasTable.headers.map((header) => (
                      <th
                        key={header}
                        className="text-left p-4 text-xs uppercase tracking-[1.5px] text-[#888] font-[family-name:var(--font-heading)]"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {camisetasTable.rows.map((row, i) => (
                    <tr key={row.talla} className="border-t border-[#2a2a2a]">
                      <td className="p-4 font-semibold text-white">{row.talla}</td>
                      <td className="p-4 text-[#888]">{row.pecho}</td>
                      <td className="p-4 text-[#888]">{row.largo}</td>
                      <td className="p-4 text-[#888]">{row.hombros}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-[#141414] border border-[#2a2a2a] p-6">
              <p className="text-[#888] text-sm">
                <span className="text-white font-medium">Nota:</span>{" "}
                {camisetasTable.fitNote}
              </p>
            </div>
          </div>

          {/* Hoodies */}
          <div>
            <div className="mb-8">
              <h2 className="font-[family-name:var(--font-heading)] text-2xl md:text-3xl font-semibold tracking-[-1px] mb-3">
                {hoodiesTable.title}
              </h2>
              <p className="text-[#888]">{hoodiesTable.description}</p>
            </div>

            <div className="border border-[#2a2a2a] overflow-hidden mb-6">
              <table className="w-full text-sm">
                <thead className="bg-[#1a1a1a]">
                  <tr>
                    {hoodiesTable.headers.map((header) => (
                      <th
                        key={header}
                        className="text-left p-4 text-xs uppercase tracking-[1.5px] text-[#888] font-[family-name:var(--font-heading)]"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {hoodiesTable.rows.map((row, i) => (
                    <tr key={row.talla} className="border-t border-[#2a2a2a]">
                      <td className="p-4 font-semibold text-white">{row.talla}</td>
                      <td className="p-4 text-[#888]">{row.pecho}</td>
                      <td className="p-4 text-[#888]">{row.largo}</td>
                      <td className="p-4 text-[#888]">{row.hombros}</td>
                      <td className="p-4 text-[#888]">{row.manga}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-[#141414] border border-[#2a2a2a] p-6">
              <p className="text-[#888] text-sm">
                <span className="text-white font-medium">Nota:</span>{" "}
                {hoodiesTable.fitNote}
              </p>
            </div>
          </div>

          {/* Gorras */}
          <div>
            <div className="mb-8">
              <h2 className="font-[family-name:var(--font-heading)] text-2xl md:text-3xl font-semibold tracking-[-1px] mb-3">
                {accesoriosTable.title}
              </h2>
              <p className="text-[#888]">{accesoriosTable.description}</p>
            </div>

            <div className="border border-[#2a2a2a] overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-[#1a1a1a]">
                  <tr>
                    {accesoriosTable.headers.map((header) => (
                      <th
                        key={header}
                        className="text-left p-4 text-xs uppercase tracking-[1.5px] text-[#888] font-[family-name:var(--font-heading)]"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {accesoriosTable.rows.map((row: { talla: string; medida: string; ajuste: string }, i: number) => (
                    <tr key={row.talla} className="border-t border-[#2a2a2a]">
                      <td className="p-4 font-semibold text-white">{row.talla}</td>
                      <td className="p-4 text-[#888]">{row.medida}</td>
                      <td className="p-4 text-[#888]">{row.ajuste}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Tips Section */}
      <section className="py-16 px-[5%] border-t border-[#2a2a2a]">
        <div className="max-w-[800px] mx-auto">
          <h2 className="font-[family-name:var(--font-heading)] text-2xl font-semibold tracking-[-1px] mb-8 text-center">
            Consejos Importantes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              "Las prendas 100% algodón pueden encoger ligeramente después del primer lavado.",
              "Para un fit oversized: elige tu talla habitual o una más.",
              "Para un fit regular: considera una talla menos si prefieres ajustado.",
              "Si tienes dudas entre dos tallas, te recomendamos la mayor para mayor comodidad.",
            ].map((tip, i) => (
              <div key={i} className="flex items-start gap-4 bg-[#141414] border border-[#2a2a2a] p-5">
                <span className="w-6 h-6 bg-white text-[#0a0a0a] flex items-center justify-center text-xs font-bold shrink-0">
                  {i + 1}
                </span>
                <p className="text-[#888] text-sm leading-relaxed">{tip}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-[5%] border-t border-[#2a2a2a]">
        <div className="max-w-[600px] mx-auto text-center">
          <p className="text-[#888] mb-6">
            ¿Sigues con dudas sobre tu talla? Nuestro equipo está aquí para ayudarte.
          </p>
          <a
            href="/contacto"
            className="inline-block bg-[#ffffff] text-[#0a0a0a] px-8 py-4 text-[0.75rem] uppercase tracking-[2px] font-[family-name:var(--font-heading)] font-semibold transition-all hover:bg-[#d4d4d4]"
          >
            Contactar Soporte
          </a>
        </div>
      </section>
    </main>
  );
}
