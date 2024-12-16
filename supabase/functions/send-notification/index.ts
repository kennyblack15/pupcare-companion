import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import webpush from "npm:web-push@3.6.7"

// Replace these with your actual VAPID keys
const VAPID_PUBLIC_KEY = "YOUR_PUBLIC_VAPID_KEY"
const VAPID_PRIVATE_KEY = "YOUR_PRIVATE_VAPID_KEY"

webpush.setVapidDetails(
  'mailto:your-email@example.com',
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY
)

serve(async (req) => {
  try {
    const { subscription, payload } = await req.json()

    await webpush.sendNotification(
      subscription,
      JSON.stringify(payload)
    )

    return new Response(
      JSON.stringify({ message: "Notification sent successfully" }),
      {
        headers: { "Content-Type": "application/json" },
        status: 200,
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { "Content-Type": "application/json" },
        status: 500,
      }
    )
  }
})