import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { PawPrint } from "lucide-react";

interface DogCardProps {
  dog: {
    id: string;
    name: string;
    breed?: string;
    birth_date?: string;
  };
}

export function DogCard({ dog }: DogCardProps) {
  const age = dog.birth_date 
    ? calculateAge(new Date(dog.birth_date))
    : null;

  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <div className="p-2 bg-primary/10 rounded-full">
          <PawPrint className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h3 className="text-xl font-semibold">{dog.name}</h3>
          {dog.breed && <p className="text-sm text-gray-500">{dog.breed}</p>}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-gray-600">
          {age && <p>Age: {age}</p>}
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