"use client";

import { usePathname } from "next/navigation";
import Header from "../components/Header";
import Footer from "../components/Footer";
import CustomCursor from "../components/CustomCursor";
import RevealOnScroll from "../components/RevealOnScroll";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hideLayout = pathname === "/login" || pathname === "/signup";

  return (
    <>
      <CustomCursor />
      <RevealOnScroll />
      {!hideLayout && <Header />}
      <main>{children}</main>
      {!hideLayout && <Footer />}
    </>
  );
}
