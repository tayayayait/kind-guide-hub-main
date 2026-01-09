import { ReactNode } from "react";
import { BottomNavigation } from "./BottomNavigation";
import { cn } from "@/lib/utils";

interface PageLayoutProps {
  children: ReactNode;
  title?: string;
  showBackButton?: boolean;
  headerRight?: ReactNode;
  className?: string;
  hideNav?: boolean;
}

export function PageLayout({
  children,
  title,
  headerRight,
  className,
  hideNav = false,
}: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {title && (
        <header className="sticky top-0 z-40 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 border-b border-border">
          <div className="flex items-center justify-between h-14 px-4 max-w-lg mx-auto">
            <h1 className="text-lg font-bold text-foreground">{title}</h1>
            {headerRight}
          </div>
        </header>
      )}
      <main
        className={cn(
          "pb-20 max-w-lg mx-auto",
          !title && "pt-4",
          className
        )}
      >
        {children}
      </main>
      {!hideNav && <BottomNavigation />}
    </div>
  );
}
