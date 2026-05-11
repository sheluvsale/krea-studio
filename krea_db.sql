-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 07, 2026 at 04:46 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `krea_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `atributos_variante`
--

CREATE TABLE `atributos_variante` (
  `id` int(11) NOT NULL,
  `variante_id` int(11) NOT NULL,
  `tipo` varchar(50) NOT NULL COMMENT 'talla, color, etc.',
  `valor` varchar(100) NOT NULL COMMENT 'M, L, Negro, Blanco, etc.'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `banners`
--

CREATE TABLE `banners` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `imagen_url` text NOT NULL,
  `posicion` enum('home_principal','home_secundario','productos','checkout','categoria') NOT NULL DEFAULT 'home_principal',
  `link_url` text DEFAULT NULL,
  `orden` int(11) NOT NULL DEFAULT 0,
  `fecha_inicio` date DEFAULT NULL,
  `fecha_fin` date DEFAULT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  `clicks` int(11) NOT NULL DEFAULT 0,
  `impresiones` int(11) NOT NULL DEFAULT 0,
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `campanas_email`
--

CREATE TABLE `campanas_email` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `asunto` varchar(255) NOT NULL,
  `segmento` enum('todos','clientes','nuevos','inactivos') NOT NULL DEFAULT 'todos',
  `contenido_html` text DEFAULT NULL,
  `estado` enum('borrador','programado','enviando','enviado','cancelado') NOT NULL DEFAULT 'borrador',
  `fecha_envio` datetime DEFAULT NULL,
  `enviados` int(11) NOT NULL DEFAULT 0,
  `aperturas` int(11) NOT NULL DEFAULT 0,
  `clicks` int(11) NOT NULL DEFAULT 0,
  `conversiones` int(11) NOT NULL DEFAULT 0,
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp(),
  `actualizado_en` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `carrito`
--

CREATE TABLE `carrito` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `producto_id` int(11) NOT NULL,
  `nombre_producto` varchar(255) NOT NULL,
  `cantidad` int(11) NOT NULL DEFAULT 1,
  `precio_unitario` decimal(10,2) NOT NULL,
  `talla` varchar(10) DEFAULT NULL,
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `categorias`
--

CREATE TABLE `categorias` (
  `id` int(11) NOT NULL,
  `padre_id` int(11) DEFAULT NULL,
  `nombre` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `url_imagen` text DEFAULT NULL,
  `orden` int(11) NOT NULL DEFAULT 0,
  `activa` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categorias`
--

INSERT INTO `categorias` (`id`, `padre_id`, `nombre`, `slug`, `url_imagen`, `orden`, `activa`) VALUES
(1, NULL, 'Camisetas', 'camisetas', NULL, 0, 1),
(2, NULL, 'Hoodies', 'hoodies', NULL, 0, 1),
(3, NULL, 'Pantalones', 'pantalones', NULL, 0, 1),
(4, NULL, 'Chaquetas', 'chaquetas', NULL, 0, 1),
(5, NULL, 'Accesorios', 'accesorios', NULL, 0, 1),
(6, NULL, 'Zapatillas', 'zapatillas', NULL, 0, 1);

-- --------------------------------------------------------

--
-- Table structure for table `configuracion_sistema`
--

