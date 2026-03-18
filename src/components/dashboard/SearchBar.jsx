"use client";

import { SearchIcon } from "@/components/VectorImages";

export default function SearchBar({ placeholder = "Search...", value, onChange, className = "" }) {
    return (
        <div className={`relative ${className}`}>
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]">
                <SearchIcon className="w-4 h-4" />
            </span>
            <input
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className="w-full rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-[var(--color-text-muted)] bg-[var(--color-bg-surface-subtle)] border border-[var(--color-border-muted)] transition-all duration-200 focus:outline-none focus:ring-2 focus:border-[var(--color-primary-300-alpha-60)] focus:ring-[var(--color-primary-300-alpha-20)]"
            />
        </div>
    );
}
