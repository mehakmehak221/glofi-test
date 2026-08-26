"use client";

import { useMemo, useState } from "react";
import { motion, Variants } from "framer-motion";
import { useGetTransactionsQuery } from "@/store/api/investmentApi";
import { useI18n } from "@/providers/LocaleProvider";

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const rowVariants: Variants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 25 } },
};

function getTypeColor(type) {
    if (!type) return "bg-[var(--color-status-info-bg)] text-[var(--color-status-info)] border-[var(--color-status-info-border)]";
    const t = type.toUpperCase();
    if (t === "BUY" || t === "PURCHASE") return "bg-[#E6FAF5] text-[#019C80] border-[#8FE2D1]";
    if (t === "SELL" || t === "RESALE") return "bg-[#FFF5E8] text-[#B96A00] border-[#F3C27C]";
    return "bg-[var(--color-status-info-bg)] text-[var(--color-status-info)] border-[var(--color-status-info-border)]";
}

function getStatusColor(status) {
    if (!status) return "";
    const s = status.toUpperCase();
    if (s === "COMPLETED" || s === "SUCCESS") return "bg-[#E6FAF5] text-[#019C80] border-[#8FE2D1]";
    if (s === "PENDING") return "bg-[#FFF5E8] text-[#B96A00] border-[#F3C27C]";
    if (s === "FAILED") return "bg-[#FFEAEA] text-[#C8372D] border-[#F4A7A1]";
    return "bg-[var(--color-status-info-bg)] text-[var(--color-status-info)] border-[var(--color-status-info-border)]";
}

