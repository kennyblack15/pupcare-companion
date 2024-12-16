import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { PawPrint, Heart, Calendar, MapPin, Plus, HeartPulse, Dog, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DogCard } from "@/components/DogCard";
import { useToast } from "@/components/ui/use-toast";

const DashboardCard = ({ title, icon: Icon, content, onClick }: { 
  title: string; 
  icon: any; 
  content: string;
  onClick?: () => void;
}) => (
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

const StatsCard = ({ title, value, icon: Icon }: {
  title: string;
  value: string | number;
  icon: any;
}) => (
  <Card className="p-4 bg-white">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold mt-1">{value}</p>
      </div>
      <div className="p-3 bg-primary/10 rounded-full">
        <Icon className="w-6 h-6 text-primary" />
      </div>
    </div>
  </Card>
);

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

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Pets"
            value={dogs?.length || 0}
            icon={Dog}
          />
          <StatsCard
            title="Health Records"
            value={healthRecords?.length || 0}
            icon={HeartPulse}
          />
          <StatsCard
            title="Grooming Tasks"
            value={groomingTasks?.length || 0}
            icon={Calendar}
          />
          <StatsCard
            title="Upcoming Events"
            value={(healthRecords?.filter(r => r.next_due_date)?.length || 0) + 
                   (groomingTasks?.filter(t => !t.completed_date)?.length || 0)}
            icon={Bell}
          />
        </div>

        {/* Dog Profiles Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold mb-4">Your Dogs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              Array(3).fill(0).map((_, i) => (
                <Card key={i} className="p-6 animate-pulse">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                    <div className="space-y-2">
                      <div className="h-4 w-24 bg-gray-200 rounded"></div>
                      <div className="h-3 w-16 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </Card>
              ))
            ) : dogs?.length ? (
              dogs.map((dog) => (
                <DogCard key={dog.id} dog={dog} />
              ))
            ) : (
              <Card className="p-6 text-center col-span-full">
                <PawPrint className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No dogs added yet. Add your first dog!</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => navigate('/profiles')}
                >
                  Add Dog
                </Button>
              </Card>
            )}
          </div>
        </section>

        {/* Quick Actions */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold mb-4">Quick Actions</h2>
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
        </section>
      </div>
    </Layout>
  );
};

export default Index;