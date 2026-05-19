import { notFound } from "next/navigation";
import { getCurrentUser } from "@/app/lib/session";
import { getProductBySlug } from "@/app/lib/products";
import { canUserReview } from "@/app/lib/reviews";
import ProductDetailClient from "./ProductDetailClient";

export default async function ProductoDetallePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const { producto, variantes, imagenes, resenas, secciones } =
    await getProductBySlug(slug);

  if (!producto) {
    notFound();
  }

  const user = await getCurrentUser();
  const canReview = await canUserReview(
    Number(producto.id),
    user?.userId ?? undefined,
  );

  return (
    <ProductDetailClient
      producto={
        producto as unknown as React.ComponentProps<
          typeof ProductDetailClient
        >["producto"]
      }
      variantes={
        variantes as unknown as React.ComponentProps<
          typeof ProductDetailClient
        >["variantes"]
      }
      imagenes={
        imagenes as unknown as React.ComponentProps<
          typeof ProductDetailClient
        >["imagenes"]
      }
      resenas={
        resenas as unknown as React.ComponentProps<
          typeof ProductDetailClient
        >["resenas"]
      }
      secciones={
        secciones as unknown as React.ComponentProps<
          typeof ProductDetailClient
        >["secciones"]
      }
      canReview={canReview}
      isLoggedIn={!!user?.userId}
      userRol={user?.rol || ""}
    />
  );
}
