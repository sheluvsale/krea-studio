import CustomCursor from "../components/CustomCursor";
import RevealOnScroll from "../components/RevealOnScroll";
import LayoutClient from "./LayoutClient";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <CustomCursor />
      <RevealOnScroll />
      <LayoutClient>{children}</LayoutClient>
    </>
  );
}
