import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  elevated?: boolean;
  interactive?: boolean;
  className?: string;
}

export function Card({
  children,
  elevated = false,
  interactive = false,
  className = "",
  ...props
}: CardProps) {
  return (
    <div
      className={`rounded-xl border border-atelier-border p-6 transition-all duration-300 ${
        elevated ? "bg-atelier-elevated" : "bg-atelier-surface"
      } ${
        interactive
          ? "hover:border-atelier-accent/40 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/40"
          : ""
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`flex flex-col gap-1.5 mb-4 ${className}`}>{children}</div>;
}

export function CardTitle({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h3
      className={`font-serif text-xl tracking-tight text-atelier-text ${className}`}
    >
      {children}
    </h3>
  );
}

export function CardDescription({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p className={`text-sm text-atelier-text-muted leading-relaxed ${className}`}>
      {children}
    </p>
  );
}
