import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Plus, Calendar, Syringe, Pill, Stethoscope } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Health = () => {
  const { toast } = useToast();

  const { data: healthRecords, isLoading } = useQuery({
    queryKey: ['health_records'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('health_records')
        .select(`
          *,
          dogs (
            name
          )
        `)
        .order('record_date', { ascending: false });
      
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

  const recordTypes = {
    vaccination: {
      icon: Syringe,
      title: "Vaccinations",
      description: "Track immunization records"
    },
    medication: {
      icon: Pill,
      title: "Medications",
      description: "Monitor medications and treatments"
    },
    checkup: {
      icon: Stethoscope,
      title: "Vet Visits",
      description: "Log veterinary appointments"
    }
  };

  const renderRecordCard = (record: any) => {
    const RecordIcon = recordTypes[record.record_type as keyof typeof recordTypes]?.icon || Calendar;
    
    return (
      <Card key={record.id} className="mb-4">
        <CardHeader className="flex flex-row items-center gap-4">
          <div className="p-2 bg-primary/10 rounded-full">
            <RecordIcon className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-lg">
              {record.dogs?.name} - {recordTypes[record.record_type as keyof typeof recordTypes]?.title}
            </CardTitle>
            <p className="text-sm text-gray-500">
              {new Date(record.record_date).toLocaleDateString()}
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">{record.description}</p>
          {record.next_due_date && (
            <p className="text-sm text-primary mt-2 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Next due: {new Date(record.next_due_date).toLocaleDateString()}
            </p>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold">Health Records</h1>
            <p className="text-gray-600 mt-2">Track your pets' health history</p>
          </div>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Add Record
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(recordTypes).map(([key, { icon: Icon, title, description }]) => (
            <Card key={key} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="p-2 bg-primary/10 w-fit rounded-full mb-4">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>{title}</CardTitle>
                <p className="text-sm text-gray-500">{description}</p>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">View All</Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger value="all">All Records</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-6">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader className="flex flex-row items-center gap-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                      <div className="space-y-2">
                        <div className="h-4 w-48 bg-gray-200 rounded"></div>
                        <div className="h-3 w-32 bg-gray-200 rounded"></div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="h-4 w-full bg-gray-200 rounded"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : healthRecords?.length ? (
              healthRecords.map(renderRecordCard)
            ) : (
              <Card className="p-6 text-center">
                <CardContent>
                  <Stethoscope className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No health records found. Add your first record!</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          <TabsContent value="upcoming" className="mt-6">
            {healthRecords
              ?.filter(record => record.next_due_date && new Date(record.next_due_date) > new Date())
              .map(renderRecordCard)}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Health;