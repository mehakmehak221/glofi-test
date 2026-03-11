"use client";


export default function UserTypeToggle({ options = ["Investor", "Partner"], value, onChange }) {
  return (
    <div className="flex bg-[#1a1a1a] border border-white/8 rounded-xl p-1 gap-1">
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
                ? "bg-[#061d18] text-[#00FFCD] shadow-sm"
                : "text-[#767676] hover:text-white",
            ].join(" ")}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}
