import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Logo } from "./Logo";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <AppSidebar />
        <main className="flex-1">
          <header 
            className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b shadow-sm px-4" 
            style={{ 
              paddingTop: 'env(titlebar-area-height, 0px)',
              WebkitUserSelect: 'none',
              userSelect: 'none'
            }}
          >
            <Logo />
          </header>
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}