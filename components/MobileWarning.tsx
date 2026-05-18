"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Monitor, Tablet, Smartphone, ArrowLeft } from "lucide-react";

export default function MobileWarning() {
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkMobile = () => {
      const userAgent =
        navigator.userAgent || navigator.vendor || (window as any).opera;
      const isMobileDevice =
        /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
          userAgent,
        ) || window.innerWidth < 768;
      setIsMobile(isMobileDevice);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/dashboard");
    }
  };

  if (!isMobile) return null;

  return (
    <div className="fixed inset-0 bg-[#080808] z-[9999] flex items-center justify-center p-6">
      <div className="max-w-md text-center">
        <Smartphone size={64} className="text-[#c9a962] mb-6 mx-auto" />
        <h1 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-white mb-4">
          Esta página no está diseñada para un teléfono
        </h1>
        <p className="text-[#888] text-lg mb-6">
          Por favor, usa esta página en tu tablet o computadora para una mejor
          experiencia.
        </p>
        <button
          onClick={handleBack}
          className="inline-flex items-center gap-2 bg-[#ffffff] text-[#0a0a0a] px-6 py-3 text-[0.75rem] uppercase tracking-[2px] font-[family-name:var(--font-heading)] font-semibold transition-all hover:bg-[#d4d4d4] mb-8 cursor-pointer"
        >
          <ArrowLeft size={16} />
          Volver
        </button>
        <div className="flex items-center justify-center gap-8 text-[#666]">
          <div className="flex flex-col items-center gap-2">
            <Monitor size={32} />
            <span className="text-sm">Computadora</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Tablet size={32} />
            <span className="text-sm">Tablet</span>
          </div>
        </div>
      </div>
    </div>
  );
}
