import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Plus, MapPin, Phone, Building } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const Vets = () => {
  const { toast } = useToast();

  const { data: vets, isLoading } = useQuery({
    queryKey: ['saved_vets'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('saved_vets')
        .select('*')
        .order('name');
      
      if (error) {
        toast({
          title: "Error fetching veterinarians",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
      return data;
    }
  });

  return (
    <Layout>
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold">Veterinarians</h1>
            <p className="text-gray-600 mt-2">Find and save trusted veterinarians</p>
          </div>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Add Vet
          </Button>
        </div>

        <div className="flex gap-4 mb-8">
          <Input
            placeholder="Search by name or location..."
            className="max-w-md"
          />
          <Button variant="outline">Search</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            Array(6).fill(0).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                  <div className="space-y-2">
                    <div className="h-4 w-48 bg-gray-200 rounded"></div>
                    <div className="h-3 w-32 bg-gray-200 rounded"></div>
                  </div>
                </CardHeader>
              </Card>
            ))
          ) : vets?.length ? (
            vets.map((vet) => (
              <Card key={vet.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="p-2 bg-primary/10 w-fit rounded-full mb-4">
                    <Building className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>{vet.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {vet.address && (
                    <div className="flex items-start gap-2 text-gray-600">
                      <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" />
                      <span>{vet.address}</span>
                    </div>
                  )}
                  {vet.phone && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="w-5 h-5" />
                      <span>{vet.phone}</span>
                    </div>
                  )}
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" className="flex-1">View Details</Button>
                    <Button variant="outline" className="flex-1">Get Directions</Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="col-span-full p-6 text-center">
              <CardContent>
                <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No veterinarians saved yet. Add your first one!</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Vets;