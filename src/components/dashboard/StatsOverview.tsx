import { Dog, HeartPulse, Calendar, Bell } from "lucide-react";
import { StatsCard } from "./StatsCard";

interface StatsOverviewProps {
  dogsCount: number;
  healthRecordsCount: number;
  groomingTasksCount: number;
  upcomingEventsCount: number;
}

export function StatsOverview({ 
  dogsCount, 
  healthRecordsCount, 
  groomingTasksCount, 
  upcomingEventsCount 
}: StatsOverviewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatsCard
        title="Total Pets"
        value={dogsCount}
        icon={Dog}
      />
      <StatsCard
        title="Health Records"
        value={healthRecordsCount}
        icon={HeartPulse}
      />
      <StatsCard
        title="Grooming Tasks"
        value={groomingTasksCount}
        icon={Calendar}
      />
      <StatsCard
        title="Upcoming Events"
        value={upcomingEventsCount}
        icon={Bell}
      />
    </div>
  );
}