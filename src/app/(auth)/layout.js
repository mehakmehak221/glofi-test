import AuthLeftPanel from "@/components/auth/AuthLeftPanel";


export default function AuthLayout({ children }) {
    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-[var(--color-bg-dark-alt)]">
            <AuthLeftPanel />
            <div className="flex flex-col items-center justify-center min-h-screen px-6 py-12 lg:px-12 xl:px-20 bg-[var(--color-bg-dark)]">
                <div className="w-full max-w-md">{children}</div>
            </div>
        </div>
    );
}
