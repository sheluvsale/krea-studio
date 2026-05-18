export interface Pedido {
  id: number;
  numero_pedido: string;
  total: number;
  estado: string;
  creado_en: string;
}

export interface Direccion {
  id: number;
  etiqueta: string;
  nombre_destinatario: string;
  telefono_destinatario: string;
  pais: string;
  ciudad: string;
  estado: string;
  codigo_postal: string;
  linea_1: string;
  linea_2: string;
  predeterminada: boolean;
}

export interface MetodoPago {
  id: number;
  tipo: string;
  nombre: string;
  numero_tarjeta: string;
  numero_tarjeta_mask: string;
  titular: string;
  fecha_expiracion: string;
  tipo_tarjeta: string;
  email_paypal: string;
  es_default: boolean;
  activo: boolean;
}

export interface VendedorData {
  totalProductos: number;
  totalVentas: number;
  ingresosTotales: number;
  topProductos: {
    nombre: string;
    total_vendido: number;
    ingresos: number;
  }[];
}

export interface Usuario {
  nombre: string;
  apellido: string;
  correo: string;
  telefono: string;
  creado_en: string;
  rol: string;
  avatar_url?: string;
}

export interface DashboardData {
  usuario: Usuario;
  pedidos: Pedido[];
  direcciones: Direccion[];
  metodos_pago: MetodoPago[];
  vendedor?: VendedorData;
}
