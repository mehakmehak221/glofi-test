"use client";

export default function Input({
  label,
  error,
  helper,
  leftIcon,
  rightIcon,
  id,
  className = "",
  ...props
}) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-[var(--color-gray-100)]">
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]">
            {leftIcon}
          </span>
        )}
        <input
          id={inputId}
          className={[
            "w-full rounded-md px-4 py-3 text-sm text-white placeholder-[var(--color-text-muted)]/50",
            "bg-[var(--color-bg-dark-alt)] border transition-all duration-200",
            "focus:outline-none focus:ring-2",
            error
              ? "border-[var(--color-status-error)]/60 focus:ring-[var(--color-status-error)]/30"
              : "border-[var(--color-border-subtle)] focus:border-[var(--color-primary-300-alpha-60)] focus:ring-[var(--color-primary-300-alpha-20)]",
            leftIcon ? "pl-10" : "",
            rightIcon ? "pr-10" : "",
          ].filter(Boolean).join(" ")}
          {...props}
        />
        {rightIcon && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]">
            {rightIcon}
          </span>
        )}
      </div>
      {error && <p className="text-xs text-[var(--color-status-error)]">{error}</p>}
      {helper && !error && <p className="text-xs text-[var(--color-text-muted)]">{helper}</p>}
    </div>
  );
}
