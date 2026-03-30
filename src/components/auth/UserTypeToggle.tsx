"use client";


export default function UserTypeToggle({ options = ["Investor", "Partner"], value, onChange }) {
  return (
    <div className="flex w-full bg-[var(--color-primary-300)]/5 border border-[var(--color-primary-300)]/10 rounded-lg p-1.5 gap-1.5">
      {options.map((opt) => {
        const active = value === opt;
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange?.(opt)}
            className={[
              "flex-1 py-3 px-6 rounded-md text-sm font-semibold transition-all duration-300",
              active
                ? "bg-[var(--color-primary-300)]/40 text-[var(--sidebar-active-text)] shadow-glow-primary"
                : "text-[var(--color-text-secondary)] hover:text-white hover:bg-[var(--color-primary-300)]/40",
            ].join(" ")}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}
