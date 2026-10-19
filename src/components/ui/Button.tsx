import React from "react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline" | "danger";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      className = "",
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-sans font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-atelier-accent focus-visible:ring-offset-2 focus-visible:ring-offset-atelier-bg disabled:opacity-50 disabled:pointer-events-none select-none cursor-pointer";

    const variantStyles = {
      primary:
        "bg-atelier-accent text-[#171717] hover:bg-atelier-accent-hover active:scale-[0.98] shadow-sm font-semibold",
      secondary:
        "bg-atelier-elevated text-atelier-text border border-atelier-border hover:border-atelier-accent/50 hover:bg-[#2F2F2F] active:scale-[0.98]",
      ghost:
        "bg-transparent text-atelier-text-muted hover:text-atelier-text hover:bg-atelier-surface active:scale-[0.98]",
      outline:
        "bg-transparent text-atelier-text border border-atelier-border hover:border-atelier-accent hover:text-atelier-accent active:scale-[0.98]",
      danger:
        "bg-red-950/80 text-red-300 border border-red-800/80 hover:bg-red-900/80 hover:text-red-200 active:scale-[0.98]",
    };

    const sizeStyles = {
      sm: "text-xs tracking-wider uppercase px-3.5 py-1.5 rounded-md gap-1.5",
      md: "text-sm tracking-wide px-5 py-2.5 rounded-lg gap-2",
      lg: "text-base tracking-wide px-6 py-3.5 rounded-lg gap-2.5",
    };

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
