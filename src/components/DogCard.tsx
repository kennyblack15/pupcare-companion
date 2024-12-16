import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { AddMedicationDialog } from "./medications/AddMedicationDialog";

interface Dog {
  id: string;
  name: string;
  breed?: string;
  birth_date?: string;
  weight?: number;
}

export function DogCard({ dog }: { dog: Dog }) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">{dog.name}</h3>
          {dog.breed && <p className="text-gray-600">{dog.breed}</p>}
        </div>
        <AddMedicationDialog dogId={dog.id} />
      </div>
      <div className="space-y-2">
        {dog.birth_date && (
          <p className="text-sm text-gray-500">
            Born: {format(new Date(dog.birth_date), "MMM d, yyyy")}
          </p>
        )}
        {dog.weight && (
          <p className="text-sm text-gray-500">Weight: {dog.weight} lbs</p>
        )}
      </div>
    </Card>
  );
}