"use client";

export default function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  fullWidth = false,
  disabled = false,
  onClick,
  type = "button",
  className = "",
  ...props
}) {
  const base =
    "inline-flex items-center justify-center gap-2 font-semibold rounded-full border transition-all duration-200 cursor-pointer select-none focus-visible:outline-2 focus-visible:outline-offset-2";

  const variants = {
    primary:
      "bg-[var(--color-primary-300)] border-[var(--color-primary-300)] text-black hover:bg-[var(--color-primary-500)] hover:border-[var(--color-primary-500)]",
    gradient:
      "bg-[var(--color-gradient-glofi)] border-transparent text-black hover:opacity-90",
    secondary:
      "bg-transparent border-white/20 text-white hover:border-white/50 hover:bg-white/5",
    ghost:
      "bg-transparent border-transparent text-[var(--color-text-secondary)] hover:text-white hover:bg-white/5",
    danger:
      "bg-red-600/10 border-red-600/40 text-red-400 hover:bg-red-600/20",
  };

  const sizes = {
    sm: "px-4 py-1.5 text-sm",
    md: "px-6 py-2.5 text-sm",
    lg: "px-8 py-3.5 text-base",
  };

  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={[
        base,
        variants[variant] ?? variants.primary,
        sizes[size] ?? sizes.md,
        fullWidth ? "w-full" : "",
        isDisabled ? "opacity-50 cursor-not-allowed" : "",
        className,
      ].filter(Boolean).join(" ")}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      )}
      {children}
    </button>
  );
}
