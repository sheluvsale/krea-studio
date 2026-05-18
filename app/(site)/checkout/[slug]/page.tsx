import { notFound } from "next/navigation";
import { getCurrentUser } from "@/app/lib/session";
import { getProductBySlug } from "@/app/lib/products";
import CheckoutClient from "./CheckoutClient";

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { producto, variantes } = await getProductBySlug(slug);

  if (!producto) {
    notFound();
  }

  const user = await getCurrentUser();

  return (
    <CheckoutClient
      producto={producto as unknown as React.ComponentProps<typeof CheckoutClient>["producto"]}
      variantes={variantes as unknown as React.ComponentProps<typeof CheckoutClient>["variantes"]}
      isLoggedIn={!!user?.userId}
      userRol={user?.rol || ""}
    />
  );
}
