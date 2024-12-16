import { Layout } from "@/components/Layout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { StatsOverview } from "@/components/dashboard/StatsOverview";
import { DogProfilesSection } from "@/components/dashboard/DogProfilesSection";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { MedicationReminders } from "@/components/dashboard/MedicationReminders";
import { NotificationSettings } from "@/components/NotificationSettings";
import { WelcomeCard } from "@/components/dashboard/WelcomeCard";
import { LoadingDashboard } from "@/components/dashboard/LoadingDashboard";
import { ScreenshotHelper } from "@/components/screenshots/ScreenshotHelper";

const Index = () => {
  const { toast } = useToast();

  const { data: dogs, isLoading: isLoadingDogs } = useQuery({
    queryKey: ['dogs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('dogs')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        toast({
          title: "Error fetching dogs",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
      return data;
    }
  });

  const { data: healthRecords, isLoading: isLoadingHealth } = useQuery({
    queryKey: ['health_records'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('health_records')
        .select('*');
      
      if (error) {
        toast({
          title: "Error fetching health records",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
      return data;
    }
  });

  const { data: groomingTasks, isLoading: isLoadingGrooming } = useQuery({
    queryKey: ['grooming_tasks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('grooming_tasks')
        .select('*');
      
      if (error) {
        toast({
          title: "Error fetching grooming tasks",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
      return data;
    }
  });

  const isLoading = isLoadingDogs || isLoadingHealth || isLoadingGrooming;

  const upcomingEventsCount = (healthRecords?.filter(r => r.next_due_date)?.length || 0) + 
                             (groomingTasks?.filter(t => !t.completed_date)?.length || 0);

  if (isLoading) {
    return (
      <Layout>
        <LoadingDashboard />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-6 md:space-y-8 p-4 md:p-6 animate-fadeIn">
        <WelcomeCard />

        <StatsOverview
          dogsCount={dogs?.length || 0}
          healthRecordsCount={healthRecords?.length || 0}
          groomingTasksCount={groomingTasks?.length || 0}
          upcomingEventsCount={upcomingEventsCount}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-semibold mb-4 flex items-center gap-2">
              Your Dogs
              <span className="text-xs md:text-sm text-gray-500 font-normal">
                ({dogs?.length || 0} total)
              </span>
            </h2>
            <DogProfilesSection dogs={dogs} isLoading={isLoadingDogs} />
          </section>

          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-semibold mb-4">Medication Reminders</h2>
            <MedicationReminders />
            <NotificationSettings />
          </section>
        </div>

        <section className="space-y-4">
          <h2 className="text-xl md:text-2xl font-semibold mb-4">Quick Actions</h2>
          <QuickActions />
        </section>
      </div>
      {import.meta.env.DEV && <ScreenshotHelper />}
    </Layout>
  );
};

export default Index;