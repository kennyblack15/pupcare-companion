import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Dog, Scale } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { Input } from "./ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./ui/use-toast";

interface DogCardProps {
  dog: {
    id: string;
    name: string;
    breed?: string;
    birth_date?: string;
    weight?: number;
  };
}

export function DogCard({ dog }: DogCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [weight, setWeight] = useState(dog.weight?.toString() || "");
  const { toast } = useToast();
  
  const age = dog.birth_date 
    ? calculateAge(new Date(dog.birth_date))
    : null;

  const handleWeightUpdate = async () => {
    try {
      const { error } = await supabase
        .from('dogs')
        .update({ weight: parseFloat(weight) })
        .eq('id', dog.id);

      if (error) throw error;

      toast({
        title: "Weight updated",
        description: `${dog.name}'s weight has been updated to ${weight} kg`,
      });
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update weight",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-white">
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <div className="p-2 bg-primary/10 rounded-full">
          <Dog className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h3 className="text-xl font-semibold">{dog.name}</h3>
          {dog.breed && <p className="text-sm text-gray-500">{dog.breed}</p>}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {age && <p className="text-sm text-gray-600">Age: {age}</p>}
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-gray-500" />
            {isEditing ? (
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-24"
                  placeholder="Weight (kg)"
                />
                <Button size="sm" onClick={handleWeightUpdate}>Save</Button>
                <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  {dog.weight ? `${dog.weight} kg` : "No weight recorded"}
                </span>
                <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
                  Update
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function calculateAge(birthDate: Date): string {
  const today = new Date();
  const years = today.getFullYear() - birthDate.getFullYear();
  const months = today.getMonth() - birthDate.getMonth();
  
  if (months < 0 || (months === 0 && today.getDate() < birthDate.getDate())) {
    return `${years - 1} years`;
  }
  
  if (years === 0) {
    return `${months} months`;
  }
  
  return `${years} years`;
}