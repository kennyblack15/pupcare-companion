import { Loader2 } from "lucide-react";

export function NotificationLoader() {
  return (
    <div className="flex items-center justify-center p-4 bg-white rounded-lg shadow">
      <Loader2 className="w-6 h-6 animate-spin text-primary" />
      <span className="ml-2">Loading notification settings...</span>
    </div>
  );
}