import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export function useNotificationSettings() {
  const [pushEnabled, setPushEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const { toast } = useToast();

  const loadNotificationSettings = async () => {
    try {
      if (!('Notification' in window)) {
        setIsLoading(false);
        setPermissionDenied(true);
        return;
      }

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

  useEffect(() => {
    loadNotificationSettings();
  }, []);

  return {
    pushEnabled,
    isLoading,
    permissionDenied,
    setPushEnabled,
    setIsLoading,
    setPermissionDenied
  };
}