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
                ? "bg-[var(--color-primary-300)]/45 text-white border-[var(--color-primary-300)]/70 shadow-[0_0_18px_rgba(0,218,175,0.22)] z-[1]"
                : [
                    "bg-white/[0.06] text-[var(--color-text-secondary)] border-white/10",
                    "hover:bg-[var(--color-primary-300)]/18 hover:text-white hover:border-[var(--color-primary-300)]/45",
                    "hover:shadow-[0_0_14px_rgba(0,218,175,0.12)] hover:-translate-y-px",
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
