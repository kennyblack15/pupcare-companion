import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pill, Clock } from "lucide-react";
import { format } from "date-fns";

export function MedicationReminders() {
  const { data: medications, isLoading } = useQuery({
    queryKey: ['medications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('medications')
        .select(`
          *,
          dogs (
            name
          )
        `)
        .gte('end_date', new Date().toISOString())
        .order('start_date', { ascending: true });
      
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading medications...</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  if (!medications?.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Medication Reminders</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">No active medications</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Pill className="w-5 h-5" />
          Medication Reminders
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {medications.map((med) => (
            <div key={med.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="p-2 bg-primary/10 rounded-full">
                <Clock className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h4 className="font-medium">{med.name}</h4>
                <p className="text-sm text-gray-600">
                  For {med.dogs.name} - {med.dosage}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {format(new Date(med.start_date), 'MMM d, yyyy')} - {format(new Date(med.end_date), 'MMM d, yyyy')}
                </p>
                <p className="text-sm text-gray-500">
                  {med.frequency} at {med.time_of_day.map((time) => format(new Date(`2000-01-01T${time}`), 'h:mm a')).join(', ')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}