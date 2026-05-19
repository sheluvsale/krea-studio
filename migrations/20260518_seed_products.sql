-- ============================================================
-- SEED: 10 Productos Krea Studio (Streetwear)
-- Sin fotos — para pruebas de checkout y chat
-- ============================================================

-- Productos (IDs explícitos 101-110 para evitar colisiones)
INSERT INTO productos (id, vendedor_id, categoria_id, marca_id, nombre, slug, descripcion, material, costo, precio_base, precio_comparacion, estado, destacado, nuevo) VALUES
(101, 1, 1, 1, 'Camiseta Oversized Krea Core', 'camiseta-oversized-krea-core', 'Camiseta oversized fit en algodón premium 240gsm. Cuello reforzado, caída pesada y estampado minimal Krea en pecho. Esencia del streetwear dominicano.', '100% Algodón Premium', 850.00, 1499.00, 1899.00, 'publicado', TRUE, TRUE),
(102, 1, 2, 1, 'Hoodie Krea Essential Black', 'hoodie-krea-essential-black', 'Hoodie pesado en mezcla de algodón y poliéster. Capucha doble, bolsillo canguro y logo bordado en manga. Perfecto para layering.', '80% Algodón / 20% Poliéster', 1200.00, 2499.00, 2999.00, 'publicado', TRUE, TRUE),
(103, 1, 3, 2, 'Pantalón Cargo Krea Tactical', 'pantalon-cargo-krea-tactical', 'Cargo slim-fit con 6 bolsillos funcionales. Tela ripstop resistente, cintura elástica ajustable y terminaciones premium.', 'Ripstop 65% Poliéster / 35% Algodón', 1100.00, 2199.00, 2599.00, 'publicado', FALSE, TRUE),
(104, 1, 4, 1, 'Chaqueta Bomber Krea Street', 'chaqueta-bomber-krea-street', 'Bomber jacket con forro interior Krea. Cierre YKK, puños acanalados y parche bordado trasero. Edición limitada.', 'Nylon / Poliéster con forro', 1800.00, 3499.00, 4299.00, 'publicado', TRUE, TRUE),
(105, 1, 1, 2, 'Camiseta Boxy Krea 809', 'camiseta-boxy-krea-809', 'Corte boxy con hombros caídos. Gráfico 809 (código área La Vega) en serigrafía alta densidad. Tejido suave pre-encogido.', '100% Algodón Jersey', 700.00, 1299.00, 1599.00, 'publicado', FALSE, TRUE),
(106, 1, 5, 3, 'Gorra Dad Hat Krea Minimal', 'gorra-dad-hat-krea-minimal', 'Dad hat en drill de algodón con bordado minimal Krea. Cierre strapback ajustable. Curvatura clásica.', '100% Algodón Drill', 350.00, 799.00, 999.00, 'publicado', TRUE, TRUE),
(107, 1, 2, 3, 'Crewneck Krea Sport Logo', 'crewneck-krea-sport-logo', 'Sudadera crewneck ligera para entrenamiento o street casual. Logo reflectante frontal y paneles laterales de malla.', '65% Algodón / 35% Poliéster', 950.00, 1899.00, 2299.00, 'publicado', FALSE, TRUE),
(108, 1, 3, 1, 'Jogger Krea Tech Fleece', 'jogger-krea-tech-fleece', 'Jogger de tech fleece con puños y cintura acanalados. Bolsillos laterales con zippers. Silueta tapered moderna.', 'Tech Fleece 90% Poliéster / 10% Elastano', 900.00, 1799.00, 2199.00, 'publicado', FALSE, TRUE),
(109, 1, 5, 2, 'Mochila Krea Utility Rolltop', 'mochila-krea-utility-rolltop', 'Mochila rolltop de 25L con compartimento laptop 15", bolsillos organizadores y panel trasero acolchado. Detalles reflectantes.', 'Poliéster 600D recubierto', 1400.00, 2799.00, 3299.00, 'publicado', TRUE, TRUE),
(110, 1, 6, 3, 'Zapatillas Krea Runner V1', 'zapatillas-krea-runner-v1', 'Runner inspirado en los 90s con malla transpirable, suela chunky y detalles en nobuck sintético. Comodidad todo el día.', 'Malla / Nobuck Sintético / EVA', 2200.00, 3999.00, 4999.00, 'publicado', TRUE, TRUE);

-- Variantes de talla (S, M, L, XL)
INSERT INTO variantes_producto (producto_id, sku, precio_adicional, stock, stock_minimo, activa) VALUES
(101, 'CKC-S-001', 0.00, 12, 5, TRUE),
(101, 'CKC-M-001', 0.00, 18, 5, TRUE),
(101, 'CKC-L-001', 0.00, 15, 5, TRUE),
(101, 'CKC-XL-001', 0.00, 8, 5, TRUE),

(102, 'HKR-S-001', 0.00, 10, 5, TRUE),
(102, 'HKR-M-001', 0.00, 14, 5, TRUE),
(102, 'HKR-L-001', 0.00, 11, 5, TRUE),
(102, 'HKR-XL-001', 0.00, 7, 5, TRUE),

(103, 'CKT-S-001', 0.00, 9, 5, TRUE),
(103, 'CKT-M-001', 0.00, 13, 5, TRUE),
(103, 'CKT-L-001', 0.00, 10, 5, TRUE),
(103, 'CKT-XL-001', 0.00, 6, 5, TRUE),

(104, 'CBR-S-001', 0.00, 5, 3, TRUE),
(104, 'CBR-M-001', 0.00, 8, 3, TRUE),
(104, 'CBR-L-001', 0.00, 6, 3, TRUE),
(104, 'CBR-XL-001', 0.00, 4, 3, TRUE),

(105, 'C89-S-001', 0.00, 20, 5, TRUE),
(105, 'C89-M-001', 0.00, 25, 5, TRUE),
(105, 'C89-L-001', 0.00, 18, 5, TRUE),
(105, 'C89-XL-001', 0.00, 12, 5, TRUE),

(106, 'GDK-OS-001', 0.00, 15, 5, TRUE),

(107, 'CRS-S-001', 0.00, 11, 5, TRUE),
(107, 'CRS-M-001', 0.00, 16, 5, TRUE),
(107, 'CRS-L-001', 0.00, 12, 5, TRUE),
(107, 'CRS-XL-001', 0.00, 9, 5, TRUE),

(108, 'JTF-S-001', 0.00, 10, 5, TRUE),
(108, 'JTF-M-001', 0.00, 14, 5, TRUE),
(108, 'JTF-L-001', 0.00, 11, 5, TRUE),
(108, 'JTF-XL-001', 0.00, 7, 5, TRUE),

(109, 'BUR-OS-001', 0.00, 8, 3, TRUE),

(110, 'ZRV-41-001', 0.00, 6, 3, TRUE),
(110, 'ZRV-42-001', 0.00, 8, 3, TRUE),
(110, 'ZRV-43-001', 0.00, 10, 3, TRUE),
(110, 'ZRV-44-001', 0.00, 5, 3, TRUE);
