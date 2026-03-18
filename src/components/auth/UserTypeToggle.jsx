"use client";


export default function UserTypeToggle({ options = ["Investor", "Partner"], value, onChange }) {
  return (
    <div className="flex w-full bg-[#00DAAF05] border border-[#00DAAF10] rounded-lg p-1.5 gap-1.5">
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
                ? "bg-[#00DAAF40] text-[#00F4C4] shadow-lg shadow-[#00DAAF20]"
                : "text-[var(--color-text-secondary)] hover:text-white hover:bg-[#00DAAF40]",
            ].join(" ")}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}
