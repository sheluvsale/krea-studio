"use client";

import Link from "next/link";
import { useRef, useCallback, type ReactNode } from "react";

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: React.MouseEventHandler;
  href?: string;
  target?: string;
  rel?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  strength?: number;
}

export default function MagneticButton({
  children,
  className = "",
  onClick,
  href,
  target,
  rel,
  type = "button",
  disabled = false,
  strength = 0.15,
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement | HTMLAnchorElement>(null);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const btn = ref.current;
      if (!btn || disabled) return;
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
    },
    [disabled, strength],
  );

  const handleMouseLeave = useCallback(() => {
    const btn = ref.current;
    if (!btn) return;
    btn.style.transform = "translate(0, 0)";
  }, []);

  if (href) {
    return (
      <Link
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        target={target}
        rel={rel}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={`transition-transform duration-300 ease-out will-change-transform ${className}`}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      type={type}
      disabled={disabled}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`transition-transform duration-300 ease-out will-change-transform ${className}`}
    >
      {children}
    </button>
  );
}
