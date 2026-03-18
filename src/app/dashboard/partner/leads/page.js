"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    PhoneIcon,
    TargetIcon,
    ClockIcon,
    CostIcon,
    CheckIcon,
    AutomationIcon,
    PlayIcon,
    PauseIcon,
    PendingIcon,
    TrendingUpIcon
} from "@/components/VectorImages";


const TABS = ["Leads", "AI Calls", "Automation"];

const LEAD_STATS = [
    { label: "HOT", value: "34", color: "var(--color-accent-red)", bgColor: "var(--color-accent-red-alpha-10)" },
    { label: "WARM", value: "89", color: "var(--color-accent-orange)", bgColor: "var(--color-accent-orange-alpha-10)" },
    { label: "COLD", value: "156", color: "var(--color-status-info)", bgColor: "var(--color-status-info-bg)" },
    { label: "CONVERTED", value: "247", color: "var(--color-primary-300)", bgColor: "var(--color-primary-300-alpha-10)" },
];

const LEADS_DATA = [
    { name: "Ahmed Al Rashid", asset: "Burj Vista Tower", status: "HOT", aiCall: "Done", date: "2026-02-10" },
    { name: "Sarah Chen", asset: "Marina Walk Residences", status: "WARM", aiCall: "Done", date: "2026-02-09" },
    { name: "James Wilson", asset: "Palm Jumeirah Villa Estate", status: "COLD", aiCall: "Pending", date: "2026-02-08" },
    { name: "Maria Rodriguez", asset: "DIFC Innovation Tower", status: "CONVERTED", aiCall: "Done", date: "2026-02-05" },
    { name: "Raj Patel", asset: "Dubai South Development Land", status: "HOT", aiCall: "Pending", date: "2026-02-11" },
    { name: "Fatima Al Mansoori", asset: "Marina Business Hub", status: "WARM", aiCall: "Done", date: "2026-02-07" },
];

const AI_STATS = [
    { label: "TOTAL CALLS", value: "8,432", delta: "+342 today", icon: PhoneIcon },
    { label: "CONVERSION", value: "23.5%", delta: "+2.1%", icon: TargetIcon },
    { label: "AVG DURATION", value: "3:42", icon: ClockIcon },
    { label: "COST/LEAD", value: "$4.20", icon: CostIcon },
];

const AI_CALLS_DATA = [
    { id: "#8432", contact: "Ahmed R.", asset: "Burj Vista", duration: "4:32", outcome: "INTERESTED", date: "Feb 12" },
    { id: "#8431", contact: "Sarah C.", asset: "Marina Walk", duration: "3:18", outcome: "FOLLOW-UP", date: "Feb 12" },
    { id: "#8430", contact: "James W.", asset: "Palm Villa", duration: "1:45", outcome: "NO ANSWER", date: "Feb 12" },
    { id: "#8429", contact: "Maria R.", asset: "DIFC Tower", duration: "6:12", outcome: "CONVERTED", date: "Feb 11" },
    { id: "#8428", contact: "Raj P.", asset: "Dubai South", duration: "2:56", outcome: "INTERESTED", date: "Feb 11" },
];

