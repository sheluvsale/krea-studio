"use client";

import { useState } from "react";

interface CustomCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  id?: string;
  className?: string;
}

export default function CustomCheckbox({
  checked,
  onChange,
  label,
  id,
  className = "",
}: CustomCheckboxProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`flex items-center gap-3 cursor-pointer ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onChange(!checked)}
    >
      <div
        className={`relative w-5 h-5 rounded border-2 transition-all duration-200 ${
          checked
            ? "bg-[#ffffff] border-[#ffffff]"
            : isHovered
            ? "border-[#ffffff]"
            : "border-[#888]"
        }`}
      >
        {checked && (
          <svg
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 text-[#0a0a0a]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}
      </div>
      {label && (
        <label htmlFor={id} className="text-sm text-[#f5f5f5] cursor-pointer select-none">
          {label}
        </label>
      )}
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={() => onChange(!checked)}
        className="hidden"
      />
    </div>
  );
}
