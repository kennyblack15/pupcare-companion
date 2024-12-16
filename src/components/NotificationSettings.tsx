import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Bell } from "lucide-react";

export function NotificationSettings() {
  const [pushEnabled, setPushEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadNotificationSettings();
  }, []);

  const loadNotificationSettings = async () => {
    try {
      const { data: settings } = await supabase
        .from('notification_settings')
        .select('*')
        .single();
      
      if (settings) {
        setPushEnabled(settings.push_enabled);
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading notification settings:', error);
      setIsLoading(false);
    }
  };

  const toggleNotifications = async () => {
    if (!('Notification' in window)) {
      toast({
        title: "Push notifications not supported",
        description: "Your browser doesn't support push notifications.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (!pushEnabled) {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          const registration = await navigator.serviceWorker.ready;
          const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: 'YOUR_PUBLIC_VAPID_KEY'
          });

          // Save subscription to database
          await supabase
            .from('notification_settings')
            .upsert({
              push_enabled: true,
              device_token: JSON.stringify(subscription)
            });

          setPushEnabled(true);
          toast({
            title: "Notifications enabled",
            description: "You'll now receive medication reminders.",
          });
        }
      } else {
        // Disable notifications
        await supabase
          .from('notification_settings')
          .update({ push_enabled: false })
          .eq('user_id', (await supabase.auth.getUser()).data.user?.id);

        setPushEnabled(false);
        toast({
          title: "Notifications disabled",
          description: "You won't receive medication reminders.",
        });
      }
    } catch (error) {
      console.error('Error toggling notifications:', error);
      toast({
        title: "Error",
        description: "Failed to update notification settings.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

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
        onCheckedChange={toggleNotifications}
      />
    </div>
  );
}