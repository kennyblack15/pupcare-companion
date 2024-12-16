import { useState } from "react";
import { useForm } from "react-hook-form";
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
import { Form } from "@/components/ui/form";
import { Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { MedicationFormFields } from "./MedicationFormFields";

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
            <MedicationFormFields form={form} />
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