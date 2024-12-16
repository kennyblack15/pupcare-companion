import { useState } from "react";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface AddMedicationFormData {
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate: string;
  timeOfDay: string[];
  notes?: string;
  dogId: string;
}

export function AddMedicationDialog({ dogId }: { dogId: string }) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<AddMedicationFormData>({
    defaultValues: {
      dogId,
      frequency: "daily",
      timeOfDay: ["08:00"],
    },
  });

  const onSubmit = async (data: AddMedicationFormData) => {
    try {
      const { error } = await supabase.from("medications").insert({
        dog_id: data.dogId,
        name: data.name,
        dosage: data.dosage,
        frequency: data.frequency,
        start_date: data.startDate,
        end_date: data.endDate,
        time_of_day: data.timeOfDay,
        notes: data.notes,
      });

      if (error) throw error;

      toast({
        title: "Medication added",
        description: "The medication has been added successfully.",
      });

      queryClient.invalidateQueries({ queryKey: ["medications"] });
      setOpen(false);
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add medication. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Plus className="w-4 h-4" />
          Add Medication
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Medication</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Medication Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter medication name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dosage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dosage</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g., 1 tablet" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="frequency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Frequency</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="timeOfDay"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Time of Day</FormLabel>
                  <FormControl>
                    <Input
                      type="time"
                      value={field.value?.[0] || ""}
                      onChange={(e) => field.onChange([e.target.value])}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Add any additional notes" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Add Medication</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}