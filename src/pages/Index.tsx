import { Layout } from "@/components/Layout";
import { WelcomeCard } from "@/components/dashboard/WelcomeCard";
import { StatsOverview } from "@/components/dashboard/StatsOverview";
import { DogProfilesSection } from "@/components/dashboard/DogProfilesSection";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { MedicationReminders } from "@/components/dashboard/MedicationReminders";
import { ScreenshotHelper } from "@/components/screenshots/ScreenshotHelper";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export default function Index() {
  const { toast } = useToast();

  const { data: dogs, isLoading: isLoadingDogs } = useQuery({
    queryKey: ['dogs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('dogs')
        .select('*');
      if (error) throw error;
      return data;
    }
  });

  const { data: healthRecords } = useQuery({
    queryKey: ['health_records'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('health_records')
        .select('*');
      if (error) throw error;
      return data;
    }
  });

  const { data: groomingTasks } = useQuery({
    queryKey: ['grooming_tasks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('grooming_tasks')
        .select('*');
      if (error) throw error;
      return data;
    }
  });

  const upcomingEventsCount = 
    (healthRecords?.filter(r => r.next_due_date)?.length || 0) + 
    (groomingTasks?.filter(t => !t.completed_date)?.length || 0);

  return (
    <Layout>
      <div className="space-y-6">
        <WelcomeCard />
        <StatsOverview 
          dogsCount={dogs?.length || 0}
          healthRecordsCount={healthRecords?.length || 0}
          groomingTasksCount={groomingTasks?.length || 0}
          upcomingEventsCount={upcomingEventsCount}
        />
        <div className="grid gap-6 md:grid-cols-2">
          <DogProfilesSection dogs={dogs || []} isLoading={isLoadingDogs} />
          <MedicationReminders />
        </div>
        <QuickActions />
      </div>
      <ScreenshotHelper />
    </Layout>
  );
}