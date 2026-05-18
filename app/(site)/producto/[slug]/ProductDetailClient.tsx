"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import MobileWarning from "@/components/MobileWarning";

interface Producto {
  id: number;
  nombre: string;
  slug: string;
  descripcion: string;
  precio_base: number;
  precio_comparacion: number;
  categoria_nombre: string;
  marca_nombre: string;
  sku: string;
  peso: number;
  categoria_id: number;
}

interface Variante {
  id: number;
  atributos: string;
  stock: number;
}

interface ImagenProd {
  url_imagen: string;
}

interface Resena {
  id: number;
  usuario_nombre: string;
  calificacion: number;
  comentario: string;
  creado_en: string;
}

interface Props {
  producto: Producto;
  variantes: Variante[];
  imagenes: ImagenProd[];
  resenas: Resena[];
  canReview: boolean;
  isLoggedIn: boolean;
  userRol: string;
}

export default function ProductDetailClient({
  producto,
  variantes,
  imagenes,
  resenas: initialResenas,
  canReview: initialCanReview,
  isLoggedIn,
  userRol,
}: Props) {
  const [mainImage, setMainImage] = useState(
    `/images/products/${producto.slug}.jpg`,
  );
  const [cantidad, setCantidad] = useState(1);
  const [selectedTalla, setSelectedTalla] = useState("");
  const [addingToCart, setAddingToCart] = useState(false);
  const [cartMsg, setCartMsg] = useState("");
  const router = useRouter();
  const [canReview, setCanReview] = useState(initialCanReview);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewMsg, setReviewMsg] = useState("");
  const [resenas, setResenas] = useState(initialResenas);

  const tallas: string[] = [];
  variantes.forEach((v) => {
    if (v.atributos) {
      v.atributos.split(",").forEach((attr) => {
        if (
          "XS,S,M,L,XL,XXL".split(",").includes(attr) &&
          !tallas.includes(attr)
        ) {
          tallas.push(attr);
        }
      });
    }
  });

  const ratingPromedio =
    resenas.length > 0
      ? Math.round(
          (resenas.reduce((s, r) => s + r.calificacion, 0) / resenas.length) *
            10,
        ) / 10
      : 0;

  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      setCartMsg("Inicia sesión para agregar al carrito.");
      return;
    }
    setAddingToCart(true);
    setCartMsg("");
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          producto_id: producto.id,
          cantidad,
          talla: selectedTalla || null,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setCartMsg("¡Agregado al carrito!");
        window.dispatchEvent(new Event("cart-updated"));
      } else {
        setCartMsg(data.error || "Error al agregar.");
      }
    } catch {
      setCartMsg("Error de conexión.");
    } finally {
      setAddingToCart(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!reviewComment.trim()) {
      setReviewMsg("Escribe un comentario.");
      return;
    }
    setReviewLoading(true);
    setReviewMsg("");
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          producto_id: producto.id,
          calificacion: reviewRating,
          comentario: reviewComment.trim(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setReviewMsg("¡Reseña enviada! Será visible tras aprobación.");
        setCanReview(false);
        setReviewComment("");
        setReviewRating(5);
        fetch(`/api/products/${producto.slug}`)
          .then((r) => r.json())
          .then((d) => {
            if (d.resenas) setResenas(d.resenas);
          })
          .catch(() => {});
      } else {
        setReviewMsg(data.error || "Error al enviar reseña.");
      }
    } catch {
      setReviewMsg("Error de conexión.");
    } finally {
      setReviewLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <MobileWarning />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-[1200px] mx-auto px-[5%] pt-[120px] pb-10">
        {/* Gallery */}
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden bg-[#1a1a1a] border border-[#2a2a2a]">
            <Image
              src={mainImage}
              alt={producto.nombre}
              width={600}
              height={600}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.opacity = "0";
              }}
              priority
            />
          </div>
          {imagenes.length > 1 && (
            <div className="flex gap-3">
              {imagenes.map((img, idx) => (
                <div
                  key={idx}
                  className={`w-20 h-20 border overflow-hidden cursor-pointer transition-all hover:border-[#888] ${
                    mainImage === img.url_imagen
                      ? "border-[#ffffff]"
                      : "border-[#2a2a2a]"
                  }`}
                  onClick={() => setMainImage(img.url_imagen)}
                >
                  <Image
                    src={img.url_imagen}
                    alt=""
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-sm text-[#888]">
            {producto.categoria_nombre && (
              <>
                <span>{producto.categoria_nombre}</span>
                <span>•</span>
              </>
            )}
            <div className="flex items-center gap-1">
              <span className="text-[#ffffff]">
                {"★".repeat(Math.floor(ratingPromedio))}
              </span>
              <span>
                {ratingPromedio} ({resenas.length} reseñas)
              </span>
            </div>
          </div>

          <h1 className="font-[family-name:var(--font-heading)] text-3xl font-semibold">
            {producto.nombre}
          </h1>

          <div className="text-3xl font-semibold text-[#ffffff]">
            ${Number(producto.precio_base).toFixed(2)}
            {producto.precio_comparacion > producto.precio_base && (
              <span className="text-[#888] line-through text-lg ml-3">
                ${Number(producto.precio_comparacion).toFixed(2)}
              </span>
            )}
          </div>

          <div className="space-y-2 text-[#888] leading-relaxed">
            {producto.descripcion?.split("\n").map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>

          {/* Size Selector */}
          {tallas.length > 0 && (
            <div className="space-y-2">
              <label className="block text-xs uppercase tracking-[1.5px] text-[#888] font-[family-name:var(--font-heading)]">
                Talla
              </label>
              <div className="flex flex-wrap gap-2">
                {tallas.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setSelectedTalla(t)}
                    className={`w-12 h-12 border bg-[#1a1a1a] text-[#f5f5f5] font-[family-name:var(--font-heading)] text-sm transition-all hover:border-[#888] ${
                      selectedTalla === t
                        ? "border-[#ffffff] text-[#ffffff]"
                        : "border-[#2a2a2a]"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="flex items-center gap-4">
            <label className="text-xs uppercase tracking-[1.5px] text-[#888] font-[family-name:var(--font-heading)]">
              Cantidad
            </label>
            <div className="flex items-center border border-[#2a2a2a]">
              <button
                type="button"
                onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                className="w-10 h-10 bg-transparent border-none text-[#f5f5f5] text-lg hover:bg-[#1a1a1a] transition-colors"
              >
                −
              </button>
              <input
                type="number"
                value={cantidad}
                readOnly
                className="w-12 h-10 bg-transparent border-none text-center text-[#f5f5f5] font-[family-name:var(--font-heading)] [appearance:none]"
              />
              <button
                type="button"
                onClick={() => setCantidad(Math.min(10, cantidad + 1))}
                className="w-10 h-10 bg-transparent border-none text-[#f5f5f5] text-lg hover:bg-[#1a1a1a] transition-colors"
              >
                +
              </button>
            </div>
          </div>

          {userRol === "admin" ? (
            <div className="w-full text-center border border-[#555] text-[#555] py-4 text-[0.75rem] uppercase tracking-[2px] font-[family-name:var(--font-heading)] font-semibold rounded cursor-not-allowed">
              Solo clientes
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={addingToCart}
                className="w-full bg-[#ffffff] text-[#0a0a0a] py-4 text-[0.75rem] uppercase tracking-[2px] font-[family-name:var(--font-heading)] font-semibold transition-all hover:bg-[#d4d4d4] disabled:opacity-50"
              >
                {addingToCart ? "Agregando..." : "Agregar al Carrito"}
              </button>
              <button
                type="button"
                onClick={() => router.push(`/checkout/${producto.slug}`)}
                className="w-full border border-[#ffffff] text-[#ffffff] py-4 text-[0.75rem] uppercase tracking-[2px] font-[family-name:var(--font-heading)] font-semibold transition-all hover:bg-[#ffffff] hover:text-[#0a0a0a] bg-transparent"
              >
                Comprar Ahora
              </button>
            </div>
          )}

          {cartMsg && (
            <p
              className={`mt-2 text-sm ${cartMsg.includes("Error") || cartMsg.includes("Inicia") ? "text-red-400" : "text-green-400"}`}
            >
              {cartMsg}
            </p>
          )}

          {/* Details */}
          <div className="border-t border-[#2a2a2a] pt-6 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-[#888]">SKU</span>
              <span>{producto.sku || "N/A"}</span>
            </div>
            {producto.marca_nombre && (
              <div className="flex justify-between text-sm">
                <span className="text-[#888]">Marca</span>
                <span>{producto.marca_nombre}</span>
              </div>
            )}
            {producto.peso > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-[#888]">Peso</span>
                <span>{producto.peso} kg</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reviews */}
      <section className="max-w-[1200px] mx-auto px-[5%] py-16 border-t border-[#2a2a2a]">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
          <div className="flex items-center gap-4">
            <span className="text-6xl font-semibold text-[#ffffff]">
              {ratingPromedio}
            </span>
            <div>
              <div className="text-[#ffffff] text-2xl">
                {"★".repeat(Math.floor(ratingPromedio))}
              </div>
              <p className="text-[#888] text-sm">
                Basado en {resenas.length} reseñas
              </p>
            </div>
          </div>
          <h2 className="font-[family-name:var(--font-heading)] text-2xl font-semibold">
            Reseñas de Clientes
          </h2>
        </div>

        {/* Review Form */}
        <div className="bg-[#141414] border border-[#2a2a2a] p-6 mb-8">
          <h3 className="font-[family-name:var(--font-heading)] text-lg mb-4">
            Escribe tu reseña
          </h3>
          {!isLoggedIn ? (
            <div className="text-center py-4">
              <p className="text-[#888] mb-4">
                Inicia sesión para compartir tu experiencia con este producto.
              </p>
              <Link
                href="/login"
                className="inline-block bg-[#ffffff] text-[#0a0a0a] px-8 py-3 text-[0.75rem] uppercase tracking-[2px] font-[family-name:var(--font-heading)] font-semibold transition-all hover:bg-[#d4d4d4]"
              >
                Iniciar Sesión
              </Link>
            </div>
          ) : !canReview ? (
            <div className="text-center py-4">
              <p className="text-[#888]">
                Solo los clientes que han comprado este producto pueden dejar
                una reseña.
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewRating(star)}
                    className="text-2xl bg-transparent border-none transition-colors cursor-pointer"
                    aria-label={`Calificar ${star} estrellas`}
                  >
                    <span
                      className={
                        star <= reviewRating ? "text-[#ffffff]" : "text-[#444]"
                      }
                    >
                      ★
                    </span>
                  </button>
                ))}
              </div>
              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Comparte tu experiencia con este producto..."
                rows={4}
                className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#2a2a2a] text-[#f5f5f5] text-sm rounded focus:outline-none focus:border-[#888] resize-none mb-4"
              />
              <button
                type="button"
                onClick={handleSubmitReview}
                disabled={reviewLoading}
                className="bg-[#ffffff] text-[#0a0a0a] px-8 py-3 text-[0.75rem] uppercase tracking-[2px] font-[family-name:var(--font-heading)] font-semibold transition-all hover:bg-[#d4d4d4] disabled:opacity-50 cursor-pointer"
              >
                {reviewLoading ? "Enviando..." : "Enviar Reseña"}
              </button>
              {reviewMsg && (
                <p
                  className={`mt-3 text-sm ${reviewMsg.includes("Error") || reviewMsg.includes("Escribe") ? "text-red-400" : "text-green-400"}`}
                >
                  {reviewMsg}
                </p>
              )}
            </>
          )}
        </div>

        <div>
          {resenas.length > 0 ? (
            resenas.map((r) => (
              <div
                key={r.id}
                className="bg-[#141414] border border-[#2a2a2a] p-6 mb-4"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#ffffff] text-[#0a0a0a] flex items-center justify-center font-semibold">
                      {r.usuario_nombre?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium">{r.usuario_nombre}</div>
                      <div className="text-[#ffffff]">
                        {"★".repeat(r.calificacion)}
                      </div>
                    </div>
                  </div>
                  <span className="text-sm text-[#888]">
                    {new Date(r.creado_en).toLocaleDateString("es-MX")}
                  </span>
                </div>
                <p className="text-[#888] leading-relaxed">{r.comentario}</p>
              </div>
            ))
          ) : (
            <p className="text-[#888] text-center py-12">No hay reseñas aún.</p>
          )}
        </div>
      </section>
    </div>
  );
}
