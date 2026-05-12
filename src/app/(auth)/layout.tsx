import { ReactNode } from "react";
import AuthLeftPanel from "@/components/auth/AuthLeftPanel";


export default function AuthLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-[100dvh] grid grid-cols-1 bg-[var(--color-bg-dark-alt)] theme-purple lg:h-[100dvh] lg:max-h-[100dvh] lg:overflow-hidden lg:grid-cols-2">
            <AuthLeftPanel />
            <div className="flex min-h-[100dvh] flex-col items-center bg-[var(--color-bg-dark)] px-6 py-8 sm:py-10 lg:min-h-0 lg:h-full lg:max-h-full lg:overflow-y-auto lg:px-12 xl:px-20">
                <div className="w-full max-w-md pb-4 pt-2 lg:my-auto lg:py-4">{children}</div>
            </div>
        </div>
    );
}
