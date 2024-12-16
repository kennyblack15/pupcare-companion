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
      className="p-6 hover:shadow-lg transition-shadow cursor-pointer bg-white" 
      onClick={onClick}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-primary/10 rounded-full">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <p className="text-gray-600">{content}</p>
    </Card>
  );
}