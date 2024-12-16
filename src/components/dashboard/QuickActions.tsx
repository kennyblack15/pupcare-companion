import { PawPrint, Heart, Calendar, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DashboardCard } from "./DashboardCard";

export function QuickActions() {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
      <DashboardCard
        title="Health Records"
        icon={Heart}
        content="Track vaccinations, medications, and vet visits"
        onClick={() => navigate('/health')}
      />
      <DashboardCard
        title="Grooming Schedule"
        icon={Calendar}
        content="Manage grooming appointments and tasks"
        onClick={() => navigate('/grooming')}
      />
      <DashboardCard
        title="Training Tips"
        icon={PawPrint}
        content="Access personalized training recommendations"
        onClick={() => navigate('/training')}
      />
      <DashboardCard
        title="Find a Vet"
        icon={MapPin}
        content="Locate and save trusted veterinarians nearby"
        onClick={() => navigate('/vets')}
      />
    </div>
  );
}