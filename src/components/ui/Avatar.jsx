"use client";

export default function Avatar({ src, name = "", size = "md", online = false, className = "", ...props }) {
  const initials = name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();
  const sizes = { xs: "w-6 h-6 text-[10px]", sm: "w-8 h-8 text-xs", md: "w-10 h-10 text-sm", lg: "w-12 h-12 text-base", xl: "w-16 h-16 text-lg" };
  const badgeSizes = { xs: "w-1.5 h-1.5 -bottom-0.5 -right-0.5", sm: "w-2 h-2 -bottom-0.5 -right-0.5", md: "w-2.5 h-2.5 bottom-0 right-0", lg: "w-3 h-3 bottom-0 right-0", xl: "w-3.5 h-3.5 bottom-0.5 right-0.5" };
  return (
    <div className={`relative inline-flex shrink-0 ${className}`} {...props}>
      {src ? (
        <img src={src} alt={name} className={`${sizes[size] ?? sizes.md} rounded-full object-cover border border-white/10`} />
      ) : (
        <div className={`${sizes[size] ?? sizes.md} rounded-full flex items-center justify-center font-semibold text-black bg-gradient-to-br from-[#00FFCD] to-[#009976]`}>
          {initials || "?"}
        </div>
      )}
      {online && <span className={`absolute ${badgeSizes[size] ?? badgeSizes.md} bg-green-400 border-2 border-[#0a0a0a] rounded-full`} />}
    </div>
  );
}
