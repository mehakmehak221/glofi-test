"use client";

const USER_ROLE_INSIGHT: Record<string, string> = {
    Investor:
        "Own fractions of premium properties. Track your portfolio and monitor returns.",
    Partner:
        "Fractionalize your property. Reach qualified investors, and raise capital faster.",
    Agent: "Connect investors with premium properties and earn on every transaction.",
};

function SparkleCluster({ className = "" }: { className?: string }) {
    return (
        <svg
            className={`text-[var(--color-primary-300)] shrink-0 ${className}`}
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
        >
            <path d="M12 2l1.2 3.8L17 7l-3.8 1.2L12 12l-1.2-3.8L7 7l3.8-1.2L12 2z" />
            <path d="M5 14l.7 2.2L8 17l-2.3.7L5 20l-.7-2.3L2 17l2.3-.7L5 14z" opacity="0.85" />
            <path d="M17 15l.6 1.9L20 18l-2.4.7L17 21l-.6-1.9L14 18l2.4-.7L17 15z" opacity="0.7" />
        </svg>
    );
}

export default function RoleInsightCallout({ role }: { role: string }) {
    const text = USER_ROLE_INSIGHT[role] ?? USER_ROLE_INSIGHT.Investor;

    return (
        <div className="flex gap-3 p-4 rounded-xl border border-neutral-200 bg-neutral-50">
            <SparkleCluster className="shrink-0 mt-0.5" />
            <p className="text-sm text-neutral-900 leading-snug font-montserrat">{text}</p>
        </div>
    );
}
