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

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: dogs, isLoading } = useQuery({
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

  const upcomingEventsCount = (healthRecords?.filter(r => r.next_due_date)?.length || 0) + 
                             (groomingTasks?.filter(t => !t.completed_date)?.length || 0);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-8 p-6 animate-fadeIn">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Welcome to PawCare</h1>
            <p className="text-gray-600 mt-2">Manage your pets' health and care in one place</p>
          </div>
          <Button onClick={() => navigate('/profiles')} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Dog
          </Button>
        </div>

        <StatsOverview
          dogsCount={dogs?.length || 0}
          healthRecordsCount={healthRecords?.length || 0}
          groomingTasksCount={groomingTasks?.length || 0}
          upcomingEventsCount={upcomingEventsCount}
        />

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold mb-4">Your Dogs</h2>
          <DogProfilesSection dogs={dogs} isLoading={isLoading} />
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold mb-4">Quick Actions</h2>
          <QuickActions />
        </section>
      </div>
    </Layout>
  );
};

export default Index;