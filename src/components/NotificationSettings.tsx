import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Bell, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function NotificationSettings() {
  const [pushEnabled, setPushEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadNotificationSettings();
  }, []);

  const loadNotificationSettings = async () => {
    try {
      // Check if notifications are supported
      if (!('Notification' in window)) {
        setIsLoading(false);
        setPermissionDenied(true);
        return;
      }

      // Check current permission status
      const permission = await Notification.permission;
      if (permission === 'denied') {
        setPermissionDenied(true);
        setIsLoading(false);
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setIsLoading(false);
        return;
      }

      const { data: settings } = await supabase
        .from('notification_settings')
        .select('*')
        .eq('user_id', user.id)
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
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to manage notifications.",
          variant: "destructive",
        });
        return;
      }

      if (!pushEnabled) {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          const registration = await navigator.serviceWorker.ready;
          
          // Get VAPID public key from Edge Function
          const { data: { vapidPublicKey }, error: vapidError } = await supabase.functions.invoke('get-vapid-key');
          
          if (vapidError) {
            throw new Error('Failed to get VAPID key');
          }

          const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: vapidPublicKey
          });

          // Test notification via Edge Function
          await supabase.functions.invoke('send-notification', {
            body: {
              subscription,
              payload: {
                title: 'Notifications Enabled',
                body: 'You will now receive medication reminders.',
              }
            }
          });

          // Save subscription to database
          await supabase
            .from('notification_settings')
            .upsert({
              user_id: user.id,
              push_enabled: true,
              device_token: JSON.stringify(subscription)
            });

          setPushEnabled(true);
          toast({
            title: "Notifications enabled",
            description: "You'll now receive medication reminders.",
          });
        } else if (permission === 'denied') {
          setPermissionDenied(true);
          toast({
            title: "Permission denied",
            description: "Please enable notifications in your browser settings.",
            variant: "destructive",
          });
        }
      } else {
        // Disable notifications
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        if (subscription) {
          await subscription.unsubscribe();
        }

        await supabase
          .from('notification_settings')
          .update({ 
            push_enabled: false,
            device_token: null
          })
          .eq('user_id', user.id);

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
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4 bg-white rounded-lg shadow">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
        <span className="ml-2">Loading notification settings...</span>
      </div>
    );
  }

  if (permissionDenied) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Notifications are blocked. Please enable them in your browser settings to receive medication reminders.
        </AlertDescription>
      </Alert>
    );
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
        disabled={isLoading}
      />
    </div>
  );
}