CREATE TABLE `configuracion_sistema` (
  `id` int(11) NOT NULL,
  `grupo` varchar(50) NOT NULL DEFAULT 'general' COMMENT 'empresa, envios, pagos, notificaciones, etc.',
  `clave` varchar(100) NOT NULL,
  `valor` text DEFAULT NULL,
  `tipo` enum('string','number','boolean','json','textarea') NOT NULL DEFAULT 'string',
  `descripcion` varchar(255) DEFAULT NULL,
  `editable` tinyint(1) NOT NULL DEFAULT 1,
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp(),
  `actualizado_en` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `configuracion_sistema`
--

INSERT INTO `configuracion_sistema` (`id`, `grupo`, `clave`, `valor`, `tipo`, `descripcion`, `editable`, `creado_en`, `actualizado_en`) VALUES
(1, 'empresa', 'nombre', 'Krea Streetwear', 'string', 'Nombre de la empresa/tienda', 1, '2026-04-19 15:50:45', NULL),
(2, 'empresa', 'email_contacto', 'hola@krea.studio', 'string', 'Email de contacto principal', 1, '2026-04-19 15:50:45', NULL),
(3, 'empresa', 'telefono', '+52 55 1234 5678', 'string', 'Teléfono de contacto', 1, '2026-04-19 15:50:45', NULL),
(4, 'empresa', 'direccion', 'Ciudad de México, México', 'textarea', 'Dirección física de la empresa', 1, '2026-04-19 15:50:45', NULL),
(5, 'empresa', 'descripcion', 'Streetwear premium para creadores', 'textarea', 'Descripción corta de la empresa', 1, '2026-04-19 15:50:45', NULL),
(6, 'empresa', 'logo_url', './images/logo/Krea-blanco-sinfondo.png', 'string', 'URL del logo principal', 1, '2026-04-19 15:50:45', NULL),
(7, 'empresa', 'favicon_url', './images/logo/K-logo.png', 'string', 'URL del favicon', 1, '2026-04-19 15:50:45', NULL),
(8, 'envios', 'envio_gratis_minimo', '3000', 'number', 'Monto mínimo para envío gratis', 1, '2026-04-19 15:50:45', NULL),
(9, 'envios', 'costo_envio_estandar', '150', 'number', 'Costo de envío estándar', 1, '2026-04-19 15:50:45', NULL),
(10, 'envios', 'costo_envio_express', '350', 'number', 'Costo de envío express', 1, '2026-04-19 15:50:45', NULL),
(11, 'envios', 'tiempo_entrega_estandar', '3-5', 'string', 'Días de entrega estándar', 1, '2026-04-19 15:50:45', NULL),
(12, 'envios', 'tiempo_entrega_express', '1-2', 'string', 'Días de entrega express', 1, '2026-04-19 15:50:45', NULL),
(13, 'envios', 'paises_disponibles', '[\"México\"]', 'json', 'Países donde se realiza envío', 1, '2026-04-19 15:50:45', NULL),
(14, 'envios', 'envio_gratis_activo', 'true', 'boolean', 'Activar envío gratis en compras mínimas', 1, '2026-04-19 15:50:45', NULL),
(15, 'notificaciones', 'email_nuevo_pedido', 'true', 'boolean', 'Notificar por email cuando hay nuevo pedido', 1, '2026-04-19 15:50:45', NULL),
(16, 'notificaciones', 'email_nuevo_usuario', 'true', 'boolean', 'Notificar cuando se registra nuevo usuario', 1, '2026-04-19 15:50:45', NULL),
(17, 'notificaciones', 'email_stock_bajo', 'true', 'boolean', 'Notificar cuando hay productos con stock bajo', 1, '2026-04-19 15:50:45', NULL),
(18, 'notificaciones', 'stock_minimo_alerta', '5', 'number', 'Cantidad mínima para alerta de stock bajo', 1, '2026-04-19 15:50:45', NULL),
(19, 'notificaciones', 'notificar_admin_pedidos', 'true', 'boolean', 'Enviar notificación al admin de nuevos pedidos', 1, '2026-04-19 15:50:45', NULL),
(20, 'pedidos', 'prefijo_pedido', 'KRE-', 'string', 'Prefijo para números de pedido', 1, '2026-04-19 15:50:45', NULL),
(21, 'pedidos', 'impuestos_porcentaje', '16', 'number', 'Porcentaje de impuestos (IVA)', 1, '2026-04-19 15:50:45', NULL),
(22, 'pedidos', 'moneda_default', 'MXN', 'string', 'Moneda por defecto', 1, '2026-04-19 15:50:45', NULL),
(23, 'pedidos', 'permite_pedidos_sin_stock', 'false', 'boolean', 'Permitir pedidos de productos agotados', 1, '2026-04-19 15:50:45', NULL),
(24, 'pedidos', 'estado_inicial', 'pendiente', 'string', 'Estado inicial de los pedidos', 1, '2026-04-19 15:50:45', NULL),
(25, 'usuarios', 'registro_abierto', 'true', 'boolean', 'Permitir nuevos registros de usuarios', 1, '2026-04-19 15:50:45', NULL),
(26, 'usuarios', 'verificacion_email', 'false', 'boolean', 'Requerir verificación de email', 1, '2026-04-19 15:50:45', NULL),
(27, 'usuarios', 'rol_default', 'cliente', 'string', 'Rol asignado a nuevos usuarios', 1, '2026-04-19 15:50:45', NULL),
(28, 'seo', 'meta_title', 'Krea Streetwear - Moda Premium', 'string', 'Título por defecto del sitio', 1, '2026-04-19 15:50:45', NULL),
(29, 'seo', 'meta_description', 'Descubre nuestra colección de streetwear premium diseñada para creadores.', 'textarea', 'Descripción meta del sitio', 1, '2026-04-19 15:50:45', NULL),
(30, 'seo', 'instagram_url', 'https://instagram.com/krea.studio', 'string', 'URL de Instagram', 1, '2026-04-19 15:50:45', NULL),
(31, 'seo', 'tiktok_url', 'https://tiktok.com/@krea.studio', 'string', 'URL de TikTok', 1, '2026-04-19 15:50:45', NULL),
(32, 'seo', 'facebook_url', '', 'string', 'URL de Facebook', 1, '2026-04-19 15:50:45', NULL),
(33, 'seo', 'twitter_url', '', 'string', 'URL de Twitter/X', 1, '2026-04-19 15:50:45', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `cupones`
--

CREATE TABLE `cupones` (
  `id` int(11) NOT NULL,
  `codigo` varchar(50) NOT NULL,
  `tipo_descuento` enum('porcentaje','fijo','envio_gratis') NOT NULL DEFAULT 'porcentaje',
  `valor` decimal(10,2) NOT NULL DEFAULT 0.00,
  `minimo_compra` decimal(10,2) NOT NULL DEFAULT 0.00,
  `limite_usos` int(11) DEFAULT NULL COMMENT 'NULL = ilimitado',
  `usos_actuales` int(11) NOT NULL DEFAULT 0,
  `fecha_inicio` date DEFAULT NULL,
  `fecha_fin` date DEFAULT NULL,
  `aplicable_a` enum('todos','categorias','productos') NOT NULL DEFAULT 'todos',
  `categorias_ids` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'IDs de categorías si aplicable_a=categorias' CHECK (json_valid(`categorias_ids`)),
  `productos_ids` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'IDs de productos si aplicable_a=productos' CHECK (json_valid(`productos_ids`)),
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `direcciones`
--

CREATE TABLE `direcciones` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `etiqueta` varchar(100) DEFAULT NULL,
  `nombre_destinatario` varchar(255) NOT NULL,
  `telefono_destinatario` varchar(20) DEFAULT NULL,
  `pais` varchar(100) NOT NULL,
  `ciudad` varchar(100) NOT NULL,
  `estado` varchar(100) NOT NULL,
  `codigo_postal` varchar(20) NOT NULL,
  `linea_1` text NOT NULL,
  `linea_2` text DEFAULT NULL,
  `predeterminada` tinyint(1) NOT NULL DEFAULT 0,
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `facturas`
--

CREATE TABLE `facturas` (
  `id` int(11) NOT NULL,
  `numero` varchar(100) NOT NULL,
  `pedido_id` int(11) DEFAULT NULL,
  `cliente_id` int(11) NOT NULL,
  `subtotal` decimal(12,2) NOT NULL,
  `impuestos` decimal(12,2) NOT NULL DEFAULT 0.00,
  `total` decimal(12,2) NOT NULL,
  `fecha_emision` date NOT NULL,
  `fecha_vencimiento` date NOT NULL,
  `estado` enum('pendiente','pagada','vencida','cancelada','parcial') NOT NULL DEFAULT 'pendiente',
  `metodo_pago` varchar(50) DEFAULT NULL,
  `fecha_pago` date DEFAULT NULL,
  `notas` text DEFAULT NULL,
  `pdf_url` text DEFAULT NULL,
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `imagenes_producto`
--

CREATE TABLE `imagenes_producto` (
  `id` int(11) NOT NULL,
  `producto_id` int(11) NOT NULL,
  `url_imagen` text NOT NULL,
  `orden` int(11) NOT NULL DEFAULT 0,
  `es_principal` tinyint(1) NOT NULL DEFAULT 0,
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `items_pedido`
--

CREATE TABLE `items_pedido` (
  `id` int(11) NOT NULL,
  `pedido_id` int(11) NOT NULL,
  `variante_id` int(11) NOT NULL,
  `vendedor_id` int(11) NOT NULL,
  `nombre_producto` varchar(255) NOT NULL,
  `cantidad` int(11) NOT NULL CHECK (`cantidad` > 0),
  `precio_unitario` decimal(10,2) NOT NULL,
  `precio_total` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `marcas`
--

CREATE TABLE `marcas` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `url_logo` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `marcas`
--

INSERT INTO `marcas` (`id`, `nombre`, `slug`, `url_logo`) VALUES
(1, 'Krea Original', 'krea-original', NULL),
(2, 'Krea Black Label', 'krea-black-label', NULL),
(3, 'Krea Sport', 'krea-sport', NULL),
(4, 'Krea Basics', 'krea-basics', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `metodos_pago_config`
--

CREATE TABLE `metodos_pago_config` (
  `id` int(11) NOT NULL,
  `codigo` varchar(50) NOT NULL COMMENT 'mercadopago, stripe, transferencia, etc.',
  `nombre` varchar(100) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `configuracion` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'API keys, credenciales encriptadas, etc.' CHECK (json_valid(`configuracion`)),
  `comision_porcentaje` decimal(5,2) NOT NULL DEFAULT 0.00,
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  `es_default` tinyint(1) NOT NULL DEFAULT 0,
  `orden` int(11) NOT NULL DEFAULT 0,
  `imagen_url` text DEFAULT NULL,
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `metodos_pago_config`
--

INSERT INTO `metodos_pago_config` (`id`, `codigo`, `nombre`, `descripcion`, `configuracion`, `comision_porcentaje`, `activo`, `es_default`, `orden`, `imagen_url`, `creado_en`) VALUES
(1, 'mercadopago', 'Mercado Pago', 'Pago con tarjeta, efectivo o transferencia vía Mercado Pago', NULL, 4.99, 1, 0, 1, NULL, '2026-04-19 13:15:24'),
(2, 'transferencia', 'Transferencia Bancaria', 'Transferencia o depósito bancario', NULL, 0.00, 1, 0, 2, NULL, '2026-04-19 13:15:24'),
(3, 'efectivo', 'Efectivo', 'Pago en efectivo al momento de la entrega', NULL, 0.00, 1, 0, 3, NULL, '2026-04-19 13:15:24');

-- --------------------------------------------------------

--
-- Table structure for table `metodos_pago_usuario`
--

CREATE TABLE `metodos_pago_usuario` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `tipo` enum('tarjeta','transferencia','efectivo','mercadopago','stripe') NOT NULL DEFAULT 'tarjeta',
  `nombre` varchar(100) NOT NULL COMMENT 'Nombre del método (ej: Mi Tarjeta Visa)',
  `numero_tarjeta` varchar(20) DEFAULT NULL COMMENT 'Últimos 4 dígitos para tarjetas',
  `titular` varchar(255) DEFAULT NULL COMMENT 'Nombre del titular',
  `fecha_expiracion` varchar(10) DEFAULT NULL COMMENT 'MM/YY',
  `es_default` tinyint(1) NOT NULL DEFAULT 0 COMMENT '1 = método de pago predeterminado',
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  `token_pago` varchar(255) DEFAULT NULL COMMENT 'Token seguro del proveedor de pagos',
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp(),
  `actualizado_en` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `movimientos_inventario`
--

CREATE TABLE `movimientos_inventario` (
  `id` int(11) NOT NULL,
  `producto_id` int(11) NOT NULL,
  `variante_id` int(11) DEFAULT NULL,
  `tipo` enum('entrada','salida','ajuste','transferencia','devolucion') NOT NULL,
  `cantidad` int(11) NOT NULL,
  `stock_anterior` int(11) NOT NULL,
  `stock_nuevo` int(11) NOT NULL,
  `motivo` varchar(255) DEFAULT NULL,
  `referencia` varchar(255) DEFAULT NULL COMMENT 'N° orden, factura, etc.',
  `proveedor_id` int(11) DEFAULT NULL COMMENT 'Si es entrada de proveedor',
  `usuario_id` int(11) NOT NULL COMMENT 'Quien realizó el movimiento',
  `notas` text DEFAULT NULL,
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `notificaciones`
--

CREATE TABLE `notificaciones` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `tipo` varchar(50) NOT NULL,
  `titulo` varchar(255) NOT NULL,
  `mensaje` text NOT NULL,
  `leida` tinyint(1) NOT NULL DEFAULT 0,
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `password_resets`
--

CREATE TABLE `password_resets` (
  `id` int(11) NOT NULL,
  `correo` varchar(255) NOT NULL,
  `codigo` varchar(6) NOT NULL,
  `expira_en` datetime NOT NULL,
  `usado` tinyint(1) DEFAULT 0,
  `creado_en` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `password_resets`
--

INSERT INTO `password_resets` (`id`, `correo`, `codigo`, `expira_en`, `usado`, `creado_en`) VALUES
(3, 'bossmanu5656@gmail.com', '432974', '2026-05-04 15:17:46', 0, '2026-05-04 09:02:46');

-- --------------------------------------------------------

--
-- Table structure for table `pedidos`
--

CREATE TABLE `pedidos` (
  `id` int(11) NOT NULL,
  `numero_pedido` varchar(100) NOT NULL,
  `cliente_id` int(11) NOT NULL,
  `direccion_envio_id` int(11) DEFAULT NULL,
  `estado` varchar(50) NOT NULL DEFAULT 'pendiente',
  `subtotal` decimal(12,2) NOT NULL,
  `total` decimal(12,2) NOT NULL,
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `perfiles_vendedor`
--

CREATE TABLE `perfiles_vendedor` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `url_logo` text DEFAULT NULL,
  `url_banner` text DEFAULT NULL,
  `instagram` varchar(100) DEFAULT NULL,
  `tiktok` varchar(100) DEFAULT NULL,
  `verificado` tinyint(1) NOT NULL DEFAULT 0,
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  `tasa_comision` decimal(5,2) NOT NULL DEFAULT 10.00,
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `perfiles_vendedor`
--

INSERT INTO `perfiles_vendedor` (`id`, `usuario_id`, `descripcion`, `url_logo`, `url_banner`, `instagram`, `tiktok`, `verificado`, `activo`, `tasa_comision`, `creado_en`) VALUES
(1, 2, 'Cuenta oficial de Krea Streetwear. Diseñamos streetwear premium para creadores.', './images/logo/Krea-blanco-sinfondo.png', NULL, '@krea.studio', '@krea.studio', 1, 1, 0.00, '2026-04-19 01:53:40');

-- --------------------------------------------------------

--
-- Table structure for table `productos`
--

CREATE TABLE `productos` (
  `id` int(11) NOT NULL,
  `vendedor_id` int(11) NOT NULL,
  `categoria_id` int(11) DEFAULT NULL,
  `marca_id` int(11) DEFAULT NULL,
  `nombre` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `material` varchar(255) DEFAULT NULL,
  `costo` decimal(10,2) DEFAULT 0.00,
  `precio_base` decimal(10,2) NOT NULL CHECK (`precio_base` >= 0),
  `precio_comparacion` decimal(10,2) DEFAULT NULL,
  `estado` varchar(50) NOT NULL DEFAULT 'borrador' COMMENT 'Valores: borrador, publicado, pausado, agotado',
  `destacado` tinyint(1) NOT NULL DEFAULT 0,
  `nuevo` tinyint(1) NOT NULL DEFAULT 1,
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp(),
  `publicado_en` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `productos`
--

INSERT INTO `productos` (`id`, `vendedor_id`, `categoria_id`, `marca_id`, `nombre`, `slug`, `descripcion`, `material`, `costo`, `precio_base`, `precio_comparacion`, `estado`, `destacado`, `nuevo`, `creado_en`, `publicado_en`) VALUES
(5, 1, 1, 1, 'Camiseta Krea Logo Classic', 'camiseta-krea-logo-classic', 'La camiseta clasica con nuestro logo emblematico. Algodon 100% organico.', NULL, 0.00, 35.00, 45.00, 'publicado', 1, 1, '2026-05-04 15:28:04', NULL),
(6, 1, 1, 1, 'Camiseta Krea Vintage Wash', 'camiseta-krea-vintage-wash', 'Camiseta con lavado vintage y efecto desgastado. Tejido suave.', NULL, 0.00, 42.00, 55.00, 'publicado', 1, 1, '2026-05-04 15:28:04', NULL),
(7, 1, 1, 2, 'Camiseta Graffiti Art', 'camiseta-graffiti-art', 'Colaboracion con artistas locales. Arte urbano serigrafiado.', NULL, 0.00, 48.00, 65.00, 'publicado', 1, 1, '2026-05-04 15:28:04', NULL),
(8, 1, 1, 4, 'Camiseta Basic White 3-Pack', 'camiseta-basic-white-3-pack', 'Pack de 3 camisetas blancas basicas.', NULL, 0.00, 75.00, 100.00, 'publicado', 0, 1, '2026-05-04 15:28:04', NULL),
(9, 1, 2, 1, 'Hoodie Krea Classic Black', 'hoodie-krea-classic-black', 'El hoodie clasico en negro. Interior cepillado ultra suave.', NULL, 0.00, 75.00, 95.00, 'publicado', 1, 1, '2026-05-04 15:28:04', NULL),
(10, 1, 2, 1, 'Hoodie Oversized Beige', 'hoodie-oversized-beige', 'Corte oversized extremo en tono beige.', NULL, 0.00, 85.00, 110.00, 'publicado', 1, 1, '2026-05-04 15:28:04', NULL),
(11, 1, 2, 2, 'Hoodie Tech Zip Grey', 'hoodie-tech-zip-grey', 'Hoodie con cierre tecnico y detalles reflectantes.', NULL, 0.00, 95.00, 120.00, 'publicado', 1, 1, '2026-05-04 15:28:04', NULL),
(12, 1, 2, 3, 'Hoodie Heavyweight Winter', 'hoodie-heavyweight-winter', 'Tejido pesado 450gsm para invierno.', NULL, 0.00, 110.00, 140.00, 'publicado', 1, 1, '2026-05-04 15:28:04', NULL),
(13, 1, 3, 1, 'Cargo Pants Utility Black', 'cargo-pants-utility-black', 'Pantalones cargo multi-bolsillo en negro.', NULL, 0.00, 85.00, 110.00, 'publicado', 1, 1, '2026-05-04 15:28:04', NULL),
(14, 1, 3, 2, 'Joggers Tech Fleece Grey', 'joggers-tech-fleece-grey', 'Joggers de tech fleece. Corte conico moderno.', NULL, 0.00, 72.00, 95.00, 'publicado', 1, 1, '2026-05-04 15:28:04', NULL),
(15, 1, 3, 2, 'Jeans Baggy Vintage', 'jeans-baggy-vintage', 'Jeans baggy estilo anos 90. Lavado vintage.', NULL, 0.00, 95.00, 120.00, 'publicado', 1, 1, '2026-05-04 15:28:04', NULL),
(16, 1, 4, 1, 'Bomber Jacket Classic', 'bomber-jacket-classic', 'La chaqueta bomber atemporal. Nylon resistente.', NULL, 0.00, 120.00, 150.00, 'publicado', 1, 1, '2026-05-04 15:28:04', NULL),
(17, 1, 4, 2, 'Chaqueta Denim Oversized', 'chaqueta-denim-oversized', 'Cazadora vaquera oversized. Lavado medio.', NULL, 0.00, 135.00, 170.00, 'publicado', 1, 1, '2026-05-04 15:28:04', NULL),
(18, 1, 4, 2, 'Chaqueta Sherpa Fleece', 'chaqueta-sherpa-fleece', 'Polar sherpa reversible. Dos looks en uno.', NULL, 0.00, 145.00, 180.00, 'publicado', 1, 1, '2026-05-04 15:28:04', NULL),
(19, 1, 5, 1, 'Gorra Dad Hat Classic', 'gorra-dad-hat-classic', 'Gorra estilo dad hat. Logo bordado.', NULL, 0.00, 28.00, 35.00, 'publicado', 1, 1, '2026-05-04 15:28:04', NULL),
(20, 1, 5, 1, 'Bucket Hat Reversible', 'bucket-hat-reversible', 'Sombrero bucket reversible. Dos colores.', NULL, 0.00, 35.00, 45.00, 'publicado', 1, 1, '2026-05-04 15:28:04', NULL),
(21, 1, 5, 2, 'Mochila Urban Tech', 'mochila-urban-tech', 'Mochila urbana con compartimento laptop.', NULL, 0.00, 75.00, 95.00, 'publicado', 1, 1, '2026-05-04 15:28:04', NULL),
(22, 1, 6, 1, 'Zapatillas Krea Runner', 'zapatillas-krea-runner', 'Nuestras zapatillas signature. Amortiguacion reactiva.', NULL, 0.00, 120.00, 150.00, 'publicado', 1, 1, '2026-05-04 15:28:04', NULL),
(23, 1, 6, 2, 'Chunky Sneakers Bold', 'chunky-sneakers-bold', 'Suela chunky voluminosa. Estilo retro-futurista.', NULL, 0.00, 135.00, 170.00, 'publicado', 1, 1, '2026-05-04 15:28:04', NULL),
(24, 1, 6, 1, 'Botas Work Boot', 'botas-work-boot', 'Botas estilo militar robustas. Cuero engrasado.', NULL, 0.00, 145.00, 180.00, 'publicado', 1, 1, '2026-05-04 15:28:04', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `proveedores`
--

CREATE TABLE `proveedores` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `contacto_nombre` varchar(255) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `direccion` text DEFAULT NULL,
  `condiciones_pago` enum('contado','15_dias','30_dias','60_dias','90_dias') NOT NULL DEFAULT '30_dias',
  `descuento_porcentaje` decimal(5,2) NOT NULL DEFAULT 0.00,
  `notas` text DEFAULT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `reseñas`
--

CREATE TABLE `reseñas` (
  `id` int(11) NOT NULL,
  `producto_id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `calificacion` int(11) NOT NULL CHECK (`calificacion` between 1 and 5),
  `comentario` text NOT NULL,
  `aprobada` tinyint(1) NOT NULL DEFAULT 0,
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `reseñas`
--

INSERT INTO `reseñas` (`id`, `producto_id`, `usuario_id`, `calificacion`, `comentario`, `aprobada`, `creado_en`) VALUES
(1, 5, 1, 5, 'me gusto', 1, '2026-05-05 01:22:45'),
(2, 14, 1, 2, 'no me gusto', 1, '2026-05-07 02:40:14');

-- --------------------------------------------------------

--
-- Table structure for table `transacciones_financieras`
--

CREATE TABLE `transacciones_financieras` (
  `id` int(11) NOT NULL,
  `tipo` enum('ingreso','egreso') NOT NULL,
  `categoria` enum('ventas','compras_inventario','gastos_operativos','marketing','salarios','servicios','impuestos','otros') NOT NULL,
  `concepto` varchar(255) NOT NULL,
  `monto` decimal(12,2) NOT NULL,
  `fecha` date NOT NULL,
  `metodo_pago` enum('efectivo','transferencia','tarjeta','deposito','cheque','mercadopago','otro') NOT NULL,
  `referencia` varchar(255) DEFAULT NULL,
  `pedido_id` int(11) DEFAULT NULL COMMENT 'Si está relacionado a un pedido',
  `proveedor_id` int(11) DEFAULT NULL COMMENT 'Si es pago a proveedor',
  `notas` text DEFAULT NULL,
  `comprobante_url` text DEFAULT NULL COMMENT 'URL del comprobante escaneado',
  `estado` enum('confirmado','pendiente','cancelado') NOT NULL DEFAULT 'confirmado',
  `creado_por` int(11) NOT NULL,
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `correo` varchar(255) NOT NULL,
  `contrasena_hash` text NOT NULL,
  `rol` varchar(50) NOT NULL DEFAULT 'cliente',
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(100) NOT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `url_avatar` text DEFAULT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `usuarios`
--

INSERT INTO `usuarios` (`id`, `correo`, `contrasena_hash`, `rol`, `nombre`, `apellido`, `telefono`, `url_avatar`, `activo`, `creado_en`) VALUES
(1, 'bossmanu5656@gmail.com', '$2y$10$8YMIR5EVmIh4uAf1J4HldewxSkF8sMtcW2R9Zgmx6TjU1kDBqFU1a', 'cliente', 'Manuel', 'Castillo', '8097506092', NULL, 1, '2026-04-19 01:10:59'),
(2, 'admin@krea.studio', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 'Administrador', 'Krea', '+52 55 1234 5678', NULL, 1, '2026-04-19 01:53:40');

-- --------------------------------------------------------

--
-- Table structure for table `variantes_producto`
--

CREATE TABLE `variantes_producto` (
  `id` int(11) NOT NULL,
  `producto_id` int(11) NOT NULL,
  `sku` varchar(100) NOT NULL,
  `precio_adicional` decimal(10,2) NOT NULL DEFAULT 0.00,
  `stock` int(11) NOT NULL DEFAULT 0 CHECK (`stock` >= 0),
  `stock_minimo` int(11) NOT NULL DEFAULT 5,
  `activa` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `vendedores_comisiones`
--

CREATE TABLE `vendedores_comisiones` (
  `id` int(11) NOT NULL,
  `vendedor_id` int(11) NOT NULL,
  `pedido_id` int(11) NOT NULL,
  `monto_venta` decimal(12,2) NOT NULL,
  `porcentaje_comision` decimal(5,2) NOT NULL,
  `monto_comision` decimal(12,2) NOT NULL,
  `estado` enum('pendiente','pagada','cancelada') NOT NULL DEFAULT 'pendiente',
  `fecha_pago` date DEFAULT NULL,
  `notas` text DEFAULT NULL,
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `atributos_variante`
--
ALTER TABLE `atributos_variante`
  ADD PRIMARY KEY (`id`),
  ADD KEY `variante_id` (`variante_id`);

--
-- Indexes for table `banners`
--
ALTER TABLE `banners`
  ADD PRIMARY KEY (`id`),
  ADD KEY `posicion` (`posicion`),
  ADD KEY `activo` (`activo`),
  ADD KEY `orden` (`orden`);

--
-- Indexes for table `campanas_email`
--
ALTER TABLE `campanas_email`
  ADD PRIMARY KEY (`id`),
  ADD KEY `estado` (`estado`),
  ADD KEY `fecha_envio` (`fecha_envio`);

--
-- Indexes for table `carrito`
--
ALTER TABLE `carrito`
  ADD PRIMARY KEY (`id`),
  ADD KEY `usuario_id` (`usuario_id`),
  ADD KEY `producto_id` (`producto_id`);

--
-- Indexes for table `categorias`
--
ALTER TABLE `categorias`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `padre_id` (`padre_id`);

--
-- Indexes for table `configuracion_sistema`
--
ALTER TABLE `configuracion_sistema`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `grupo_clave` (`grupo`,`clave`),
  ADD KEY `grupo` (`grupo`);

--
-- Indexes for table `cupones`
--
ALTER TABLE `cupones`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `codigo` (`codigo`),
  ADD KEY `activo` (`activo`),
  ADD KEY `fecha_fin` (`fecha_fin`);

--
-- Indexes for table `direcciones`
--
ALTER TABLE `direcciones`
  ADD PRIMARY KEY (`id`),
  ADD KEY `usuario_id` (`usuario_id`);

--
-- Indexes for table `facturas`
--
ALTER TABLE `facturas`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `numero` (`numero`),
  ADD KEY `estado` (`estado`),
  ADD KEY `fecha_vencimiento` (`fecha_vencimiento`),
  ADD KEY `cliente_id` (`cliente_id`),
  ADD KEY `facturas_pedido_fk` (`pedido_id`);

--
-- Indexes for table `imagenes_producto`
--
ALTER TABLE `imagenes_producto`
  ADD PRIMARY KEY (`id`),
  ADD KEY `producto_id` (`producto_id`);

--
-- Indexes for table `items_pedido`
--
ALTER TABLE `items_pedido`
  ADD PRIMARY KEY (`id`),
  ADD KEY `pedido_id` (`pedido_id`),
  ADD KEY `variante_id` (`variante_id`),
  ADD KEY `vendedor_id` (`vendedor_id`);

--
-- Indexes for table `marcas`
--
ALTER TABLE `marcas`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nombre` (`nombre`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- Indexes for table `metodos_pago_config`
--
ALTER TABLE `metodos_pago_config`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `codigo` (`codigo`);

--
-- Indexes for table `metodos_pago_usuario`
--
ALTER TABLE `metodos_pago_usuario`
  ADD PRIMARY KEY (`id`),
  ADD KEY `usuario_id` (`usuario_id`),
  ADD KEY `tipo` (`tipo`);

--
-- Indexes for table `movimientos_inventario`
--
ALTER TABLE `movimientos_inventario`
  ADD PRIMARY KEY (`id`),
  ADD KEY `producto_id` (`producto_id`),
  ADD KEY `variante_id` (`variante_id`),
  ADD KEY `tipo` (`tipo`),
  ADD KEY `creado_en` (`creado_en`),
  ADD KEY `proveedor_id` (`proveedor_id`),
  ADD KEY `usuario_id` (`usuario_id`);

--
-- Indexes for table `notificaciones`
--
ALTER TABLE `notificaciones`
  ADD PRIMARY KEY (`id`),
  ADD KEY `usuario_id` (`usuario_id`);

--
-- Indexes for table `password_resets`
--
ALTER TABLE `password_resets`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_correo` (`correo`),
  ADD KEY `idx_codigo` (`codigo`),
  ADD KEY `idx_expira` (`expira_en`);

--
-- Indexes for table `pedidos`
--
ALTER TABLE `pedidos`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `numero_pedido` (`numero_pedido`),
  ADD KEY `cliente_id` (`cliente_id`),
  ADD KEY `direccion_envio_id` (`direccion_envio_id`);

--
-- Indexes for table `perfiles_vendedor`
--
ALTER TABLE `perfiles_vendedor`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `usuario_id` (`usuario_id`);

--
-- Indexes for table `productos`
--
ALTER TABLE `productos`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `vendedor_id` (`vendedor_id`,`slug`),
  ADD KEY `categoria_id` (`categoria_id`),
  ADD KEY `marca_id` (`marca_id`);

--
-- Indexes for table `proveedores`
--
ALTER TABLE `proveedores`
  ADD PRIMARY KEY (`id`),
  ADD KEY `activo` (`activo`);

--
-- Indexes for table `reseñas`
--
ALTER TABLE `reseñas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `producto_id` (`producto_id`),
  ADD KEY `usuario_id` (`usuario_id`);

--
-- Indexes for table `transacciones_financieras`
--
ALTER TABLE `transacciones_financieras`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tipo` (`tipo`),
  ADD KEY `categoria` (`categoria`),
  ADD KEY `fecha` (`fecha`),
  ADD KEY `pedido_id` (`pedido_id`),
  ADD KEY `proveedor_id` (`proveedor_id`),
  ADD KEY `creado_por` (`creado_por`);

--
-- Table structure for table `diseños_usuario`
--

CREATE TABLE `diseños_usuario` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `tipo_prenda` varchar(50) DEFAULT NULL,
  `imagen_url` text DEFAULT NULL,
  `datos_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'Datos del diseño en formato JSON',
  `estado` varchar(50) DEFAULT 'borrador' COMMENT 'borrador, publicado, archivado',
  `precio` decimal(10,2) DEFAULT 0.00,
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp(),
  `actualizado_en` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for table `diseños_usuario`
--
ALTER TABLE `diseños_usuario`
  ADD PRIMARY KEY (`id`),
  ADD KEY `usuario_id` (`usuario_id`),
  ADD KEY `estado` (`estado`),
  ADD KEY `creado_en` (`creado_en`);

--
-- Indexes for table `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `correo` (`correo`);

--
-- Indexes for table `variantes_producto`
--
ALTER TABLE `variantes_producto`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `sku` (`sku`),
  ADD KEY `producto_id` (`producto_id`);

--
-- Indexes for table `vendedores_comisiones`
--
ALTER TABLE `vendedores_comisiones`
  ADD PRIMARY KEY (`id`),
  ADD KEY `vendedor_id` (`vendedor_id`),
  ADD KEY `pedido_id` (`pedido_id`),
  ADD KEY `estado` (`estado`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `atributos_variante`
--
ALTER TABLE `atributos_variante`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `banners`
--
ALTER TABLE `banners`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `campanas_email`
--
ALTER TABLE `campanas_email`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `carrito`
--
ALTER TABLE `carrito`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `categorias`
--
ALTER TABLE `categorias`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `configuracion_sistema`
--
ALTER TABLE `configuracion_sistema`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT for table `cupones`
--
ALTER TABLE `cupones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `direcciones`
--
ALTER TABLE `direcciones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `facturas`
--
ALTER TABLE `facturas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `imagenes_producto`
--
ALTER TABLE `imagenes_producto`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `items_pedido`
--
ALTER TABLE `items_pedido`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `marcas`
--
ALTER TABLE `marcas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `metodos_pago_config`
--
ALTER TABLE `metodos_pago_config`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `metodos_pago_usuario`
--
ALTER TABLE `metodos_pago_usuario`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `movimientos_inventario`
--
ALTER TABLE `movimientos_inventario`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `notificaciones`
--
ALTER TABLE `notificaciones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `password_resets`
--
ALTER TABLE `password_resets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `pedidos`
--
ALTER TABLE `pedidos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `perfiles_vendedor`
--
ALTER TABLE `perfiles_vendedor`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `productos`
--
ALTER TABLE `productos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `proveedores`
--
ALTER TABLE `proveedores`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `reseñas`
--
ALTER TABLE `reseñas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `transacciones_financieras`
--
ALTER TABLE `transacciones_financieras`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `variantes_producto`
--
ALTER TABLE `variantes_producto`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `vendedores_comisiones`
--
ALTER TABLE `vendedores_comisiones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `atributos_variante`
--
ALTER TABLE `atributos_variante`
  ADD CONSTRAINT `atributos_variante_fk` FOREIGN KEY (`variante_id`) REFERENCES `variantes_producto` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `categorias`
--
ALTER TABLE `categorias`
  ADD CONSTRAINT `categorias_ibfk_1` FOREIGN KEY (`padre_id`) REFERENCES `categorias` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `direcciones`
--
ALTER TABLE `direcciones`
  ADD CONSTRAINT `direcciones_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `facturas`
--
ALTER TABLE `facturas`
  ADD CONSTRAINT `facturas_cliente_fk` FOREIGN KEY (`cliente_id`) REFERENCES `usuarios` (`id`),
  ADD CONSTRAINT `facturas_pedido_fk` FOREIGN KEY (`pedido_id`) REFERENCES `pedidos` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `imagenes_producto`
--
ALTER TABLE `imagenes_producto`
  ADD CONSTRAINT `imagenes_producto_fk` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `items_pedido`
--
ALTER TABLE `items_pedido`
  ADD CONSTRAINT `items_pedido_ibfk_1` FOREIGN KEY (`pedido_id`) REFERENCES `pedidos` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `items_pedido_ibfk_2` FOREIGN KEY (`variante_id`) REFERENCES `variantes_producto` (`id`),
  ADD CONSTRAINT `items_pedido_ibfk_3` FOREIGN KEY (`vendedor_id`) REFERENCES `perfiles_vendedor` (`id`);

--
-- Constraints for table `metodos_pago_usuario`
--
ALTER TABLE `metodos_pago_usuario`
  ADD CONSTRAINT `metodos_pago_usuario_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `movimientos_inventario`
--
ALTER TABLE `movimientos_inventario`
  ADD CONSTRAINT `movimientos_inv_prod_fk` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `movimientos_inv_prov_fk` FOREIGN KEY (`proveedor_id`) REFERENCES `proveedores` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `movimientos_inv_user_fk` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`),
  ADD CONSTRAINT `movimientos_inv_var_fk` FOREIGN KEY (`variante_id`) REFERENCES `variantes_producto` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `notificaciones`
--
ALTER TABLE `notificaciones`
  ADD CONSTRAINT `notificaciones_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `pedidos`
--
ALTER TABLE `pedidos`
  ADD CONSTRAINT `pedidos_ibfk_1` FOREIGN KEY (`cliente_id`) REFERENCES `usuarios` (`id`),
  ADD CONSTRAINT `pedidos_ibfk_2` FOREIGN KEY (`direccion_envio_id`) REFERENCES `direcciones` (`id`);

--
-- Constraints for table `perfiles_vendedor`
--
ALTER TABLE `perfiles_vendedor`
  ADD CONSTRAINT `perfiles_vendedor_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `productos`
--
ALTER TABLE `productos`
  ADD CONSTRAINT `productos_ibfk_1` FOREIGN KEY (`vendedor_id`) REFERENCES `perfiles_vendedor` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `productos_ibfk_2` FOREIGN KEY (`categoria_id`) REFERENCES `categorias` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `productos_ibfk_3` FOREIGN KEY (`marca_id`) REFERENCES `marcas` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `transacciones_financieras`
--
ALTER TABLE `transacciones_financieras`
  ADD CONSTRAINT `transacciones_pedido_fk` FOREIGN KEY (`pedido_id`) REFERENCES `pedidos` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `transacciones_prov_fk` FOREIGN KEY (`proveedor_id`) REFERENCES `proveedores` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `transacciones_user_fk` FOREIGN KEY (`creado_por`) REFERENCES `usuarios` (`id`);

--
-- Constraints for table `variantes_producto`
--
ALTER TABLE `variantes_producto`
  ADD CONSTRAINT `variantes_producto_ibfk_1` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `vendedores_comisiones`
--
ALTER TABLE `vendedores_comisiones`
  ADD CONSTRAINT `comisiones_pedido_fk` FOREIGN KEY (`pedido_id`) REFERENCES `pedidos` (`id`),
  ADD CONSTRAINT `comisiones_vendedor_fk` FOREIGN KEY (`vendedor_id`) REFERENCES `perfiles_vendedor` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
