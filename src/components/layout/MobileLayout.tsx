import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MobileLayoutProps {
    children: ReactNode;
    className?: string;
}

export function MobileLayout({ children, className }: MobileLayoutProps) {
    return (
        <div className="min-h-screen bg-neutral-100 flex justify-center">
            <div
                className={cn(
                    "w-full max-w-[430px] min-h-screen bg-background shadow-2xl overflow-hidden relative",
                    className
                )}
            >
                {children}
            </div>
        </div>
    );
}
