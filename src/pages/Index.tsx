import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { PawPrint, Heart, Calendar, MapPin } from "lucide-react";

const DashboardCard = ({ title, icon: Icon, content }: { title: string; icon: any; content: string }) => (
  <Card className="p-6 hover:shadow-lg transition-shadow">
    <div className="flex items-center gap-3 mb-4">
      <Icon className="w-6 h-6 text-primary" />
      <h3 className="text-lg font-semibold">{title}</h3>
    </div>
    <p className="text-gray-600">{content}</p>
  </Card>
);

const Index = () => {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-gray-900">Welcome to PawCare</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          <DashboardCard
            title="Daily Tip"
            icon={PawPrint}
            content="Consistency is key in dog training. Maintain regular training sessions of 10-15 minutes daily."
          />
          <DashboardCard
            title="Health Reminder"
            icon={Heart}
            content="Next vaccination due in 2 weeks. Schedule your vet appointment today!"
          />
          <DashboardCard
            title="Grooming Schedule"
            icon={Calendar}
            content="Upcoming grooming session this weekend. Don't forget to brush daily!"
          />
          <DashboardCard
            title="Nearby Vets"
            icon={MapPin}
            content="3 veterinary clinics within 5 miles of your location."
          />
        </div>
      </div>
    </Layout>
  );
};

export default Index;