import { Layout } from "@/components/Layout";
import { WelcomeCard } from "@/components/dashboard/WelcomeCard";
import { StatsOverview } from "@/components/dashboard/StatsOverview";
import { DogProfilesSection } from "@/components/dashboard/DogProfilesSection";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { MedicationReminders } from "@/components/dashboard/MedicationReminders";
import { ScreenshotHelper } from "@/components/screenshots/ScreenshotHelper";

export default function Index() {
  return (
    <Layout>
      <div className="space-y-6">
        <WelcomeCard />
        <StatsOverview />
        <div className="grid gap-6 md:grid-cols-2">
          <DogProfilesSection />
          <MedicationReminders />
        </div>
        <QuickActions />
      </div>
      <ScreenshotHelper />
    </Layout>
  );
}