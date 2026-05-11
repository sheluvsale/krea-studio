"use client";

import { useEffect } from "react";

export default function RevealOnScroll() {
  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      document.querySelectorAll(".reveal").forEach((el) => el.classList.add("active"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    function observeAll() {
      document.querySelectorAll(".reveal:not(.active)").forEach((el) => {
        observer.observe(el);
      });
    }

    observeAll();

    // Re-observe on DOM changes (SPA navigation)
    const mutObserver = new MutationObserver(() => {
      observeAll();
    });
    mutObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutObserver.disconnect();
    };
  }, []);

  return null;
}
