import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { StatsOverview } from "@/components/dashboard/StatsOverview";
import { DogProfilesSection } from "@/components/dashboard/DogProfilesSection";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { AIChatDialog } from "@/components/AIChatDialog";
import { MedicationReminders } from "@/components/dashboard/MedicationReminders";
import { NotificationSettings } from "@/components/NotificationSettings";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

// ... keep existing code (imports and component setup)

const Index = () => {
  const navigate = useNavigate();
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
        <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6 md:space-y-8">
          <div className="flex justify-between items-center">
            <div>
              <Skeleton className="h-8 md:h-10 w-48 md:w-64" />
              <Skeleton className="h-4 md:h-6 w-32 md:w-48 mt-2" />
            </div>
            <Skeleton className="h-8 md:h-10 w-24 md:w-32" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {Array(4).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-24 md:h-32" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            <div className="space-y-4">
              <Skeleton className="h-6 md:h-8 w-24 md:w-32" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array(2).fill(0).map((_, i) => (
                  <Skeleton key={i} className="h-36 md:h-48" />
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <Skeleton className="h-6 md:h-8 w-32 md:w-48" />
              <Skeleton className="h-[300px] md:h-[400px]" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-6 md:space-y-8 p-4 md:p-6 animate-fadeIn">
        <Card className="p-4 md:p-6 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-none shadow-lg">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl md:text-4xl font-bold text-gray-900 tracking-tight">
                Welcome to PawCare
              </h1>
              <p className="text-sm md:text-base text-gray-600 mt-2">
                Manage your pets' health and care in one place
              </p>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <AIChatDialog />
              <Button 
                onClick={() => navigate('/profiles')} 
                className="w-full md:w-auto gap-2 shadow-lg hover:shadow-xl transition-all duration-300 bg-primary hover:bg-primary/90"
              >
                <Plus className="w-4 h-4" />
                Add Dog
              </Button>
            </div>
          </div>
        </Card>

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
    </Layout>
  );
};

export default Index;
