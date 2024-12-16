import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-purple-50 via-white to-blue-50 animate-gradient">
        <AppSidebar />
        <main className="flex-1 animate-fadeIn overflow-auto">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}