"use client";

export default function Card({
  children,
  variant = "default",
  padding = "md",
  className = "",
  onClick,
  ...props
}) {
  const variants = {
    default: "bg-[#1a1a1a] border border-white/8",
    elevated: "bg-[#1a1a1a] border border-white/8 shadow-xl",
    bordered: "bg-[#111111] border border-[#00FFCD]/20 shadow-[0_0_30px_rgba(0,255,205,0.06)]",
    glass: "bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl",
  };

  const paddings = {
    none: "", sm: "p-4", md: "p-6", lg: "p-8",
  };

  return (
    <div
      onClick={onClick}
      className={[
        "rounded-2xl transition-all duration-200",
        variants[variant] ?? variants.default,
        paddings[padding] ?? paddings.md,
        onClick ? "cursor-pointer hover:border-[#00FFCD]/30" : "",
        className,
      ].filter(Boolean).join(" ")}
      {...props}
    >
      {children}
    </div>
  );
}
