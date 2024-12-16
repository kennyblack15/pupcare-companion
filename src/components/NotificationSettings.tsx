import { useToast } from "@/components/ui/use-toast";
import { NotificationLoader } from "./notifications/NotificationLoader";
import { NotificationError } from "./notifications/NotificationError";
import { NotificationToggle } from "./notifications/NotificationToggle";
import { useNotificationSettings } from "./notifications/useNotificationSettings";
import { handleNotificationToggle } from "./notifications/NotificationManager";

export function NotificationSettings() {
  const { toast } = useToast();
  const {
    pushEnabled,
    isLoading,
    permissionDenied,
    setPushEnabled,
    setIsLoading,
    setPermissionDenied
  } = useNotificationSettings();

  const toggleNotifications = () => {
    handleNotificationToggle(
      pushEnabled,
      setIsLoading,
      setPermissionDenied,
      setPushEnabled,
      toast
    );
  };

  if (isLoading) {
    return <NotificationLoader />;
  }

  if (permissionDenied) {
    return <NotificationError />;
  }

  return (
    <NotificationToggle
      pushEnabled={pushEnabled}
      isLoading={isLoading}
      onToggle={toggleNotifications}
    />
  );
}