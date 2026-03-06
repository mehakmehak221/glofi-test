"use client";

import { SearchIcon } from "@/components/VectorImages";

export default function SearchBar({ placeholder = "Search...", value, onChange, className = "" }) {
    return (
        <div className={`relative ${className}`}>
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#767676]">
                <SearchIcon className="w-4 h-4" />
            </span>
            <input
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className="w-full rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-[#4c4c4c] bg-[#1a1a1a] border border-white/10 transition-all duration-200 focus:outline-none focus:ring-2 focus:border-[#00FFCD]/60 focus:ring-[#00FFCD]/20"
            />
        </div>
    );
}
