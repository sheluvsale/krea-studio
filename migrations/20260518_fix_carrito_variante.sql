-- Fix carrito y items_pedido para soportar variantes correctamente
ALTER TABLE carrito ADD COLUMN IF NOT EXISTS variante_id INTEGER DEFAULT NULL;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'carrito_variante_fk'
          AND table_name = 'carrito'
    ) THEN
        ALTER TABLE carrito ADD CONSTRAINT carrito_variante_fk
        FOREIGN KEY (variante_id) REFERENCES variantes_producto(id) ON DELETE SET NULL;
    END IF;
END $$;

-- items_pedido ya fue modificado en el schema principal, pero si no:
-- ALTER TABLE items_pedido ADD COLUMN IF NOT EXISTS producto_id INTEGER NOT NULL DEFAULT 0;
-- ALTER TABLE items_pedido ALTER COLUMN variante_id DROP NOT NULL;
