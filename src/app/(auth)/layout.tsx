import { ReactNode } from "react";
import AuthLeftPanel from "@/components/auth/AuthLeftPanel";


export default function AuthLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-[100dvh] grid grid-cols-1 bg-white lg:h-[100dvh] lg:max-h-[100dvh] lg:overflow-hidden lg:grid-cols-2">
            <AuthLeftPanel />
            <div 
                style={{ 
                    '--field-surface': '#F8FAFC', 
                    '--color-border-subtle': '#E2E8F0', 
                    '--color-text-primary': '#0F172A',
                    '--color-text-muted': '#64748B'
                } as React.CSSProperties}
                className="flex min-h-[100dvh] flex-col items-center justify-start bg-white px-6 py-8 sm:py-10 lg:min-h-0 lg:h-full lg:max-h-full lg:overflow-y-auto lg:px-12 xl:px-20"
            >
                <div className="w-full max-w-md pb-8 pt-2 sm:pb-10 lg:pb-12 lg:pt-6">
                    {children}
                </div>
            </div>
        </div>
    );
}
