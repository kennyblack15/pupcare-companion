import { AppSidebar } from "./AppSidebar";
import { Logo } from "./Logo";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex">
      <AppSidebar />
      <main className="flex-1 relative">
        <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b p-4">
          <Logo />
        </header>
        {children}
      </main>
    </div>
  );
}