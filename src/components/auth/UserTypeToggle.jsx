"use client";


export default function UserTypeToggle({ options = ["Investor", "Partner"], value, onChange }) {
  return (
    <div className="flex bg-[var(--color-bg-dark-alt)] border border-[var(--color-border-subtle)] rounded-xl p-1 gap-1">
      {options.map((opt) => {
        const active = value === opt;
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange?.(opt)}
            className={[
              "flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all duration-200",
              active
                ? "bg-[var(--color-primary-300-alpha-10)] text-[var(--color-primary-300)] shadow-sm"
                : "text-[var(--color-text-secondary)] hover:text-white",
            ].join(" ")}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}
