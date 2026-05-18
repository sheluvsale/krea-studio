"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

interface UserData {
  nombre: string;
  rol: string;
}

const navLinkBase =
  "relative text-[0.75rem] uppercase tracking-[2px] font-[family-name:var(--font-heading)] text-[#888] transition-all duration-300 hover:text-white";
const navLinkActive =
  "text-white after:content-[''] after:absolute after:bottom-[-5px] after:left-0 after:w-full after:h-px after:bg-white";
const navLinkInactive =
  "after:content-[''] after:absolute after:bottom-[-5px] after:left-0 after:w-0 after:h-px after:bg-white after:transition-all after:duration-300 hover:after:w-full";

export default function Header() {
  const [user, setUser] = useState<UserData | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const fetchCartCount = () => {
    fetch("/api/cart")
      .then((r) => r.json())
      .then((d) => {
        if (d.items) {
          const count = d.items.reduce(
            (sum: number, i: Record<string, number>) => sum + (i.cantidad || 0),
            0,
          );
          setCartCount(count);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (d.user?.isLoggedIn) setUser(d.user);
      })
      .catch(() => {});

    fetchCartCount();
  }, [pathname]);

  useEffect(() => {
    const onCartUpdate = () => fetchCartCount();
    window.addEventListener("cart-updated", onCartUpdate);
    return () => window.removeEventListener("cart-updated", onCartUpdate);
  }, []);

  useEffect(() => {
    const onProfileUpdate = () => {
      fetch("/api/auth/me")
        .then((r) => r.json())
        .then((d) => {
          if (d.user?.isLoggedIn) setUser(d.user);
        })
        .catch(() => {});
    };
    window.addEventListener("profile-updated", onProfileUpdate);
    return () => window.removeEventListener("profile-updated", onProfileUpdate);
  }, []);

  const isActive = (path: string) => pathname === path;
  const linkClass = (path: string) =>
    `${navLinkBase} ${isActive(path) ? navLinkActive : navLinkInactive}`;

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    window.location.href = "/";
  };

  return (
    <>
      <header
        className={`${pathname === "/dashboard" ? "relative" : "fixed top-0 left-0 w-full"} z-[9999] transition-all duration-300 ${
          scrolled
            ? "bg-[rgba(10,10,10,0.65)] backdrop-blur-xl backdrop-saturate-[180%] shadow-[0_4px_30px_rgba(0,0,0,0.3)]"
            : "bg-transparent"
        }`}
      >
        <nav className="flex justify-between items-center px-[5%] py-3 max-w-[1600px] mx-auto">
          <Link href="/" className="block">
            <Image
              src="/images/logo/Krea-blanco-sinfondo.png"
              alt="Krea Streetwear"
              width={180}
              height={60}
              priority
              className="h-[90px] w-auto block transition-transform duration-300 hover:scale-105"
            />
          </Link>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden flex flex-col gap-[6px] p-2 bg-transparent border-none z-[10001]"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span
              className={`block w-6 h-[2px] bg-white transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-[8px]" : ""}`}
            />
            <span
              className={`block w-6 h-[2px] bg-white transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`}
            />
            <span
              className={`block w-6 h-[2px] bg-white transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-[8px]" : ""}`}
            />
          </button>

          {/* Desktop Nav */}
          <ul className="hidden lg:flex list-none gap-10 items-center">
            <li className="relative">
              <Link
                href="/"
                className={linkClass("/")}
                onClick={() => setMenuOpen(false)}
              >
                Inicio
              </Link>
            </li>
            <li className="relative">
              <Link
                href="/productos"
                className={linkClass("/productos")}
                onClick={() => setMenuOpen(false)}
              >
                Productos
              </Link>
            </li>
            <li className="relative">
              <Link
                href="/nosotros"
                className={linkClass("/nosotros")}
                onClick={() => setMenuOpen(false)}
              >
                Nosotros
              </Link>
            </li>
            <li className="relative">
              <Link
                href="/contacto"
                className={linkClass("/contacto")}
                onClick={() => setMenuOpen(false)}
              >
                Contacto
              </Link>
            </li>

            {user ? (
              user.rol === "admin" ? (
                <>
                  {/* Admin en sitio principal: sin sesión visible */}
                  <li className="relative hidden lg:block">
                    <Link
                      href="/admin"
                      target="_blank"
                      className={`${navLinkBase} hover:text-white`}
                      onClick={() => setMenuOpen(false)}
                    >
                      Panel Admin
                    </Link>
                  </li>
                  <li className="relative hidden lg:block">
                    <button
                      onClick={handleLogout}
                      className={`${navLinkBase} bg-transparent border-none hover:text-white`}
                    >
                      Cerrar Sesión
                    </button>
                  </li>
                  <li className="lg:hidden">
                    <Link
                      href="/admin"
                      target="_blank"
                      className={navLinkBase}
                      onClick={() => setMenuOpen(false)}
                    >
                      Panel Admin
                    </Link>
                  </li>
                  <li className="lg:hidden">
                    <button
                      onClick={handleLogout}
                      className={`${navLinkBase} bg-transparent border-none`}
                    >
                      Cerrar Sesión
                    </button>
                  </li>
                </>
              ) : (
                <>
                  {/* Desktop dropdown */}
                  <li className="relative hidden lg:block group">
                    <span className={`${navLinkBase} cursor-pointer`}>
                      {user.nombre}
                    </span>
                    <ul className="absolute top-full left-1/2 -translate-x-1/2 bg-[rgba(10,10,10,0.75)] backdrop-blur-xl backdrop-saturate-[180%] min-w-[220px] py-2 opacity-0 invisible flex-col gap-0 border border-[rgba(255,255,255,0.1)] mt-4 transition-all duration-300 shadow-[0_20px_60px_rgba(0,0,0,0.5)] z-[10000] overflow-hidden group-hover:opacity-100 group-hover:visible group-hover:mt-2">
                      <li className="w-full">
                        <Link
                          href="/dashboard"
                          onClick={() => setMenuOpen(false)}
                          className="block w-full px-6 py-[0.85rem] text-[0.75rem] uppercase tracking-[1.5px] font-[family-name:var(--font-heading)] text-[#f5f5f5] bg-transparent border-none text-left hover:bg-[#1a1a1a] hover:text-[#ffffff] transition-all"
                        >
                          Mi Cuenta
                        </Link>
                      </li>
                      <li className="w-full">
                        <Link
                          href="/designer"
                          target="_blank"
                          rel="noopener"
                          onClick={() => setMenuOpen(false)}
                          className="block w-full px-6 py-[0.85rem] text-[0.75rem] uppercase tracking-[1.5px] font-[family-name:var(--font-heading)] text-[#f5f5f5] bg-transparent border-none text-left hover:bg-[#1a1a1a] hover:text-[#ffffff] transition-all"
                        >
                          Crear Ropa
                        </Link>
                      </li>
                      <li className="w-full">
                        <button
                          onClick={handleLogout}
                          className="block w-full px-6 py-[0.85rem] text-[0.75rem] uppercase tracking-[1.5px] font-[family-name:var(--font-heading)] text-[#f5f5f5] bg-transparent border-none text-left hover:bg-[#1a1a1a] hover:text-[#ffffff] transition-all"
                        >
                          Cerrar Sesión
                        </button>
                      </li>
                    </ul>
                  </li>
                  {/* Mobile items */}
                  <li className="lg:hidden">
                    <Link
                      href="/dashboard"
                      className={navLinkBase}
                      onClick={() => setMenuOpen(false)}
                    >
                      {user.nombre}
                    </Link>
                  </li>
                  <li className="lg:hidden">
                    <button
                      onClick={handleLogout}
                      className={`${navLinkBase} bg-transparent border-none`}
                    >
                      Cerrar Sesión
                    </button>
                  </li>
                </>
              )
            ) : (
              <li className="relative">
                <Link
                  href="/login"
                  className={linkClass("/login")}
                  onClick={() => setMenuOpen(false)}
                >
                  Iniciar Sesión
                </Link>
              </li>
            )}

            <li className="relative">
              <Link
                href="/cart"
                className={linkClass("/cart")}
                onClick={() => setMenuOpen(false)}
              >
                Carrito
                {cartCount > 0 && (
                  <span className="inline-flex items-center justify-center w-5 h-5 bg-[#ffffff] text-[#0a0a0a] text-[0.65rem] font-bold rounded-full ml-1.5">
                    {cartCount}
                  </span>
                )}
              </Link>
            </li>
          </ul>
        </nav>
      </header>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-[10000] lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setMenuOpen(false)}
          />
          {/* Menu Content */}
          <div className="absolute inset-y-0 right-0 w-[80%] max-w-[400px] bg-[#0a0a0a] shadow-2xl animate-in slide-in-from-right duration-300 ease-out">
            <ul className="flex flex-col justify-center items-center h-full gap-8 p-8">
              <li className="relative">
                <Link
                  href="/"
                  className={linkClass("/")}
                  onClick={() => setMenuOpen(false)}
                >
                  Inicio
                </Link>
              </li>
              <li className="relative">
                <Link
                  href="/productos"
                  className={linkClass("/productos")}
                  onClick={() => setMenuOpen(false)}
                >
                  Productos
                </Link>
              </li>
              <li className="relative">
                <Link
                  href="/nosotros"
                  className={linkClass("/nosotros")}
                  onClick={() => setMenuOpen(false)}
                >
                  Nosotros
                </Link>
              </li>
              <li className="relative">
                <Link
                  href="/contacto"
                  className={linkClass("/contacto")}
                  onClick={() => setMenuOpen(false)}
                >
                  Contacto
                </Link>
              </li>

              {user ? (
                user.rol === "admin" ? (
                  <>
                    <li className="relative">
                      <Link
                        href="/admin"
                        target="_blank"
                        className={navLinkBase}
                        onClick={() => setMenuOpen(false)}
                      >
                        Panel Admin
                      </Link>
                    </li>
                    <li className="relative">
                      <button
                        onClick={handleLogout}
                        className={`${navLinkBase} bg-transparent border-none`}
                      >
                        Cerrar Sesión
                      </button>
                    </li>
                  </>
                ) : (
                  <>
                    <li className="relative">
                      <Link
                        href="/dashboard"
                        className={navLinkBase}
                        onClick={() => setMenuOpen(false)}
                      >
                        {user.nombre}
                      </Link>
                    </li>
                    <li className="relative">
                      <Link
                        href="/designer"
                        target="_blank"
                        rel="noopener"
                        className={navLinkBase}
                        onClick={() => setMenuOpen(false)}
                      >
                        Crear Ropa
                      </Link>
                    </li>
                    <li className="relative">
                      <button
                        onClick={handleLogout}
                        className={`${navLinkBase} bg-transparent border-none`}
                      >
                        Cerrar Sesión
                      </button>
                    </li>
                  </>
                )
              ) : (
                <li className="relative">
                  <Link
                    href="/login"
                    className={linkClass("/login")}
                    onClick={() => setMenuOpen(false)}
                  >
                    Iniciar Sesión
                  </Link>
                </li>
              )}

              <li className="relative">
                <Link
                  href="/cart"
                  className={linkClass("/cart")}
                  onClick={() => setMenuOpen(false)}
                >
                  Carrito
                  {cartCount > 0 && (
                    <span className="inline-flex items-center justify-center w-5 h-5 bg-[#ffffff] text-[#0a0a0a] text-[0.65rem] font-bold ml-1.5">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
