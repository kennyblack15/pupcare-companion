import { PawPrint } from "lucide-react";

export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <PawPrint className="h-8 w-8 text-purple-600" strokeWidth={1.5} />
      <span className="font-semibold text-xl text-purple-600">PawCare</span>
    </div>
  );
}