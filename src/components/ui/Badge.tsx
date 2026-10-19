import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "neutral" | "accent" | "outline";
  withDot?: boolean;
  className?: string;
}

export function Badge({
  children,
  variant = "accent",
  withDot = true,
  className = "",
}: BadgeProps) {
  const variantStyles = {
    neutral:
      "bg-atelier-surface text-atelier-text-muted border-atelier-border",
    accent:
      "bg-atelier-surface text-atelier-text border-atelier-border/80 shadow-sm",
    outline:
      "bg-transparent text-atelier-accent border-atelier-accent/40",
  };

  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1 text-xs font-mono tracking-wider uppercase rounded-full border ${variantStyles[variant]} ${className}`}
    >
      {withDot && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-atelier-accent opacity-75 duration-1000" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-atelier-accent" />
        </span>
      )}
      {children}
    </span>
  );
}
