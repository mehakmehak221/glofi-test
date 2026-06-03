"use client";


export default function UserTypeToggle({ options = ["Investor", "Partner", "Agent"], value, onChange }) {
  return (
    <div className="flex w-full bg-[var(--color-primary-300)]/5 border border-[var(--color-primary-300)]/10 rounded-lg p-1.5 gap-1.5 overflow-hidden">
      {options.map((opt) => {
        const active = value === opt;
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange?.(opt)}
            className={[
              "flex-1 py-3 px-2 rounded-md text-xs sm:text-sm font-semibold transition-all duration-200 whitespace-nowrap cursor-pointer border",
              active
                ? "bg-[var(--color-primary-300)]/40 text-neutral-900 border-[var(--color-primary-300)]/60 shadow-[0_4px_14px_rgba(0,218,175,0.15)] z-[1]"
                : [
                    "bg-transparent text-neutral-500 border-transparent",
                    "hover:bg-[var(--color-primary-300)]/10 hover:text-neutral-900",
                    "hover:-translate-y-px",
                    "active:translate-y-0 active:scale-[0.99]",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-300)]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black/80",
                  ].join(" "),
            ].join(" ")}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}
