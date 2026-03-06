"use client";

export default function Badge({ children, variant = "gray", dot = false, className = "", ...props }) {
  const variants = {
    green:  "bg-green-500/10  border-green-500/25  text-green-400",
    cyan:   "bg-[#00FFCD]/10  border-[#00FFCD]/25  text-[#00FFCD]",
    yellow: "bg-yellow-500/10 border-yellow-500/25 text-yellow-400",
    red:    "bg-red-500/10    border-red-500/25    text-red-400",
    blue:   "bg-blue-500/10   border-blue-500/25   text-blue-400",
    gray:   "bg-white/5       border-white/10      text-[#a0a0a0]",
  };
  const dotColors = {
    green: "bg-green-400", cyan: "bg-[#00FFCD]", yellow: "bg-yellow-400",
    red: "bg-red-400", blue: "bg-blue-400", gray: "bg-[#767676]",
  };
  return (
    <span
      className={["inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border", variants[variant] ?? variants.gray, className].filter(Boolean).join(" ")}
      {...props}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant] ?? dotColors.gray} animate-pulse`} />}
      {children}
    </span>
  );
}
