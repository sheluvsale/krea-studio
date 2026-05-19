-- Tabla para secciones/bloques personalizables de productos
CREATE TABLE IF NOT EXISTS producto_secciones (
  id SERIAL PRIMARY KEY,
  producto_id INTEGER NOT NULL REFERENCES productos(id) ON DELETE CASCADE,
  tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('especificaciones','materiales','cuidado','faq','galeria','video','texto_libre')),
  titulo VARCHAR(255) NOT NULL DEFAULT '',
  contenido TEXT NOT NULL DEFAULT '',
  orden INTEGER NOT NULL DEFAULT 0,
  activo BOOLEAN NOT NULL DEFAULT true,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_producto_secciones_producto ON producto_secciones(producto_id);
CREATE INDEX IF NOT EXISTS idx_producto_secciones_activo ON producto_secciones(activo);
