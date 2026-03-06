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
        <label htmlFor={inputId} className="text-sm font-medium text-[#d5d7da]">
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#767676]">
            {leftIcon}
          </span>
        )}
        <input
          id={inputId}
          className={[
            "w-full rounded-xl px-4 py-3 text-sm text-white placeholder-[#4c4c4c]",
            "bg-[#1a1a1a] border transition-all duration-200",
            "focus:outline-none focus:ring-2",
            error
              ? "border-red-500/60 focus:ring-red-500/30"
              : "border-white/10 focus:border-[#00FFCD]/60 focus:ring-[#00FFCD]/20",
            leftIcon ? "pl-10" : "",
            rightIcon ? "pr-10" : "",
          ].filter(Boolean).join(" ")}
          {...props}
        />
        {rightIcon && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#767676]">
            {rightIcon}
          </span>
        )}
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
      {helper && !error && <p className="text-xs text-[#767676]">{helper}</p>}
    </div>
  );
}
