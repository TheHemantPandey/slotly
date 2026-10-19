import React from "react";

interface SlotlyLogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

export function SlotlyMark({
  size = 32,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Outer subtle shield / diamond boundary */}
      <rect
        x="6"
        y="6"
        width="36"
        height="36"
        rx="8"
        stroke="#393633"
        strokeWidth="1.5"
        fill="#1E1E1E"
      />

      {/* Internal architectural grid lines */}
      <line
        x1="6"
        y1="24"
        x2="42"
        y2="24"
        stroke="#2E2C29"
        strokeWidth="1"
        strokeDasharray="2 2"
      />
      <line
        x1="24"
        y1="6"
        x2="24"
        y2="42"
        stroke="#2E2C29"
        strokeWidth="1"
        strokeDasharray="2 2"
      />

      {/* Stylized "S" / Time aperture ribbon */}
      <path
        d="M16 16C16 13.7909 17.7909 12 20 12H28C30.2091 12 32 13.7909 32 16V20C32 22.2091 30.2091 24 28 24H20C17.7909 24 16 25.7909 16 28V32C16 34.2091 17.7909 36 20 36H28C30.2091 36 32 34.2091 32 32"
        stroke="#F3EEE5"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* The "Slot" focal point - Warm Amber Accent */}
      <circle cx="24" cy="24" r="3.5" fill="#F0B35A" />
      <circle
        cx="24"
        cy="24"
        r="6.5"
        stroke="#F0B35A"
        strokeWidth="1"
        strokeOpacity="0.4"
      />
    </svg>
  );
}

export function SlotlyLogo({
  size = "md",
  showText = true,
  className = "",
}: SlotlyLogoProps) {
  const sizeMap = {
    sm: { icon: 28, textClass: "text-base tracking-[0.2em]", subClass: "text-[9px]" },
    md: { icon: 36, textClass: "text-lg tracking-[0.24em]", subClass: "text-[10px]" },
    lg: { icon: 48, textClass: "text-2xl tracking-[0.28em]", subClass: "text-xs" },
  };

  const current = sizeMap[size];

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      <SlotlyMark size={current.icon} />
      {showText && (
        <div className="flex flex-col">
          <span
            className={`font-sans font-semibold uppercase text-atelier-text ${current.textClass}`}
          >
            Slotly
          </span>
          <span
            className={`font-mono text-atelier-text-muted uppercase tracking-[0.18em] ${current.subClass}`}
          >
            Atelier
          </span>
        </div>
      )}
    </div>
  );
}
