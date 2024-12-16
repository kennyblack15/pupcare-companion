import { PawPrint } from "lucide-react";

export function Logo() {
  return (
    <div className="flex items-center justify-center gap-2 py-2">
      <PawPrint 
        className="h-10 w-10 text-primary" 
        strokeWidth={2}
        aria-hidden="true"
      />
      <span className="font-bold text-2xl text-primary">PawCare</span>
    </div>
  );
}