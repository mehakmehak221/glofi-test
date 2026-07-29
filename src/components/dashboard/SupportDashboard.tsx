"use client";

import SupportTicketComposer from "@/components/dashboard/SupportTicketComposer";

export default function SupportDashboard() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-[var(--background)] min-h-screen text-[var(--sidebar-text)]">
      <div className="max-w-4xl">
        <SupportTicketComposer
          key="support-dashboard"
          title="Raise a Ticket"
          subtitle="Tell us exactly what is blocked and we’ll route it to the right team."
          description="Fill in your issue, choose a category, and submit the form. There is no read/list workflow on this page anymore."
        />
      </div>
    </div>
  );
}