function formatDate(dateStr) {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

function formatAmount(amount, currency) {
    if (amount === undefined || amount === null) return "-";
    return `₹${parseFloat(amount).toLocaleString()} ${currency || ""}`.trim();
}

export default function TransactionsPage() {
    const { data, isLoading, isError } = useGetTransactionsQuery();
    const { t } = useI18n();
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 8;

    const transactions = useMemo(
        () => (Array.isArray(data) ? data : (data?.data || data?.transactions || [])),
        [data]
    );
    const totalPages = Math.max(1, Math.ceil(transactions.length / ITEMS_PER_PAGE));
    const safeCurrentPage = Math.min(currentPage, totalPages);

    const paginatedTransactions = useMemo(() => {
        const start = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
        return transactions.slice(start, start + ITEMS_PER_PAGE);
    }, [transactions, safeCurrentPage]);

    const visiblePages = useMemo(() => {
        const windowSize = 5;
        const start = Math.max(1, safeCurrentPage - Math.floor(windowSize / 2));
        const end = Math.min(totalPages, start + windowSize - 1);
        const adjustedStart = Math.max(1, end - windowSize + 1);
        return Array.from({ length: end - adjustedStart + 1 }, (_, i) => adjustedStart + i);
    }, [safeCurrentPage, totalPages]);

    const showPagination = !isLoading && !isError && transactions.length > ITEMS_PER_PAGE;

    return (
        <div className="p-4 sm:p-6 lg:p-8 bg-[var(--background)] min-h-screen text-[var(--sidebar-text)]">
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl sm:text-3xl font-bold text-[var(--header-text)] mb-6"
            >
                {t("Transactions")}
            </motion.h1>

            {isLoading && (
                <div className="flex justify-center p-16">
                    <div className="w-8 h-8 border-2 border-[var(--color-primary-300)]/20 border-t-[var(--color-primary-300)] rounded-full animate-spin" />
                </div>
            )}

            {isError && (
                <div className="bg-[var(--color-status-error-bg)] border border-[var(--color-status-error-border)] text-[var(--color-status-error)] rounded-xl p-4 text-sm">
                    {t("Failed to load transactions.")}
                </div>
            )}

            {!isLoading && !isError && transactions.length === 0 && (
                <div className="bg-[var(--card-surface)] border border-[var(--sidebar-border)] rounded-xl p-12 text-center text-[var(--color-text-muted)] text-sm">
                    {t("No transactions found.")}
                </div>
            )}

            {!isLoading && !isError && transactions.length > 0 && (
                <>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                        className="hidden md:block bg-[var(--marketplace-card-bg)] border border-[var(--sidebar-border)] rounded-md overflow-hidden shadow-sm"
                    >
                        <div className="overflow-x-auto w-full pb-4">
                            <table className="w-full whitespace-nowrap min-w-[800px]">
                                <thead>
                                    <tr className="border-b border-[var(--sidebar-border)] bg-[var(--background)]/50">
                                        <th className="text-left px-5 py-4 text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] font-semibold">{t("Date")}</th>
                                        <th className="text-left px-5 py-4 text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] font-semibold">{t("Type")}</th>
                                        <th className="text-left px-5 py-4 text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] font-semibold">{t("Asset")}</th>
                                        <th className="text-left px-5 py-4 text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] font-semibold">{t("Amount")}</th>
                                        <th className="text-left px-5 py-4 text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] font-semibold">{t("Method")}</th>
                                        <th className="text-left px-5 py-4 text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] font-semibold">{t("Status")}</th>
                                    </tr>
                                </thead>
                                <motion.tbody variants={containerVariants} initial="hidden" animate="visible">
                                    {paginatedTransactions.map((tx, idx) => (
                                        <motion.tr
                                            key={tx.id || idx}
                                            variants={rowVariants}
                                            className="border-b border-[var(--sidebar-border)] hover:bg-[var(--sidebar-active-bg)] transition-colors"
                                        >
                                            <td className="px-5 py-4 text-sm text-[var(--color-text-muted)]">{formatDate(tx.createdAt || tx.date)}</td>
                                            <td className="px-5 py-4">
                                                <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getTypeColor(tx.type)}`}>
                                                    {t(tx.type)}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4 text-sm text-[var(--header-text)] font-medium">
                                                {tx.asset?.title || tx.assetTitle || tx.asset || "-"}
                                            </td>
                                            <td className="px-5 py-4 text-sm text-[var(--header-text)] font-semibold">
                                                {formatAmount(tx.amount, tx.currency)}
                                            </td>
                                            <td className="px-5 py-4 text-sm text-[var(--color-text-muted)]">
                                                {t(tx.paymentMethod || tx.method || "-")}
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(tx.status)}`}>
                                                    {tx.status?.toUpperCase() === "COMPLETED" ? "✓" : "◎"} {t(tx.status)}
                                                </span>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </motion.tbody>
                            </table>
                        </div>
                    </motion.div>

                    {/* Mobile cards */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="md:hidden flex flex-col gap-3"
                    >
                        {paginatedTransactions.map((tx, idx) => (
                            <motion.div
                                key={tx.id || idx}
                                variants={rowVariants}
                                className="bg-[var(--card-surface)] border border-[var(--sidebar-border)] rounded-xl p-4 shadow-sm"
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getTypeColor(tx.type)}`}>
                                        {t(tx.type)}
                                    </span>
                                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(tx.status)}`}>
                                        {tx.status?.toUpperCase() === "COMPLETED" ? "✓" : "◎"} {t(tx.status)}
                                    </span>
                                </div>
                                <h3 className="text-base font-bold text-[var(--header-text)] mb-4">
                                    {t(tx.asset?.title || tx.assetTitle || tx.asset || "-")}
                                </h3>
                                <div className="grid grid-cols-2 gap-4 text-xs bg-[var(--sidebar-active-bg)]/30 rounded-lg p-3">
                                    <div>
                                        <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] mb-1 font-bold">{t("Date")}</p>
                                        <p className="text-[var(--header-text)] font-bold">{formatDate(tx.createdAt || tx.date)}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] mb-1 font-bold">{t("Amount")}</p>
                                        <p className="text-[var(--header-text)] font-bold">{formatAmount(tx.amount, tx.currency)}</p>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] mb-1 font-bold">{t("Method")}</p>
                                        <p className="text-[var(--header-text)] font-bold">{t(tx.paymentMethod || tx.method || "-")}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>

                    {showPagination && (
                        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
                            <p className="text-xs text-[var(--color-text-muted)]">
                                {t("Showing")} {(safeCurrentPage - 1) * ITEMS_PER_PAGE + 1}-
                                {Math.min(safeCurrentPage * ITEMS_PER_PAGE, transactions.length)} {t("of")} {transactions.length}
                            </p>
                            <div className="flex items-center gap-1.5">
                                <button
                                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                    disabled={safeCurrentPage === 1}
                                    className="px-3 py-1.5 rounded-md text-xs font-semibold border border-[var(--sidebar-border)] bg-[var(--card-surface)] text-[var(--header-text)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                >
                                    {t("Prev")}
                                </button>
                                {visiblePages.map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={`min-w-8 h-8 px-2 rounded-md text-xs font-semibold border cursor-pointer ${
                                            page === safeCurrentPage
                                                ? "bg-[var(--btn-cta-bg)] text-[var(--btn-cta-text)] border-[var(--btn-cta-bg)]"
                                                : "bg-[var(--card-surface)] text-[var(--header-text)] border-[var(--sidebar-border)]"
                                        }`}
                                    >
                                        {page}
                                    </button>
                                ))}
                                <button
                                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                    disabled={safeCurrentPage === totalPages}
                                    className="px-3 py-1.5 rounded-md text-xs font-semibold border border-[var(--sidebar-border)] bg-[var(--card-surface)] text-[var(--header-text)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                >
                                    {t("Next")}
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