const AUTOMATIONS = [
    {
        title: "New Lead Follow-up",
        desc: "Auto-call within 5 min of interest",
        trigger: "User clicks Interested",
        action: "AI call + email",
        runs: "1,247 runs",
        status: "Active",
        color: "var(--color-primary-300)"
    },
    {
        title: "KYC Reminder",
        desc: "Remind users with pending KYC",
        trigger: "Invest attempt w/o KYC",
        action: "Push + email",
        runs: "834 runs",
        status: "Active",
        color: "var(--color-primary-300)"
    },
    {
        title: "Portfolio Update",
        desc: "Weekly performance summary",
        trigger: "Monday 9 AM",
        action: "Email digest",
        runs: "2,156 runs",
        status: "Active",
        color: "var(--color-primary-300)"
    },
    {
        title: "Cold Re-engagement",
        desc: "Re-engage cold leads after 14 days",
        trigger: "14 days no activity",
        action: "AI call + offer",
        runs: "456 runs",
        status: "Active",
        color: "var(--color-primary-300)"
    },
    {
        title: "Broker Escalation",
        desc: "Escalate hot leads to human brokers",
        trigger: "Score > 90",
        action: "Broker notification",
        runs: "312 runs",
        status: "Active",
        color: "var(--color-primary-300)"
    },
    {
        title: "Yield Alert",
        desc: "Alert when yields exceed forecast",
        trigger: "Yield +10%",
        action: "Push + email",
        runs: "89 runs",
        status: "Paused",
        color: "var(--color-status-warning)"
    },
];


const StatCard = ({ label, value, delta, icon: Icon, color, bgColor }) => (
    <div className="flex-1 min-w-[180px] bg-[var(--color-bg-surface-subtle)] border border-[var(--color-border-subtle)] rounded-xl p-5 hover:bg-[var(--color-bg-surface-elevated)] transition-colors group relative overflow-hidden">
        {Icon && (
            <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[var(--color-bg-surface-subtle)] flex items-center justify-center text-white group-hover:bg-[var(--color-primary-300)]/10 group-hover:text-[var(--color-primary-300)] transition-colors">
                <Icon className="w-4 h-4" />
            </div>
        )}
        <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold text-[var(--color-text-muted)] tracking-widest uppercase font-montserrat">{label}</span>
            <div className="flex items-baseline gap-2">
                <span className="text-2xl font-semibold text-white font-montserrat tracking-tight" style={{ color: color }}>{value}</span>
            </div>
            {delta && (
                <div className="flex items-center gap-1">
                    {delta.startsWith('+') && <TrendingUpIcon className="w-2.5 h-2.5 text-[var(--color-status-success)]/60" />}
                    <span className={`text-[10px] font-medium ${delta.startsWith('+') ? 'text-[var(--color-status-success)]/60' : 'text-[var(--color-text-muted)]'}`}>
                        {delta}
                    </span>
                </div>
            )}
        </div>
    </div>
);

const AutomationCard = ({ item }) => (
    <div className="bg-[var(--color-bg-surface-subtle)] border border-[var(--color-border-subtle)] rounded-2xl p-6 hover:bg-[var(--color-bg-surface-elevated)] transition-all group">
        <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[var(--color-bg-surface-subtle)] flex items-center justify-center group-hover:bg-[var(--color-primary-300)]/10 transition-colors">
                    <AutomationIcon className={`w-5 h-5 ${item.status === 'Active' ? 'text-[var(--color-primary-300)]' : 'text-[var(--color-accent-orange)]'}`} />
                </div>
                <div>
                    <h3 className="text-sm font-semibold text-white font-montserrat">{item.title}</h3>
                    <p className="text-[11px] text-[var(--color-text-muted)] font-medium">{item.desc}</p>
                </div>
            </div>
            <button className="w-10 h-10 rounded-full bg-[var(--color-bg-surface-subtle)] border border-[var(--color-border-subtle)] flex items-center justify-center hover:bg-[var(--color-bg-surface-elevated)] transition-colors">
                {item.status === 'Active' ? <PauseIcon className="w-4 h-4 text-white" /> : <PlayIcon className="w-4 h-4 text-[var(--color-status-warning)]" />}
            </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-[var(--color-bg-surface-subtle)] rounded-xl p-3">
                <span className="text-[9px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest block mb-1">Trigger</span>
                <span className="text-[11px] text-white font-medium">{item.trigger}</span>
            </div>
            <div className="bg-[var(--color-bg-surface-subtle)] rounded-xl p-3">
                <span className="text-[9px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest block mb-1">Action</span>
                <span className="text-[11px] text-white font-medium">{item.action}</span>
            </div>
        </div>

        <div className="flex items-center justify-between">
            <span className="text-[11px] text-[var(--color-text-muted)] font-medium">{item.runs}</span>
            <span className={`text-[10px] font-bold uppercase tracking-widest ${item.status === 'Active' ? 'text-[var(--color-status-success)]' : 'text-[var(--color-status-warning)]/40'}`}>
                {item.status}
            </span>
        </div>
    </div>
);

