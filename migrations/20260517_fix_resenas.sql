-- ============================================================
-- MIGRACIÓN: Renombrar tabla "reseñas" -> resenas (sin ñ)
-- Fecha: 2026-05-17
-- ============================================================

-- 1. Renombrar tabla
ALTER TABLE "reseñas" RENAME TO resenas;

-- 2. Renombrar índices
ALTER INDEX IF EXISTS "idx_reseñas_producto_id" RENAME TO idx_resenas_producto_id;
ALTER INDEX IF EXISTS "idx_reseñas_usuario_id" RENAME TO idx_resenas_usuario_id;

-- 3. Renombrar constraint (FK) si existe con nombre viejo
-- PostgreSQL renombra automáticamente las constraints al renombrar la tabla,
-- pero dejamos comentado por si acaso:
-- ALTER TABLE resenas RENAME CONSTRAINT "reseñas_producto_id_fkey" TO resenas_producto_id_fkey;
-- ALTER TABLE resenas RENAME CONSTRAINT "reseñas_usuario_id_fkey" TO resenas_usuario_id_fkey;
