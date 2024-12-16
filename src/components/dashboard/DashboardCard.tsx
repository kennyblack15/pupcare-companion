import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface DashboardCardProps {
  title: string;
  icon: LucideIcon;
  content: string;
  onClick?: () => void;
}

export function DashboardCard({ title, icon: Icon, content, onClick }: DashboardCardProps) {
  return (
    <Card 
      className="p-6 hover:shadow-lg transition-all duration-300 cursor-pointer bg-white hover:scale-[1.02] active:scale-[0.98] group" 
      onClick={onClick}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 bg-primary/10 rounded-full group-hover:scale-110 transition-transform duration-300">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">{title}</h3>
      </div>
      <p className="text-gray-600">{content}</p>
    </Card>
  );
}