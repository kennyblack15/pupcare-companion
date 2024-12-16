import { DogCard } from "@/components/DogCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PawPrint } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface DogProfilesSectionProps {
  dogs: any[];
  isLoading: boolean;
}

export function DogProfilesSection({ dogs, isLoading }: DogProfilesSectionProps) {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array(3).fill(0).map((_, i) => (
          <Card key={i} className="p-6 animate-pulse">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
              <div className="space-y-2">
                <div className="h-4 w-24 bg-gray-200 rounded"></div>
                <div className="h-3 w-16 bg-gray-200 rounded"></div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (!dogs?.length) {
    return (
      <Card className="p-6 text-center col-span-full">
        <PawPrint className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">No dogs added yet. Add your first dog!</p>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={() => navigate('/profiles')}
        >
          Add Dog
        </Button>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {dogs.map((dog) => (
        <DogCard key={dog.id} dog={dog} />
      ))}
    </div>
  );
}