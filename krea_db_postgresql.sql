-- PostgreSQL dump converted from MariaDB/MySQL
-- Database: krea_db
-- Converted on: 2026-05-11

-- ============================================
-- 1. CUSTOM ENUM TYPES
-- ============================================
CREATE TYPE banner_posicion AS ENUM ('home_principal', 'home_secundario', 'productos', 'checkout', 'categoria');
CREATE TYPE campana_segmento AS ENUM ('todos', 'clientes', 'nuevos', 'inactivos');
CREATE TYPE campana_estado AS ENUM ('borrador', 'programado', 'enviando', 'enviado', 'cancelado');
CREATE TYPE config_tipo AS ENUM ('string', 'number', 'boolean', 'json', 'textarea');
CREATE TYPE cupon_tipo_descuento AS ENUM ('porcentaje', 'fijo', 'envio_gratis');
CREATE TYPE cupon_aplicable_a AS ENUM ('todos', 'categorias', 'productos');
CREATE TYPE factura_estado AS ENUM ('pendiente', 'pagada', 'vencida', 'cancelada', 'parcial');
CREATE TYPE metodo_pago_tipo AS ENUM ('tarjeta', 'transferencia', 'efectivo', 'mercadopago', 'stripe');
CREATE TYPE usuario_metodo_pago_tipo AS ENUM ('tarjeta', 'paypal');
CREATE TYPE movimiento_tipo AS ENUM ('entrada', 'salida', 'ajuste', 'transferencia', 'devolucion');
CREATE TYPE proveedor_condiciones AS ENUM ('contado', '15_dias', '30_dias', '60_dias', '90_dias');
CREATE TYPE transaccion_tipo AS ENUM ('ingreso', 'egreso');
CREATE TYPE transaccion_categoria AS ENUM ('ventas', 'compras_inventario', 'gastos_operativos', 'marketing', 'salarios', 'servicios', 'impuestos', 'otros');
CREATE TYPE transaccion_metodo_pago AS ENUM ('efectivo', 'transferencia', 'tarjeta', 'deposito', 'cheque', 'mercadopago', 'otro');
CREATE TYPE transaccion_estado AS ENUM ('confirmado', 'pendiente', 'cancelado');
CREATE TYPE comision_estado AS ENUM ('pendiente', 'pagada', 'cancelada');
CREATE TYPE producto_estado AS ENUM ('borrador', 'publicado', 'pausado', 'agotado');

-- ============================================
-- 2. TABLES
-- ============================================

CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    correo VARCHAR(255) NOT NULL UNIQUE,
    contrasena_hash TEXT NOT NULL,
    rol VARCHAR(50) NOT NULL DEFAULT 'cliente',
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    telefono VARCHAR(20) DEFAULT NULL,
    url_avatar TEXT DEFAULT NULL,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categorias (
    id SERIAL PRIMARY KEY,
    padre_id INTEGER DEFAULT NULL,
    nombre VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    url_imagen TEXT DEFAULT NULL,
    orden INTEGER NOT NULL DEFAULT 0,
    activa BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE marcas (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL UNIQUE,
    slug VARCHAR(255) NOT NULL UNIQUE,
    url_logo TEXT DEFAULT NULL
);

CREATE TABLE perfiles_vendedor (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL UNIQUE,
    descripcion TEXT DEFAULT NULL,
    url_logo TEXT DEFAULT NULL,
    url_banner TEXT DEFAULT NULL,
    instagram VARCHAR(100) DEFAULT NULL,
    tiktok VARCHAR(100) DEFAULT NULL,
    verificado BOOLEAN NOT NULL DEFAULT FALSE,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    tasa_comision DECIMAL(5,2) NOT NULL DEFAULT 10.00,
    creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE productos (
    id SERIAL PRIMARY KEY,
    vendedor_id INTEGER NOT NULL,
    categoria_id INTEGER DEFAULT NULL,
    marca_id INTEGER DEFAULT NULL,
    nombre VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    descripcion TEXT DEFAULT NULL,
    material VARCHAR(255) DEFAULT NULL,
    costo DECIMAL(10,2) DEFAULT 0.00,
    precio_base DECIMAL(10,2) NOT NULL CHECK (precio_base >= 0),
    precio_comparacion DECIMAL(10,2) DEFAULT NULL,
    estado producto_estado NOT NULL DEFAULT 'borrador',
    destacado BOOLEAN NOT NULL DEFAULT FALSE,
    nuevo BOOLEAN NOT NULL DEFAULT TRUE,
    creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    publicado_en TIMESTAMP DEFAULT NULL,
    UNIQUE (vendedor_id, slug)
);

CREATE TABLE variantes_producto (
    id SERIAL PRIMARY KEY,
    producto_id INTEGER NOT NULL,
    sku VARCHAR(100) NOT NULL UNIQUE,
    precio_adicional DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    stock_minimo INTEGER NOT NULL DEFAULT 5,
    activa BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE atributos_variante (
    id SERIAL PRIMARY KEY,
    variante_id INTEGER NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    valor VARCHAR(100) NOT NULL
);

CREATE TABLE imagenes_producto (
    id SERIAL PRIMARY KEY,
    producto_id INTEGER NOT NULL,
    url_imagen TEXT NOT NULL,
    orden INTEGER NOT NULL DEFAULT 0,
    es_principal BOOLEAN NOT NULL DEFAULT FALSE,
    creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE proveedores (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    contacto_nombre VARCHAR(255) DEFAULT NULL,
    telefono VARCHAR(20) DEFAULT NULL,
    email VARCHAR(255) DEFAULT NULL,
    direccion TEXT DEFAULT NULL,
    condiciones_pago proveedor_condiciones NOT NULL DEFAULT '30_dias',
    descuento_porcentaje DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    notas TEXT DEFAULT NULL,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE direcciones (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL,
    etiqueta VARCHAR(100) DEFAULT NULL,
    nombre_destinatario VARCHAR(255) NOT NULL,
    telefono_destinatario VARCHAR(20) DEFAULT NULL,
    pais VARCHAR(100) NOT NULL,
    ciudad VARCHAR(100) NOT NULL,
    estado VARCHAR(100) NOT NULL,
    codigo_postal VARCHAR(20) NOT NULL,
    linea_1 TEXT NOT NULL,
    linea_2 TEXT DEFAULT NULL,
    predeterminada BOOLEAN NOT NULL DEFAULT FALSE,
    creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE pedidos (
    id SERIAL PRIMARY KEY,
    numero_pedido VARCHAR(100) NOT NULL UNIQUE,
    cliente_id INTEGER NOT NULL,
    direccion_envio_id INTEGER DEFAULT NULL,
    estado VARCHAR(50) NOT NULL DEFAULT 'pendiente',
    subtotal DECIMAL(12,2) NOT NULL,
    total DECIMAL(12,2) NOT NULL,
    creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE items_pedido (
    id SERIAL PRIMARY KEY,
    pedido_id INTEGER NOT NULL,
    variante_id INTEGER NOT NULL,
    vendedor_id INTEGER NOT NULL,
    nombre_producto VARCHAR(255) NOT NULL,
    cantidad INTEGER NOT NULL CHECK (cantidad > 0),
    precio_unitario DECIMAL(10,2) NOT NULL,
    precio_total DECIMAL(10,2) NOT NULL
);

CREATE TABLE facturas (
    id SERIAL PRIMARY KEY,
    numero VARCHAR(100) NOT NULL UNIQUE,
    pedido_id INTEGER DEFAULT NULL,
    cliente_id INTEGER NOT NULL,
    subtotal DECIMAL(12,2) NOT NULL,
    impuestos DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    total DECIMAL(12,2) NOT NULL,
    fecha_emision DATE NOT NULL,
    fecha_vencimiento DATE NOT NULL,
    estado factura_estado NOT NULL DEFAULT 'pendiente',
    metodo_pago VARCHAR(50) DEFAULT NULL,
    fecha_pago DATE DEFAULT NULL,
    notas TEXT DEFAULT NULL,
    pdf_url TEXT DEFAULT NULL,
    creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "reseñas" (
    id SERIAL PRIMARY KEY,
    producto_id INTEGER NOT NULL,
    usuario_id INTEGER NOT NULL,
    calificacion INTEGER NOT NULL CHECK (calificacion BETWEEN 1 AND 5),
    comentario TEXT NOT NULL,
    aprobada BOOLEAN NOT NULL DEFAULT FALSE,
    creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE carrito (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL,
    producto_id INTEGER NOT NULL,
    nombre_producto VARCHAR(255) NOT NULL,
    cantidad INTEGER NOT NULL DEFAULT 1,
    precio_unitario DECIMAL(10,2) NOT NULL,
    talla VARCHAR(10) DEFAULT NULL,
    creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notificaciones (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    titulo VARCHAR(255) NOT NULL,
    mensaje TEXT NOT NULL,
    leida BOOLEAN NOT NULL DEFAULT FALSE,
    creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE password_resets (
    id SERIAL PRIMARY KEY,
    correo VARCHAR(255) NOT NULL,
    codigo VARCHAR(6) NOT NULL,
    expira_en TIMESTAMP NOT NULL,
    usado BOOLEAN DEFAULT FALSE,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE banners (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    imagen_url TEXT NOT NULL,
    posicion banner_posicion NOT NULL DEFAULT 'home_principal',
    link_url TEXT DEFAULT NULL,
    orden INTEGER NOT NULL DEFAULT 0,
    fecha_inicio DATE DEFAULT NULL,
    fecha_fin DATE DEFAULT NULL,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    clicks INTEGER NOT NULL DEFAULT 0,
    impresiones INTEGER NOT NULL DEFAULT 0,
    creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE campanas_email (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    asunto VARCHAR(255) NOT NULL,
    segmento campana_segmento NOT NULL DEFAULT 'todos',
    contenido_html TEXT DEFAULT NULL,
    estado campana_estado NOT NULL DEFAULT 'borrador',
    fecha_envio TIMESTAMP DEFAULT NULL,
    enviados INTEGER NOT NULL DEFAULT 0,
    aperturas INTEGER NOT NULL DEFAULT 0,
    clicks INTEGER NOT NULL DEFAULT 0,
    conversiones INTEGER NOT NULL DEFAULT 0,
    creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT NULL
);

CREATE TABLE configuracion_sistema (
    id SERIAL PRIMARY KEY,
    grupo VARCHAR(50) NOT NULL DEFAULT 'general',
    clave VARCHAR(100) NOT NULL,
    valor TEXT DEFAULT NULL,
    tipo config_tipo NOT NULL DEFAULT 'string',
    descripcion VARCHAR(255) DEFAULT NULL,
    editable BOOLEAN NOT NULL DEFAULT TRUE,
    creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT NULL,
    UNIQUE (grupo, clave)
);

CREATE TABLE cupones (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(50) NOT NULL UNIQUE,
    tipo_descuento cupon_tipo_descuento NOT NULL DEFAULT 'porcentaje',
    valor DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    minimo_compra DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    limite_usos INTEGER DEFAULT NULL,
    usos_actuales INTEGER NOT NULL DEFAULT 0,
    fecha_inicio DATE DEFAULT NULL,
    fecha_fin DATE DEFAULT NULL,
    aplicable_a cupon_aplicable_a NOT NULL DEFAULT 'todos',
    categorias_ids JSON DEFAULT NULL,
    productos_ids JSON DEFAULT NULL,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE metodos_pago_config (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(50) NOT NULL UNIQUE,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT DEFAULT NULL,
    configuracion JSON DEFAULT NULL,
    comision_porcentaje DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    es_default BOOLEAN NOT NULL DEFAULT FALSE,
    orden INTEGER NOT NULL DEFAULT 0,
    imagen_url TEXT DEFAULT NULL,
    creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE metodos_pago_usuario (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL,
    tipo usuario_metodo_pago_tipo NOT NULL DEFAULT 'tarjeta',
    nombre VARCHAR(100) NOT NULL,
    numero_tarjeta VARCHAR(20) DEFAULT NULL,
    numero_tarjeta_mask VARCHAR(20) DEFAULT NULL,
    titular VARCHAR(255) DEFAULT NULL,
    fecha_expiracion VARCHAR(10) DEFAULT NULL,
    tipo_tarjeta VARCHAR(20) DEFAULT NULL,
    email_paypal VARCHAR(255) DEFAULT NULL,
    es_default BOOLEAN NOT NULL DEFAULT FALSE,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    token_pago VARCHAR(255) DEFAULT NULL,
    creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT NULL
);

CREATE TABLE preferencias_usuario (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL UNIQUE,
    notificaciones_email BOOLEAN NOT NULL DEFAULT TRUE,
    notificaciones_push BOOLEAN NOT NULL DEFAULT FALSE,
    newsletter BOOLEAN NOT NULL DEFAULT FALSE,
    idioma VARCHAR(10) NOT NULL DEFAULT 'es',
    moneda VARCHAR(10) NOT NULL DEFAULT 'DOP',
    tema VARCHAR(20) NOT NULL DEFAULT 'dark',
    creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT NULL
);

CREATE TABLE movimientos_inventario (
    id SERIAL PRIMARY KEY,
    producto_id INTEGER NOT NULL,
    variante_id INTEGER DEFAULT NULL,
    tipo movimiento_tipo NOT NULL,
    cantidad INTEGER NOT NULL,
    stock_anterior INTEGER NOT NULL,
    stock_nuevo INTEGER NOT NULL,
    motivo VARCHAR(255) DEFAULT NULL,
    referencia VARCHAR(255) DEFAULT NULL,
    proveedor_id INTEGER DEFAULT NULL,
    usuario_id INTEGER NOT NULL,
    notas TEXT DEFAULT NULL,
    creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE transacciones_financieras (
    id SERIAL PRIMARY KEY,
    tipo transaccion_tipo NOT NULL,
    categoria transaccion_categoria NOT NULL,
    concepto VARCHAR(255) NOT NULL,
    monto DECIMAL(12,2) NOT NULL,
    fecha DATE NOT NULL,
    metodo_pago transaccion_metodo_pago NOT NULL,
    referencia VARCHAR(255) DEFAULT NULL,
    pedido_id INTEGER DEFAULT NULL,
    proveedor_id INTEGER DEFAULT NULL,
    notas TEXT DEFAULT NULL,
    comprobante_url TEXT DEFAULT NULL,
    estado transaccion_estado NOT NULL DEFAULT 'confirmado',
    creado_por INTEGER NOT NULL,
    creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE vendedores_comisiones (
    id SERIAL PRIMARY KEY,
    vendedor_id INTEGER NOT NULL,
    pedido_id INTEGER NOT NULL,
    monto_venta DECIMAL(12,2) NOT NULL,
    porcentaje_comision DECIMAL(5,2) NOT NULL,
    monto_comision DECIMAL(12,2) NOT NULL,
    estado comision_estado NOT NULL DEFAULT 'pendiente',
    fecha_pago DATE DEFAULT NULL,
    notas TEXT DEFAULT NULL,
    creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "diseños_usuario" (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    tipo_prenda VARCHAR(50) DEFAULT NULL,
    imagen_url TEXT DEFAULT NULL,
    datos_json JSON DEFAULT NULL,
    estado VARCHAR(50) DEFAULT 'borrador',
    precio DECIMAL(10,2) DEFAULT 0.00,
    creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT NULL
);

-- ============================================
-- 3. INDEXES
-- ============================================
CREATE INDEX idx_atributos_variante_variante_id ON atributos_variante(variante_id);
CREATE INDEX idx_banners_posicion ON banners(posicion);
CREATE INDEX idx_banners_activo ON banners(activo);
CREATE INDEX idx_banners_orden ON banners(orden);
CREATE INDEX idx_campanas_estado ON campanas_email(estado);
CREATE INDEX idx_campanas_fecha_envio ON campanas_email(fecha_envio);
CREATE INDEX idx_carrito_usuario_id ON carrito(usuario_id);
CREATE INDEX idx_carrito_producto_id ON carrito(producto_id);
CREATE INDEX idx_categorias_padre_id ON categorias(padre_id);
CREATE INDEX idx_config_grupo ON configuracion_sistema(grupo);
CREATE INDEX idx_cupones_activo ON cupones(activo);
CREATE INDEX idx_cupones_fecha_fin ON cupones(fecha_fin);
CREATE INDEX idx_direcciones_usuario_id ON direcciones(usuario_id);
CREATE INDEX idx_facturas_estado ON facturas(estado);
CREATE INDEX idx_facturas_fecha_vencimiento ON facturas(fecha_vencimiento);
CREATE INDEX idx_facturas_cliente_id ON facturas(cliente_id);
CREATE INDEX idx_facturas_pedido_id ON facturas(pedido_id);
CREATE INDEX idx_imagenes_producto_id ON imagenes_producto(producto_id);
CREATE INDEX idx_items_pedido_id ON items_pedido(pedido_id);
CREATE INDEX idx_items_variante_id ON items_pedido(variante_id);
CREATE INDEX idx_items_vendedor_id ON items_pedido(vendedor_id);
CREATE INDEX idx_metodos_pago_usuario_id ON metodos_pago_usuario(usuario_id);
CREATE INDEX idx_metodos_pago_tipo ON metodos_pago_usuario(tipo);
CREATE INDEX idx_preferencias_usuario_id ON preferencias_usuario(usuario_id);
CREATE INDEX idx_movimientos_producto_id ON movimientos_inventario(producto_id);
CREATE INDEX idx_movimientos_variante_id ON movimientos_inventario(variante_id);
CREATE INDEX idx_movimientos_tipo ON movimientos_inventario(tipo);
CREATE INDEX idx_movimientos_creado_en ON movimientos_inventario(creado_en);
CREATE INDEX idx_movimientos_proveedor_id ON movimientos_inventario(proveedor_id);
CREATE INDEX idx_movimientos_usuario_id ON movimientos_inventario(usuario_id);
CREATE INDEX idx_notificaciones_usuario_id ON notificaciones(usuario_id);
CREATE INDEX idx_password_resets_correo ON password_resets(correo);
CREATE INDEX idx_password_resets_codigo ON password_resets(codigo);
CREATE INDEX idx_password_resets_expira ON password_resets(expira_en);
CREATE INDEX idx_pedidos_cliente_id ON pedidos(cliente_id);
CREATE INDEX idx_pedidos_direccion_id ON pedidos(direccion_envio_id);
CREATE INDEX idx_productos_categoria_id ON productos(categoria_id);
CREATE INDEX idx_productos_marca_id ON productos(marca_id);
CREATE INDEX idx_proveedores_activo ON proveedores(activo);
CREATE INDEX idx_reseñas_producto_id ON "reseñas"(producto_id);
CREATE INDEX idx_reseñas_usuario_id ON "reseñas"(usuario_id);
CREATE INDEX idx_transacciones_tipo ON transacciones_financieras(tipo);
CREATE INDEX idx_transacciones_categoria ON transacciones_financieras(categoria);
CREATE INDEX idx_transacciones_fecha ON transacciones_financieras(fecha);
CREATE INDEX idx_transacciones_pedido_id ON transacciones_financieras(pedido_id);
CREATE INDEX idx_transacciones_proveedor_id ON transacciones_financieras(proveedor_id);
CREATE INDEX idx_transacciones_creado_por ON transacciones_financieras(creado_por);
CREATE INDEX idx_variantes_producto_id ON variantes_producto(producto_id);
CREATE INDEX idx_vendedores_comisiones_vendedor_id ON vendedores_comisiones(vendedor_id);
CREATE INDEX idx_vendedores_comisiones_pedido_id ON vendedores_comisiones(pedido_id);
CREATE INDEX idx_vendedores_comisiones_estado ON vendedores_comisiones(estado);
CREATE INDEX idx_diseños_usuario_usuario_id ON "diseños_usuario"(usuario_id);
CREATE INDEX idx_diseños_usuario_estado ON "diseños_usuario"(estado);
CREATE INDEX idx_diseños_usuario_creado_en ON "diseños_usuario"(creado_en);

-- ============================================
-- 4. FOREIGN KEYS
-- ============================================
ALTER TABLE atributos_variante ADD CONSTRAINT atributos_variante_fk FOREIGN KEY (variante_id) REFERENCES variantes_producto(id) ON DELETE CASCADE;
ALTER TABLE categorias ADD CONSTRAINT categorias_padre_fk FOREIGN KEY (padre_id) REFERENCES categorias(id) ON DELETE SET NULL;
ALTER TABLE direcciones ADD CONSTRAINT direcciones_usuario_fk FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE;
ALTER TABLE facturas ADD CONSTRAINT facturas_cliente_fk FOREIGN KEY (cliente_id) REFERENCES usuarios(id);
ALTER TABLE facturas ADD CONSTRAINT facturas_pedido_fk FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE SET NULL;
ALTER TABLE imagenes_producto ADD CONSTRAINT imagenes_producto_fk FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE;
ALTER TABLE items_pedido ADD CONSTRAINT items_pedido_pedido_fk FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE;
ALTER TABLE items_pedido ADD CONSTRAINT items_pedido_variante_fk FOREIGN KEY (variante_id) REFERENCES variantes_producto(id);
ALTER TABLE items_pedido ADD CONSTRAINT items_pedido_vendedor_fk FOREIGN KEY (vendedor_id) REFERENCES perfiles_vendedor(id);
ALTER TABLE metodos_pago_usuario ADD CONSTRAINT metodos_pago_usuario_fk FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE preferencias_usuario ADD CONSTRAINT preferencias_usuario_fk FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE;
ALTER TABLE movimientos_inventario ADD CONSTRAINT movimientos_inv_prod_fk FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE;
ALTER TABLE movimientos_inventario ADD CONSTRAINT movimientos_inv_prov_fk FOREIGN KEY (proveedor_id) REFERENCES proveedores(id) ON DELETE SET NULL;
ALTER TABLE movimientos_inventario ADD CONSTRAINT movimientos_inv_user_fk FOREIGN KEY (usuario_id) REFERENCES usuarios(id);
ALTER TABLE movimientos_inventario ADD CONSTRAINT movimientos_inv_var_fk FOREIGN KEY (variante_id) REFERENCES variantes_producto(id) ON DELETE SET NULL;
ALTER TABLE notificaciones ADD CONSTRAINT notificaciones_usuario_fk FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE;
ALTER TABLE pedidos ADD CONSTRAINT pedidos_cliente_fk FOREIGN KEY (cliente_id) REFERENCES usuarios(id);
ALTER TABLE pedidos ADD CONSTRAINT pedidos_direccion_fk FOREIGN KEY (direccion_envio_id) REFERENCES direcciones(id);
ALTER TABLE perfiles_vendedor ADD CONSTRAINT perfiles_vendedor_usuario_fk FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE;
ALTER TABLE productos ADD CONSTRAINT productos_vendedor_fk FOREIGN KEY (vendedor_id) REFERENCES perfiles_vendedor(id) ON DELETE CASCADE;
ALTER TABLE productos ADD CONSTRAINT productos_categoria_fk FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE SET NULL;
ALTER TABLE productos ADD CONSTRAINT productos_marca_fk FOREIGN KEY (marca_id) REFERENCES marcas(id) ON DELETE SET NULL;
ALTER TABLE transacciones_financieras ADD CONSTRAINT transacciones_pedido_fk FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE SET NULL;
ALTER TABLE transacciones_financieras ADD CONSTRAINT transacciones_prov_fk FOREIGN KEY (proveedor_id) REFERENCES proveedores(id) ON DELETE SET NULL;
ALTER TABLE transacciones_financieras ADD CONSTRAINT transacciones_user_fk FOREIGN KEY (creado_por) REFERENCES usuarios(id);
ALTER TABLE variantes_producto ADD CONSTRAINT variantes_producto_fk FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE;
ALTER TABLE vendedores_comisiones ADD CONSTRAINT comisiones_pedido_fk FOREIGN KEY (pedido_id) REFERENCES pedidos(id);
ALTER TABLE vendedores_comisiones ADD CONSTRAINT comisiones_vendedor_fk FOREIGN KEY (vendedor_id) REFERENCES perfiles_vendedor(id) ON DELETE CASCADE;
ALTER TABLE "diseños_usuario" ADD CONSTRAINT diseños_usuario_fk FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE;

-- ============================================
-- 5. TRIGGERS for ON UPDATE CURRENT_TIMESTAMP
-- ============================================
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.actualizado_en = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_campanas_email_updated
BEFORE UPDATE ON campanas_email
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER trg_configuracion_sistema_updated
BEFORE UPDATE ON configuracion_sistema
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER trg_metodos_pago_usuario_updated
BEFORE UPDATE ON metodos_pago_usuario
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER trg_preferencias_usuario_updated
BEFORE UPDATE ON preferencias_usuario
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER trg_diseños_usuario_updated
BEFORE UPDATE ON "diseños_usuario"
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- ============================================
-- 6. COLUMN COMMENTS
-- ============================================
COMMENT ON COLUMN atributos_variante.tipo IS 'talla, color, etc.';
COMMENT ON COLUMN atributos_variante.valor IS 'M, L, Negro, Blanco, etc.';
COMMENT ON COLUMN cupones.limite_usos IS 'NULL = ilimitado';
COMMENT ON COLUMN cupones.categorias_ids IS 'IDs de categorías si aplicable_a=categorias';
COMMENT ON COLUMN cupones.productos_ids IS 'IDs de productos si aplicable_a=productos';
COMMENT ON COLUMN metodos_pago_config.codigo IS 'mercadopago, stripe, transferencia, etc.';
COMMENT ON COLUMN metodos_pago_config.configuracion IS 'API keys, credenciales encriptadas, etc.';
COMMENT ON COLUMN metodos_pago_usuario.nombre IS 'Nombre del método (ej: Mi Tarjeta Visa)';
COMMENT ON COLUMN metodos_pago_usuario.numero_tarjeta IS 'Últimos 4 dígitos para tarjetas';
COMMENT ON COLUMN metodos_pago_usuario.titular IS 'Nombre del titular';
COMMENT ON COLUMN metodos_pago_usuario.fecha_expiracion IS 'MM/YY';
COMMENT ON COLUMN metodos_pago_usuario.es_default IS '1 = método de pago predeterminado';
COMMENT ON COLUMN metodos_pago_usuario.numero_tarjeta IS 'Últimos 4 dígitos para tarjetas';
COMMENT ON COLUMN metodos_pago_usuario.numero_tarjeta_mask IS 'Máscara completa ****1234';
COMMENT ON COLUMN metodos_pago_usuario.tipo_tarjeta IS 'visa, mastercard, amex';
COMMENT ON COLUMN metodos_pago_usuario.email_paypal IS 'Email de cuenta PayPal asociada';
COMMENT ON COLUMN metodos_pago_usuario.token_pago IS 'Token seguro del proveedor de pagos';
COMMENT ON COLUMN preferencias_usuario.idioma IS 'es, en, etc.';
COMMENT ON COLUMN preferencias_usuario.moneda IS 'DOP, USD, MXN, etc.';
COMMENT ON COLUMN preferencias_usuario.tema IS 'dark, light, system';
COMMENT ON COLUMN movimientos_inventario.referencia IS 'N° orden, factura, etc.';
COMMENT ON COLUMN movimientos_inventario.proveedor_id IS 'Si es entrada de proveedor';
COMMENT ON COLUMN movimientos_inventario.usuario_id IS 'Quien realizó el movimiento';
COMMENT ON COLUMN productos.estado IS 'Valores: borrador, publicado, pausado, agotado';
COMMENT ON COLUMN transacciones_financieras.pedido_id IS 'Si está relacionado a un pedido';
COMMENT ON COLUMN transacciones_financieras.proveedor_id IS 'Si es pago a proveedor';
COMMENT ON COLUMN transacciones_financieras.comprobante_url IS 'URL del comprobante escaneado';
COMMENT ON COLUMN configuracion_sistema.grupo IS 'empresa, envios, pagos, notificaciones, etc.';
COMMENT ON COLUMN "diseños_usuario".datos_json IS 'Datos del diseño en formato JSON';
COMMENT ON COLUMN "diseños_usuario".estado IS 'borrador, publicado, archivado';

-- ============================================
-- 7. DATA INSERTS
-- ============================================
INSERT INTO categorias (id, padre_id, nombre, slug, url_imagen, orden, activa) VALUES
(1, NULL, 'Camisetas', 'camisetas', NULL, 0, TRUE),
(2, NULL, 'Hoodies', 'hoodies', NULL, 0, TRUE),
(3, NULL, 'Pantalones', 'pantalones', NULL, 0, TRUE),
(4, NULL, 'Chaquetas', 'chaquetas', NULL, 0, TRUE),
(5, NULL, 'Accesorios', 'accesorios', NULL, 0, TRUE),
(6, NULL, 'Zapatillas', 'zapatillas', NULL, 0, TRUE);

INSERT INTO marcas (id, nombre, slug, url_logo) VALUES
(1, 'Krea Original', 'krea-original', NULL),
(2, 'Krea Black Label', 'krea-black-label', NULL),
(3, 'Krea Sport', 'krea-sport', NULL),
(4, 'Krea Basics', 'krea-basics', NULL);

INSERT INTO configuracion_sistema (id, grupo, clave, valor, tipo, descripcion, editable, creado_en, actualizado_en) VALUES
(1, 'empresa', 'nombre', 'Krea Streetwear', 'string', 'Nombre de la empresa/tienda', TRUE, '2026-04-19 15:50:45', NULL),
(2, 'empresa', 'email_contacto', 'hola@krea.studio', 'string', 'Email de contacto principal', TRUE, '2026-04-19 15:50:45', NULL),
(3, 'empresa', 'telefono', '+52 55 1234 5678', 'string', 'Teléfono de contacto', TRUE, '2026-04-19 15:50:45', NULL),
(4, 'empresa', 'direccion', 'Ciudad de México, México', 'textarea', 'Dirección física de la empresa', TRUE, '2026-04-19 15:50:45', NULL),
(5, 'empresa', 'descripcion', 'Streetwear premium para creadores', 'textarea', 'Descripción corta de la empresa', TRUE, '2026-04-19 15:50:45', NULL),
(6, 'empresa', 'logo_url', './images/logo/Krea-blanco-sinfondo.png', 'string', 'URL del logo principal', TRUE, '2026-04-19 15:50:45', NULL),
(7, 'empresa', 'favicon_url', './images/logo/K-logo.png', 'string', 'URL del favicon', TRUE, '2026-04-19 15:50:45', NULL),
(8, 'envios', 'envio_gratis_minimo', '3000', 'number', 'Monto mínimo para envío gratis', TRUE, '2026-04-19 15:50:45', NULL),
(9, 'envios', 'costo_envio_estandar', '150', 'number', 'Costo de envío estándar', TRUE, '2026-04-19 15:50:45', NULL),
(10, 'envios', 'costo_envio_express', '350', 'number', 'Costo de envío express', TRUE, '2026-04-19 15:50:45', NULL),
(11, 'envios', 'tiempo_entrega_estandar', '3-5', 'string', 'Días de entrega estándar', TRUE, '2026-04-19 15:50:45', NULL),
(12, 'envios', 'tiempo_entrega_express', '1-2', 'string', 'Días de entrega express', TRUE, '2026-04-19 15:50:45', NULL),
(13, 'envios', 'paises_disponibles', '["México"]', 'json', 'Países donde se realiza envío', TRUE, '2026-04-19 15:50:45', NULL),
(14, 'envios', 'envio_gratis_activo', 'true', 'boolean', 'Activar envío gratis en compras mínimas', TRUE, '2026-04-19 15:50:45', NULL),
(15, 'notificaciones', 'email_nuevo_pedido', 'true', 'boolean', 'Notificar por email cuando hay nuevo pedido', TRUE, '2026-04-19 15:50:45', NULL),
(16, 'notificaciones', 'email_nuevo_usuario', 'true', 'boolean', 'Notificar cuando se registra nuevo usuario', TRUE, '2026-04-19 15:50:45', NULL),
(17, 'notificaciones', 'email_stock_bajo', 'true', 'boolean', 'Notificar cuando hay productos con stock bajo', TRUE, '2026-04-19 15:50:45', NULL),
(18, 'notificaciones', 'stock_minimo_alerta', '5', 'number', 'Cantidad mínima para alerta de stock bajo', TRUE, '2026-04-19 15:50:45', NULL),
(19, 'notificaciones', 'notificar_admin_pedidos', 'true', 'boolean', 'Enviar notificación al admin de nuevos pedidos', TRUE, '2026-04-19 15:50:45', NULL),
(20, 'pedidos', 'prefijo_pedido', 'KRE-', 'string', 'Prefijo para números de pedido', TRUE, '2026-04-19 15:50:45', NULL),
(21, 'pedidos', 'impuestos_porcentaje', '16', 'number', 'Porcentaje de impuestos (IVA)', TRUE, '2026-04-19 15:50:45', NULL),
(22, 'pedidos', 'moneda_default', 'MXN', 'string', 'Moneda por defecto', TRUE, '2026-04-19 15:50:45', NULL),
(23, 'pedidos', 'permite_pedidos_sin_stock', 'false', 'boolean', 'Permitir pedidos de productos agotados', TRUE, '2026-04-19 15:50:45', NULL),
(24, 'pedidos', 'estado_inicial', 'pendiente', 'string', 'Estado inicial de los pedidos', TRUE, '2026-04-19 15:50:45', NULL),
(25, 'usuarios', 'registro_abierto', 'true', 'boolean', 'Permitir nuevos registros de usuarios', TRUE, '2026-04-19 15:50:45', NULL),
(26, 'usuarios', 'verificacion_email', 'false', 'boolean', 'Requerir verificación de email', TRUE, '2026-04-19 15:50:45', NULL),
(27, 'usuarios', 'rol_default', 'cliente', 'string', 'Rol asignado a nuevos usuarios', TRUE, '2026-04-19 15:50:45', NULL),
(28, 'seo', 'meta_title', 'Krea Streetwear - Moda Premium', 'string', 'Título por defecto del sitio', TRUE, '2026-04-19 15:50:45', NULL),
(29, 'seo', 'meta_description', 'Descubre nuestra colección de streetwear premium diseñada para creadores.', 'textarea', 'Descripción meta del sitio', TRUE, '2026-04-19 15:50:45', NULL),
(30, 'seo', 'instagram_url', 'https://instagram.com/krea.studio', 'string', 'URL de Instagram', TRUE, '2026-04-19 15:50:45', NULL),
(31, 'seo', 'tiktok_url', 'https://tiktok.com/@krea.studio', 'string', 'URL de TikTok', TRUE, '2026-04-19 15:50:45', NULL),
(32, 'seo', 'facebook_url', '', 'string', 'URL de Facebook', TRUE, '2026-04-19 15:50:45', NULL),
(33, 'seo', 'twitter_url', '', 'string', 'URL de Twitter/X', TRUE, '2026-04-19 15:50:45', NULL);

INSERT INTO metodos_pago_config (id, codigo, nombre, descripcion, configuracion, comision_porcentaje, activo, es_default, orden, imagen_url, creado_en) VALUES
(1, 'mercadopago', 'Mercado Pago', 'Pago con tarjeta, efectivo o transferencia vía Mercado Pago', NULL, 4.99, TRUE, FALSE, 1, NULL, '2026-04-19 13:15:24'),
(2, 'transferencia', 'Transferencia Bancaria', 'Transferencia o depósito bancario', NULL, 0.00, TRUE, FALSE, 2, NULL, '2026-04-19 13:15:24'),
(3, 'efectivo', 'Efectivo', 'Pago en efectivo al momento de la entrega', NULL, 0.00, TRUE, FALSE, 3, NULL, '2026-04-19 13:15:24');

INSERT INTO password_resets (id, correo, codigo, expira_en, usado, creado_en) VALUES
(3, 'bossmanu5656@gmail.com', '432974', '2026-05-04 15:17:46', FALSE, '2026-05-04 09:02:46');

INSERT INTO usuarios (id, correo, contrasena_hash, rol, nombre, apellido, telefono, url_avatar, activo, creado_en) VALUES
(1, 'bossmanu5656@gmail.com', '$2y$10$8YMIR5EVmIh4uAf1J4HldewxSkF8sMtcW2R9Zgmx6TjU1kDBqFU1a', 'cliente', 'Manuel', 'Castillo', '8097506092', NULL, TRUE, '2026-04-19 01:10:59'),
(2, 'admin@krea.studio', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 'Administrador', 'Krea', '+52 55 1234 5678', NULL, TRUE, '2026-04-19 01:53:40');

INSERT INTO perfiles_vendedor (id, usuario_id, descripcion, url_logo, url_banner, instagram, tiktok, verificado, activo, tasa_comision, creado_en) VALUES
(1, 2, 'Cuenta oficial de Krea Streetwear. Diseñamos streetwear premium para creadores.', './images/logo/Krea-blanco-sinfondo.png', NULL, '@krea.studio', '@krea.studio', TRUE, TRUE, 0.00, '2026-04-19 01:53:40');

INSERT INTO productos (id, vendedor_id, categoria_id, marca_id, nombre, slug, descripcion, material, costo, precio_base, precio_comparacion, estado, destacado, nuevo, creado_en, publicado_en) VALUES
(5, 1, 1, 1, 'Camiseta Krea Logo Classic', 'camiseta-krea-logo-classic', 'La camiseta clasica con nuestro logo emblematico. Algodon 100% organico.', NULL, 0.00, 35.00, 45.00, 'publicado', TRUE, TRUE, '2026-05-04 15:28:04', NULL),
(6, 1, 1, 1, 'Camiseta Krea Vintage Wash', 'camiseta-krea-vintage-wash', 'Camiseta con lavado vintage y efecto desgastado. Tejido suave.', NULL, 0.00, 42.00, 55.00, 'publicado', TRUE, TRUE, '2026-05-04 15:28:04', NULL),
(7, 1, 1, 2, 'Camiseta Graffiti Art', 'camiseta-graffiti-art', 'Colaboracion con artistas locales. Arte urbano serigrafiado.', NULL, 0.00, 48.00, 65.00, 'publicado', TRUE, TRUE, '2026-05-04 15:28:04', NULL),
(8, 1, 1, 4, 'Camiseta Basic White 3-Pack', 'camiseta-basic-white-3-pack', 'Pack de 3 camisetas blancas basicas.', NULL, 0.00, 75.00, 100.00, 'publicado', FALSE, TRUE, '2026-05-04 15:28:04', NULL),
(9, 1, 2, 1, 'Hoodie Krea Classic Black', 'hoodie-krea-classic-black', 'El hoodie clasico en negro. Interior cepillado ultra suave.', NULL, 0.00, 75.00, 95.00, 'publicado', TRUE, TRUE, '2026-05-04 15:28:04', NULL),
(10, 1, 2, 1, 'Hoodie Oversized Beige', 'hoodie-oversized-beige', 'Corte oversized extremo en tono beige.', NULL, 0.00, 85.00, 110.00, 'publicado', TRUE, TRUE, '2026-05-04 15:28:04', NULL),
(11, 1, 2, 2, 'Hoodie Tech Zip Grey', 'hoodie-tech-zip-grey', 'Hoodie con cierre tecnico y detalles reflectantes.', NULL, 0.00, 95.00, 120.00, 'publicado', TRUE, TRUE, '2026-05-04 15:28:04', NULL),
(12, 1, 2, 3, 'Hoodie Heavyweight Winter', 'hoodie-heavyweight-winter', 'Tejido pesado 450gsm para invierno.', NULL, 0.00, 110.00, 140.00, 'publicado', TRUE, TRUE, '2026-05-04 15:28:04', NULL),
(13, 1, 3, 1, 'Cargo Pants Utility Black', 'cargo-pants-utility-black', 'Pantalones cargo multi-bolsillo en negro.', NULL, 0.00, 85.00, 110.00, 'publicado', TRUE, TRUE, '2026-05-04 15:28:04', NULL),
(14, 1, 3, 2, 'Joggers Tech Fleece Grey', 'joggers-tech-fleece-grey', 'Joggers de tech fleece. Corte conico moderno.', NULL, 0.00, 72.00, 95.00, 'publicado', TRUE, TRUE, '2026-05-04 15:28:04', NULL),
(15, 1, 3, 2, 'Jeans Baggy Vintage', 'jeans-baggy-vintage', 'Jeans baggy estilo anos 90. Lavado vintage.', NULL, 0.00, 95.00, 120.00, 'publicado', TRUE, TRUE, '2026-05-04 15:28:04', NULL),
(16, 1, 4, 1, 'Bomber Jacket Classic', 'bomber-jacket-classic', 'La chaqueta bomber atemporal. Nylon resistente.', NULL, 0.00, 120.00, 150.00, 'publicado', TRUE, TRUE, '2026-05-04 15:28:04', NULL),
(17, 1, 4, 2, 'Chaqueta Denim Oversized', 'chaqueta-denim-oversized', 'Cazadora vaquera oversized. Lavado medio.', NULL, 0.00, 135.00, 170.00, 'publicado', TRUE, TRUE, '2026-05-04 15:28:04', NULL),
(18, 1, 4, 2, 'Chaqueta Sherpa Fleece', 'chaqueta-sherpa-fleece', 'Polar sherpa reversible. Dos looks en uno.', NULL, 0.00, 145.00, 180.00, 'publicado', TRUE, TRUE, '2026-05-04 15:28:04', NULL),
(19, 1, 5, 1, 'Gorra Dad Hat Classic', 'gorra-dad-hat-classic', 'Gorra estilo dad hat. Logo bordado.', NULL, 0.00, 28.00, 35.00, 'publicado', TRUE, TRUE, '2026-05-04 15:28:04', NULL),
(20, 1, 5, 1, 'Bucket Hat Reversible', 'bucket-hat-reversible', 'Sombrero bucket reversible. Dos colores.', NULL, 0.00, 35.00, 45.00, 'publicado', TRUE, TRUE, '2026-05-04 15:28:04', NULL),
(21, 1, 5, 2, 'Mochila Urban Tech', 'mochila-urban-tech', 'Mochila urbana con compartimento laptop.', NULL, 0.00, 75.00, 95.00, 'publicado', TRUE, TRUE, '2026-05-04 15:28:04', NULL),
(22, 1, 6, 1, 'Zapatillas Krea Runner', 'zapatillas-krea-runner', 'Nuestras zapatillas signature. Amortiguacion reactiva.', NULL, 0.00, 120.00, 150.00, 'publicado', TRUE, TRUE, '2026-05-04 15:28:04', NULL),
(23, 1, 6, 2, 'Chunky Sneakers Bold', 'chunky-sneakers-bold', 'Suela chunky voluminosa. Estilo retro-futurista.', NULL, 0.00, 135.00, 170.00, 'publicado', TRUE, TRUE, '2026-05-04 15:28:04', NULL),
(24, 1, 6, 1, 'Botas Work Boot', 'botas-work-boot', 'Botas estilo militar robustas. Cuero engrasado.', NULL, 0.00, 145.00, 180.00, 'publicado', TRUE, TRUE, '2026-05-04 15:28:04', NULL);

INSERT INTO "reseñas" (id, producto_id, usuario_id, calificacion, comentario, aprobada, creado_en) VALUES
(1, 5, 1, 5, 'me gusto', TRUE, '2026-05-05 01:22:45'),
(2, 14, 1, 2, 'no me gusto', TRUE, '2026-05-07 02:40:14');

-- ============================================
-- 8. SEQUENCE RESTART (to match AUTO_INCREMENT offsets)
-- ============================================
SELECT setval('usuarios_id_seq', (SELECT MAX(id) FROM usuarios));
SELECT setval('categorias_id_seq', (SELECT MAX(id) FROM categorias));
SELECT setval('marcas_id_seq', (SELECT MAX(id) FROM marcas));
SELECT setval('perfiles_vendedor_id_seq', (SELECT MAX(id) FROM perfiles_vendedor));
SELECT setval('productos_id_seq', (SELECT MAX(id) FROM productos));
SELECT setval('configuracion_sistema_id_seq', (SELECT MAX(id) FROM configuracion_sistema));
SELECT setval('metodos_pago_config_id_seq', (SELECT MAX(id) FROM metodos_pago_config));
SELECT setval('password_resets_id_seq', (SELECT MAX(id) FROM password_resets));
SELECT setval('"reseñas_id_seq"', (SELECT MAX(id) FROM "reseñas"));
