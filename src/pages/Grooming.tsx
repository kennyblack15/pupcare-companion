import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Plus, Scissors, Calendar, Check, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Grooming = () => {
  const { toast } = useToast();

  const { data: groomingTasks, isLoading } = useQuery({
    queryKey: ['grooming_tasks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('grooming_tasks')
        .select(`
          *,
          dogs (
            name
          )
        `)
        .order('due_date', { ascending: true });
      
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

  const renderTaskCard = (task: any) => (
    <Card key={task.id} className="mb-4">
      <CardHeader className="flex flex-row items-center gap-4">
        <div className="p-2 bg-primary/10 rounded-full">
          <Scissors className="w-6 h-6 text-primary" />
        </div>
        <div className="flex-1">
          <CardTitle className="text-lg">
            {task.dogs?.name} - {task.task_type}
          </CardTitle>
          <p className="text-sm text-gray-500">
            Due: {new Date(task.due_date).toLocaleDateString()}
          </p>
        </div>
        {task.completed_date ? (
          <div className="flex items-center gap-2 text-green-600">
            <Check className="w-5 h-5" />
            <span className="text-sm">Completed</span>
          </div>
        ) : (
          <Button variant="outline" size="sm">Mark Complete</Button>
        )}
      </CardHeader>
      {task.notes && (
        <CardContent>
          <p className="text-gray-600">{task.notes}</p>
        </CardContent>
      )}
    </Card>
  );

  return (
    <Layout>
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold">Grooming Schedule</h1>
            <p className="text-gray-600 mt-2">Manage your pets' grooming appointments</p>
          </div>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Add Task
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="p-2 bg-primary/10 w-fit rounded-full mb-4">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Upcoming</CardTitle>
              <p className="text-2xl font-bold text-primary">
                {groomingTasks?.filter(t => !t.completed_date).length || 0}
              </p>
            </CardHeader>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="p-2 bg-green-100 w-fit rounded-full mb-4">
                <Check className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle>Completed</CardTitle>
              <p className="text-2xl font-bold text-green-600">
                {groomingTasks?.filter(t => t.completed_date).length || 0}
              </p>
            </CardHeader>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="p-2 bg-blue-100 w-fit rounded-full mb-4">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle>Total Tasks</CardTitle>
              <p className="text-2xl font-bold text-blue-600">
                {groomingTasks?.length || 0}
              </p>
            </CardHeader>
          </Card>
        </div>

        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="all">All Tasks</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming" className="mt-6">
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
                  </Card>
                ))}
              </div>
            ) : (
              groomingTasks
                ?.filter(task => !task.completed_date)
                .map(renderTaskCard)
            )}
          </TabsContent>
          
          <TabsContent value="completed" className="mt-6">
            {groomingTasks
              ?.filter(task => task.completed_date)
              .map(renderTaskCard)}
          </TabsContent>
          
          <TabsContent value="all" className="mt-6">
            {groomingTasks?.map(renderTaskCard)}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Grooming;