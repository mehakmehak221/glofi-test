"use client";

import SupportTicketComposer from "@/components/dashboard/SupportTicketComposer";
import { useI18n } from "@/providers/LocaleProvider";

export default function SupportDashboard() {
  const { t } = useI18n();
  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-[var(--background)] min-h-screen text-[var(--sidebar-text)]">
      <div className="max-w-4xl">
        <SupportTicketComposer
          key="support-dashboard"
          title={t("Raise a Ticket")}
          subtitle={t("Tell us exactly what is blocked and we’ll route it to the right team.")}
          description={t("Fill in your issue, choose a category, and submit the form. There is no read/list workflow on this page anymore.")}
        />
      </div>
    </div>
  );
}
