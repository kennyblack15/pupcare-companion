import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { PawPrint, Heart, Calendar, MapPin, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DogCard } from "@/components/DogCard";

const DashboardCard = ({ title, icon: Icon, content, onClick }: { 
  title: string; 
  icon: any; 
  content: string;
  onClick?: () => void;
}) => (
  <Card 
    className="p-6 hover:shadow-lg transition-shadow cursor-pointer" 
    onClick={onClick}
  >
    <div className="flex items-center gap-3 mb-4">
      <Icon className="w-6 h-6 text-primary" />
      <h3 className="text-lg font-semibold">{title}</h3>
    </div>
    <p className="text-gray-600">{content}</p>
  </Card>
);

const Index = () => {
  const navigate = useNavigate();

  const { data: dogs, isLoading } = useQuery({
    queryKey: ['dogs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('dogs')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-12 p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Welcome to PawCare</h1>
          <Button onClick={() => navigate('/profiles')} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Dog
          </Button>
        </div>

        {/* Dog Profiles Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold mb-4">Your Dogs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              <Card className="p-6 animate-pulse">
                <div className="h-24 bg-gray-200 rounded-lg"></div>
              </Card>
            ) : dogs?.length ? (
              dogs.map((dog) => (
                <DogCard key={dog.id} dog={dog} />
              ))
            ) : (
              <Card className="p-6 text-center">
                <p className="text-gray-500">No dogs added yet. Add your first dog!</p>
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