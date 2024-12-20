import { PawPrint } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center gap-2 py-2", className)}>
      <div className="relative">
        <PawPrint 
          className="h-10 w-10 text-primary animate-pulse" 
          strokeWidth={2.5}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-sm" />
      </div>
      <div className="flex flex-col items-start">
        <span className="font-bold text-2xl bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          PawCare
        </span>
        <span className="text-xs text-muted-foreground -mt-1">
          Companion
        </span>
      </div>
    </div>
  );
}