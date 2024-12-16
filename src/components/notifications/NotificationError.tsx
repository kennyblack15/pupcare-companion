import { Alert, AlertDescription } from "@/components/ui/alert";

export function NotificationError() {
  return (
    <Alert variant="destructive">
      <AlertDescription>
        Notifications are blocked. Please enable them in your browser settings to receive medication reminders.
      </AlertDescription>
    </Alert>
  );
}