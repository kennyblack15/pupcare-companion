import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { AddMedicationDialog } from "./medications/AddMedicationDialog";
import { Dog as DogIcon, Calendar, Weight, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

interface Dog {
  id: string;
  name: string;
  breed?: string;
  birth_date?: string;
  weight?: number;
}

export function DogCard({ dog }: { dog: Dog }) {
  const navigate = useNavigate();

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-full">
            <DogIcon className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">{dog.name}</h3>
            {dog.breed && <p className="text-gray-600 text-sm">{dog.breed}</p>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <AddMedicationDialog dogId={dog.id} />
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate(`/health?dogId=${dog.id}`)}
            className="text-gray-500 hover:text-primary"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
      <div className="space-y-2">
        {dog.birth_date && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar className="w-4 h-4" />
            <span>Born: {format(new Date(dog.birth_date), "MMM d, yyyy")}</span>
          </div>
        )}
        {dog.weight && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Weight className="w-4 h-4" />
            <span>Weight: {dog.weight} lbs</span>
          </div>
        )}
      </div>
    </Card>
  );
}