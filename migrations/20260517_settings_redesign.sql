-- ============================================================
-- MIGRACIÓN: Settings Redesign + Métodos de Pago + Preferencias
-- Fecha: 2026-05-17
-- ============================================================

-- 1. Nuevo enum para métodos de pago del usuario (solo tarjeta y paypal)
CREATE TYPE usuario_metodo_pago_tipo AS ENUM ('tarjeta', 'paypal');

-- 2. Eliminar métodos de pago de usuario no soportados
-- NOTA: la columna 'tipo' aún usa el enum viejo 'metodo_pago_tipo' que NO contiene 'paypal'.
-- Solo eliminamos los valores existentes en ese enum que no queremos conservar.
DELETE FROM metodos_pago_usuario
WHERE tipo NOT IN ('tarjeta');

-- 3a. Convertir columna tipo a VARCHAR para romper dependencia del enum viejo
-- (PostgreSQL no permite castear directamente entre enums distintos)
ALTER TABLE metodos_pago_usuario
  ALTER COLUMN tipo TYPE VARCHAR(20) USING tipo::text,
  ADD COLUMN IF NOT EXISTS tipo_tarjeta VARCHAR(20) DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS email_paypal VARCHAR(255) DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS numero_tarjeta_mask VARCHAR(20) DEFAULT NULL;

-- 3b. Quitar default viejo antes de convertir el tipo
ALTER TABLE metodos_pago_usuario
  ALTER COLUMN tipo DROP DEFAULT;

-- 3c. Convertir de VARCHAR al nuevo enum
ALTER TABLE metodos_pago_usuario
  ALTER COLUMN tipo TYPE usuario_metodo_pago_tipo USING tipo::usuario_metodo_pago_tipo;

-- 3d. Restaurar default con valor válido del nuevo enum
ALTER TABLE metodos_pago_usuario
  ALTER COLUMN tipo SET DEFAULT 'tarjeta';

-- Limpiar campos que no aplican según el tipo
UPDATE metodos_pago_usuario
SET numero_tarjeta = NULL, titular = NULL, fecha_expiracion = NULL, tipo_tarjeta = NULL
WHERE tipo = 'paypal';

UPDATE metodos_pago_usuario
SET email_paypal = NULL
WHERE tipo = 'tarjeta';

-- 4. Crear tabla preferencias_usuario
CREATE TABLE IF NOT EXISTS preferencias_usuario (
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

-- FK + índices
ALTER TABLE preferencias_usuario
  ADD CONSTRAINT preferencias_usuario_fk FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_preferencias_usuario_id ON preferencias_usuario(usuario_id);

-- 5. Trigger de actualización para preferencias_usuario
DROP TRIGGER IF EXISTS trg_preferencias_usuario_updated ON preferencias_usuario;
CREATE TRIGGER trg_preferencias_usuario_updated
BEFORE UPDATE ON preferencias_usuario
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- 6. Insertar preferencias por defecto para usuarios existentes que no las tengan
INSERT INTO preferencias_usuario (usuario_id, notificaciones_email, notificaciones_push, newsletter, idioma, moneda, tema)
SELECT id, TRUE, FALSE, FALSE, 'es', 'DOP', 'dark'
FROM usuarios
WHERE id NOT IN (SELECT usuario_id FROM preferencias_usuario);

-- 7. Comentarios de columnas nuevas
COMMENT ON COLUMN metodos_pago_usuario.tipo_tarjeta IS 'visa, mastercard, amex';
COMMENT ON COLUMN metodos_pago_usuario.email_paypal IS 'Email de cuenta PayPal asociada';
COMMENT ON COLUMN metodos_pago_usuario.numero_tarjeta_mask IS 'Máscara de los últimos 4 dígitos (****1234)';
COMMENT ON COLUMN preferencias_usuario.idioma IS 'es, en, etc.';
COMMENT ON COLUMN preferencias_usuario.moneda IS 'DOP, USD, MXN, etc.';
COMMENT ON COLUMN preferencias_usuario.tema IS 'dark, light, system';
