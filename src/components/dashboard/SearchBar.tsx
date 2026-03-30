"use client";

import { SearchIcon } from "@/components/VectorImages";

export interface SearchBarProps {
    placeholder?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    className?: string;
}

export default function SearchBar({ placeholder = "Search...", value, onChange, className = "" }: SearchBarProps) {
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
                className="w-full rounded-xl pl-10 pr-4 py-2.5 text-sm text-[var(--search-text)] placeholder-[var(--search-placeholder)] bg-[var(--search-bg)] border border-[var(--search-border)] transition-all duration-200 focus:outline-none focus:border-[var(--sidebar-active-text)]/40 focus:ring-2 focus:ring-[var(--sidebar-active-text)]/10"
            />
        </div>
    );
}
