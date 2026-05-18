// Provincias, ciudades principales y códigos postales de República Dominicana
// Fuente: INPOSDOM (Instituto Postal Dominicano)

export interface ProvinciaRD {
  nombre: string;
  codigoPostal: string;
  ciudades: string[];
}

export const PROVINCIAS_RD: ProvinciaRD[] = [
  {
    nombre: "Distrito Nacional",
    codigoPostal: "10101",
    ciudades: ["Santo Domingo", "Ciudad Colonial", "Gazcue", "Naco", "Piantini", "Bella Vista", "Evaristo Morales"],
  },
  {
    nombre: "Azua",
    codigoPostal: "71000",
    ciudades: ["Azua de Compostela", "Estebanía", "Guayabal", "Las Charcas", "Las Yayas de Viajama", "Padre Las Casas", "Peralta", "Sabana Yegua", "Tábara Arriba"],
  },
  {
    nombre: "Bahoruco",
    codigoPostal: "82000",
    ciudades: ["Neiba", "Galván", "Los Ríos", "Tamayo", "Villa Jaragua"],
  },
  {
    nombre: "Barahona",
    codigoPostal: "81000",
    ciudades: ["Barahona", "Cabral", "El Peñón", "Enriquillo", "Fundación", "Jaquimeyes", "La Ciénaga", "Las Salinas", "Paraíso", "Polo", "Vicente Noble"],
  },
  {
    nombre: "Dajabón",
    codigoPostal: "63000",
    ciudades: ["Dajabón", "El Pino", "Loma de Cabrera", "Partido", "Restauración"],
  },
  {
    nombre: "Duarte",
    codigoPostal: "31000",
    ciudades: ["San Francisco de Macorís", "Arenoso", "Castillo", "Eugenio María de Hostos", "Las Guáranas", "Pimentel", "Villa Riva"],
  },
  {
    nombre: "Elías Piña",
    codigoPostal: "73000",
    ciudades: ["Comendador", "Bánica", "El Llano", "Hondo Valle", "Juan Santiago", "Pedro Santana"],
  },
  {
    nombre: "El Seibo",
    codigoPostal: "24000",
    ciudades: ["El Seibo", "Miches"],
  },
  {
    nombre: "Espaillat",
    codigoPostal: "51000",
    ciudades: ["Moca", "Cayetano Germosén", "Gaspar Hernández", "Jamao al Norte", "San Víctor"],
  },
  {
    nombre: "Hato Mayor",
    codigoPostal: "25000",
    ciudades: ["Hato Mayor del Rey", "El Valle", "Sabana de la Mar"],
  },
  {
    nombre: "Hermanas Mirabal",
    codigoPostal: "34000",
    ciudades: ["Salcedo", "Tenares", "Villa Tapia"],
  },
  {
    nombre: "Independencia",
    codigoPostal: "83000",
    ciudades: ["Jimaní", "Cristóbal", "Duvergé", "La Descubierta", "Mella", "Postrer Río"],
  },
  {
    nombre: "La Altagracia",
    codigoPostal: "23000",
    ciudades: ["Higüey", "San Rafael del Yuma"],
  },
  {
    nombre: "La Romana",
    codigoPostal: "22000",
    ciudades: ["La Romana", "Guaymate", "Villa Hermosa"],
  },
  {
    nombre: "La Vega",
    codigoPostal: "41000",
    ciudades: ["La Vega", "Constanza", "Jarabacoa", "Jima Abajo"],
  },
  {
    nombre: "María Trinidad Sánchez",
    codigoPostal: "33000",
    ciudades: ["Nagua", "Cabrera", "El Factor", "Río San Juan"],
  },
  {
    nombre: "Monseñor Nouel",
    codigoPostal: "42000",
    ciudades: ["Bonao", "Maimón", "Piedra Blanca"],
  },
  {
    nombre: "Monte Cristi",
    codigoPostal: "62000",
    ciudades: ["San Fernando de Monte Cristi", "Castañuelas", "Guayubín", "Las Matas de Santa Cruz", "Pepillo Salcedo", "Villa Vásquez"],
  },
  {
    nombre: "Monte Plata",
    codigoPostal: "92000",
    ciudades: ["Monte Plata", "Bayaguana", "Peralvillo", "Sabana Grande de Boyá", "Yamasá"],
  },
  {
    nombre: "Pedernales",
    codigoPostal: "84000",
    ciudades: ["Pedernales", "Oviedo"],
  },
  {
    nombre: "Peravia",
    codigoPostal: "91000",
    ciudades: ["Baní", "Nizao", "Matanzas", "Sabana Buey"],
  },
  {
    nombre: "Puerto Plata",
    codigoPostal: "57000",
    ciudades: ["Puerto Plata", "Altamira", "Guananico", "Imbert", "Los Hidalgos", "Luperón", "Sosúa", "Villa Isabela", "Villa Montellano"],
  },
  {
    nombre: "Samaná",
    codigoPostal: "32000",
    ciudades: ["Santa Bárbara de Samaná", "Las Terrenas", "Sánchez"],
  },
  {
    nombre: "Sánchez Ramírez",
    codigoPostal: "43000",
    ciudades: ["Cotuí", "Cevicos", "Fantino", "La Mata"],
  },
  {
    nombre: "San Cristóbal",
    codigoPostal: "91000",
    ciudades: ["San Cristóbal", "Bajos de Haina", "Cambita Garabitos", "Los Cacaos", "Sabana Grande de Palenque", "San Gregorio de Nigua", "Villa Altagracia", "Yaguate"],
  },
  {
    nombre: "San José de Ocoa",
    codigoPostal: "93000",
    ciudades: ["San José de Ocoa", "Rancho Arriba", "Sabana Larga"],
  },
  {
    nombre: "San Juan",
    codigoPostal: "72000",
    ciudades: ["San Juan de la Maguana", "Bohechío", "El Cercado", "Juan de Herrera", "Las Matas de Farfán", "Vallejuelo"],
  },
  {
    nombre: "San Pedro de Macorís",
    codigoPostal: "21000",
    ciudades: ["San Pedro de Macorís", "Consuelo", "Guayacanes", "Quisqueya", "Ramón Santana", "San José de los Llanos"],
  },
  {
    nombre: "Santiago",
    codigoPostal: "51000",
    ciudades: ["Santiago de los Caballeros", "Bisonó", "Jánico", "Licey al Medio", "Puñal", "Sabana Iglesia", "San José de las Matas", "Tamboril", "Villa González"],
  },
  {
    nombre: "Santiago Rodríguez",
    codigoPostal: "64000",
    ciudades: ["San Ignacio de Sabaneta", "Los Almácigos", "Monción"],
  },
  {
    nombre: "Santo Domingo",
    codigoPostal: "10699",
    ciudades: ["Santo Domingo Este", "Santo Domingo Norte", "Santo Domingo Oeste", "Boca Chica", "Los Alcarrizos", "Pedro Brand", "San Antonio de Guerra"],
  },
  {
    nombre: "Valverde",
    codigoPostal: "61000",
    ciudades: ["Mao", "Esperanza", "Laguna Salada", "Guatapanal"],
  },
];

export const NOMBRES_PROVINCIAS = PROVINCIAS_RD.map((p) => p.nombre);

export function getProvinciaPorNombre(nombre: string): ProvinciaRD | undefined {
  return PROVINCIAS_RD.find(
    (p) => p.nombre.toLowerCase() === nombre.toLowerCase()
  );
}

export function getCiudadesPorProvincia(nombreProvincia: string): string[] {
  const p = getProvinciaPorNombre(nombreProvincia);
  return p ? p.ciudades : [];
}

export function getCodigoPostalPorProvincia(nombreProvincia: string): string {
  const p = getProvinciaPorNombre(nombreProvincia);
  return p ? p.codigoPostal : "";
}
