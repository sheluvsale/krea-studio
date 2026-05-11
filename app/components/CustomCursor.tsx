"use client";

import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    const lerpSpeed = 0.15;

    function lerp(start: number, end: number, factor: number) {
      return start + (end - start) * factor;
    }

    dot.style.left = mouseX + "px";
    dot.style.top = mouseY + "px";
    ring.style.left = ringX + "px";
    ring.style.top = ringY + "px";

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = mouseX + "px";
      dot.style.top = mouseY + "px";
    };

    let animId: number;
    function animateRing() {
      ringX = lerp(ringX, mouseX, lerpSpeed);
      ringY = lerp(ringY, mouseY, lerpSpeed);
      ring!.style.left = ringX + "px";
      ring!.style.top = ringY + "px";
      animId = requestAnimationFrame(animateRing);
    }
    animateRing();

    document.addEventListener("mousemove", onMouseMove, { passive: true });

    // Hover on interactive elements
    const onEnter = () => {
      dot.classList.add("hover");
      ring.classList.add("hover");
    };
    const onLeave = () => {
      dot.classList.remove("hover");
      ring.classList.remove("hover");
    };

    const observer = new MutationObserver(() => {
      bindInteractive();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    function bindInteractive() {
      const els = document.querySelectorAll(
        "a, button, .product-card, .offer-card, input, textarea, select, .btn, [role='button']",
      );
      els.forEach((el) => {
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mouseleave", onLeave);
        el.addEventListener("mouseenter", onEnter);
        el.addEventListener("mouseleave", onLeave);
      });
    }
    bindInteractive();

    const onDown = () => {
      dot.classList.add("active");
      ring.classList.add("active");
    };
    const onUp = () => {
      dot.classList.remove("active");
      ring.classList.remove("active");
    };
    const onDocLeave = () => {
      dot.classList.add("hidden");
      ring.classList.add("hidden");
    };
    const onDocEnter = () => {
      dot.classList.remove("hidden");
      ring.classList.remove("hidden");
    };

    document.addEventListener("mousedown", onDown);
    document.addEventListener("mouseup", onUp);
    document.addEventListener("mouseleave", onDocLeave);
    document.addEventListener("mouseenter", onDocEnter);

    return () => {
      cancelAnimationFrame(animId);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("mouseup", onUp);
      document.removeEventListener("mouseleave", onDocLeave);
      document.removeEventListener("mouseenter", onDocEnter);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot hidden" />
      <div ref={ringRef} className="cursor-ring hidden" />
    </>
  );
}