export default function LeadsAIPage() {
    const [activeTab, setActiveTab] = useState("Leads");

    return (
        <div className="p-4 sm:p-6 lg:p-8 bg-[var(--color-bg-dark)] min-h-screen">

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <motion.h1
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-2xl lg:text-3xl font-semibold text-[var(--color-text-primary)] font-montserrat tracking-tight"
                >
                    Leads & AI
                </motion.h1>

                <div className="flex p-1 bg-[var(--color-bg-surface-subtle)] rounded-full border border-[var(--color-border-subtle)] self-start md:self-center">
                    {TABS.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-2 rounded-full text-xs font-semibold transition-all relative ${activeTab === tab ? "text-white" : "text-[var(--color-text-muted)] hover:text-white"
                                }`}
                        >
                            {tab === activeTab && (
                                <motion.div
                                    layoutId="activePill"
                                    className="absolute inset-0 bg-[var(--color-primary-300)]/10 rounded-full border border-[var(--color-primary-300)]/20"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            <span className="relative z-10">{tab}</span>
                        </button>
                    ))}
                </div>
            </div>

            <AnimatePresence mode="wait">
                {activeTab === "Leads" && (
                    <motion.div
                        key="leads"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-8"
                    >

                        <div className="flex flex-wrap gap-4 lg:gap-6">
                            {LEAD_STATS.map((stat) => (
                                <StatCard key={stat.label} {...stat} />
                            ))}
                        </div>


                        <div className="bg-[var(--color-bg-surface-subtle)] border border-[var(--color-border-subtle)] rounded-2xl overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-[var(--color-border-subtle)] bg-[var(--color-bg-surface-subtle)]">
                                            <th className="px-6 py-4 text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-[2px] font-montserrat">Name</th>
                                            <th className="px-6 py-4 text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-[2px] font-montserrat">Asset</th>
                                            <th className="px-6 py-4 text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-[2px] font-montserrat">Status</th>
                                            <th className="px-6 py-4 text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-[2px] font-montserrat">AI Call</th>
                                            <th className="px-6 py-4 text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-[2px] font-montserrat">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y border-[var(--color-border-subtle)]">
                                        {LEADS_DATA.map((lead, i) => (
                                            <tr key={i} className="hover:bg-[var(--color-bg-surface-subtle)] transition-colors group">
                                                <td className="px-6 py-5">
                                                    <span className="text-xs font-semibold text-[var(--color-text-secondary)] font-montserrat">{lead.name}</span>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <span className="text-xs text-[var(--color-text-muted)] font-medium">{lead.asset}</span>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <span className={`text-[9px] font-bold px-3 py-1 rounded-full    bg-opacity-10`}
                                                        style={{
                                                            color: LEAD_STATS.find(s => s.label === lead.status)?.color,
                                                            borderColor: `${LEAD_STATS.find(s => s.label === lead.status)?.color}33`,
                                                            backgroundColor: `${LEAD_STATS.find(s => s.label === lead.status)?.color}10`
                                                        }}
                                                    >
                                                        {lead.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-2">
                                                        {lead.aiCall === "Done" ? (
                                                            <>
                                                                <CheckIcon className="w-3 h-3 text-[var(--color-primary-300)]/50" />
                                                                <span className="text-xs text-[var(--color-primary-300)]/50 font-semibold">Done</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <PendingIcon className="w-3 h-3 text-[var(--color-text-muted)]" />
                                                                <span className="text-xs text-[var(--color-border-muted)] font-semibold">Pending</span>
                                                            </>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <span className="text-[11px] text-[var(--color-text-muted)] font-medium">{lead.date}</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </motion.div>
                )}

                {activeTab === "AI Calls" && (
                    <motion.div
                        key="ai-calls"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-8"
                    >

                        <div className="flex flex-wrap gap-4 lg:gap-6">
                            {AI_STATS.map((stat) => (
                                <StatCard key={stat.label} {...stat} />
                            ))}
                        </div>


                        <div className="bg-[var(--color-bg-surface-subtle)] border border-[var(--color-border-subtle)] rounded-2xl overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-[var(--color-border-subtle)] bg-[var(--color-bg-surface-subtle)]">
                                            <th className="px-6 py-4 text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-[2px] font-montserrat">ID</th>
                                            <th className="px-6 py-4 text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-[2px] font-montserrat">Contact</th>
                                            <th className="px-6 py-4 text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-[2px] font-montserrat">Asset</th>
                                            <th className="px-6 py-4 text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-[2px] font-montserrat">Duration</th>
                                            <th className="px-6 py-4 text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-[2px] font-montserrat">Outcome</th>
                                            <th className="px-6 py-4 text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-[2px] font-montserrat">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y border-[var(--color-border-subtle)]">
                                        {AI_CALLS_DATA.map((call, i) => (
                                            <tr key={i} className="hover:bg-[var(--color-bg-surface-subtle)] transition-colors group">
                                                <td className="px-6 py-5">
                                                    <span className="text-[11px] font-semibold text-[var(--color-primary-300)] font-mono">{call.id}</span>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <span className="text-xs font-semibold text-white font-montserrat">{call.contact}</span>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <span className="text-xs text-[var(--color-text-muted)] font-medium">{call.asset}</span>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <span className="text-[11px] text-[var(--color-text-muted)] font-medium">{call.duration}</span>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <span className={`text-[9px] font-bold px-3 py-1 rounded-full border bg-opacity-10 ${call.outcome === 'CONVERTED' ? 'text-[var(--color-primary-300)] border-[var(--color-primary-300)]/20 bg-[var(--color-primary-300)]/5' :
                                                        call.outcome === 'INTERESTED' ? 'text-[var(--color-status-info)] border-[var(--color-status-info-border)] bg-[var(--color-status-info-bg)]' :
                                                            call.outcome === 'FOLLOW-UP' ? 'text-[var(--color-accent-orange)] border-[var(--color-accent-orange)]/20 bg-[var(--color-accent-orange)]/5' :
                                                                'text-[var(--color-text-muted)] border-[var(--color-border-subtle)] bg-[var(--color-bg-surface-subtle)]'
                                                        }`}>
                                                        {call.outcome}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <span className="text-[11px] text-[var(--color-text-muted)] font-medium">{call.date}</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </motion.div>
                )}

                {activeTab === "Automation" && (
                    <motion.div
                        key="automation"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {AUTOMATIONS.map((item, i) => (
                            <AutomationCard key={i} item={item} />
                        ))}


                        <div className="bg-[var(--color-bg-surface-subtle)] border border-dashed border-[var(--color-border-subtle)] rounded-2xl p-6 flex flex-col items-center justify-center gap-3 hover:border-[var(--color-primary-300)]/20 hover:bg-[var(--color-primary-300)]/5 transition-all cursor-pointer group min-h-[280px]">
                            <div className="w-12 h-12 rounded-full bg-[var(--color-bg-surface-subtle)] flex items-center justify-center group-hover:bg-[var(--color-primary-300)]/10 transition-all">
                                <span className="text-2xl text-[var(--color-text-muted)] group-hover:text-[var(--color-primary-300)]">+</span>
                            </div>
                            <span className="text-xs font-semibold text-[var(--color-text-muted)] group-hover:text-[var(--color-primary-300)] font-montserrat">New Automation</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
