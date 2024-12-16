import { PawPrint } from "lucide-react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export function Logo({ size = "md", showText = true }: LogoProps) {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-10 h-10"
  };

  const textSizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl"
  };

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <PawPrint 
          className={`${sizeClasses[size]} text-primary animate-pulse`} 
          strokeWidth={2.5}
        />
        <div className="absolute inset-0 bg-primary/10 rounded-full blur-sm animate-pulse" />
      </div>
      {showText && (
        <span className={`font-bold ${textSizeClasses[size]} bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent`}>
          PawCare
        </span>
      )}
    </div>
  );
}