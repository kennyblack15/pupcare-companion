import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AIChatDialog } from "@/components/AIChatDialog";

export function WelcomeCard() {
  const navigate = useNavigate();

  return (
    <Card className="p-4 md:p-6 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-none shadow-lg">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900 tracking-tight">
            Welcome to PawCare
          </h1>
          <p className="text-sm md:text-base text-gray-600 mt-2">
            Manage your pets' health and care in one place
          </p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <AIChatDialog />
          <Button 
            onClick={() => navigate('/profiles')} 
            className="w-full md:w-auto gap-2 shadow-lg hover:shadow-xl transition-all duration-300 bg-primary hover:bg-primary/90"
          >
            <Plus className="w-4 h-4" />
            Add Dog
          </Button>
        </div>
      </div>
    </Card>
  );
}