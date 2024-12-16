import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export async function handleNotificationToggle(
  pushEnabled: boolean,
  setIsLoading: (loading: boolean) => void,
  setPermissionDenied: (denied: boolean) => void,
  setPushEnabled: (enabled: boolean) => void,
  toast: ReturnType<typeof useToast>["toast"]
) {
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
        
        const { data: { vapidPublicKey }, error: vapidError } = await supabase.functions.invoke('get-vapid-key');
        
        if (vapidError) {
          throw new Error('Failed to get VAPID key');
        }

        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: vapidPublicKey
        });

        await supabase.functions.invoke('send-notification', {
          body: {
            subscription,
            payload: {
              title: 'Notifications Enabled',
              body: 'You will now receive medication reminders.',
            }
          }
        });

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
}