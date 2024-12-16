import { Bell } from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface NotificationToggleProps {
  pushEnabled: boolean;
  isLoading: boolean;
  onToggle: () => void;
}

export function NotificationToggle({ pushEnabled, isLoading, onToggle }: NotificationToggleProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-full">
          <Bell className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-medium">Push Notifications</h3>
          <p className="text-sm text-gray-500">
            Receive medication reminders on your device
          </p>
        </div>
      </div>
      <Switch
        checked={pushEnabled}
        onCheckedChange={onToggle}
        disabled={isLoading}
      />
    </div>
  );
}