import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Grooming = () => {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Grooming Scheduler</h1>
        <Card>
          <CardHeader>
            <CardTitle>Grooming Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Schedule and track grooming appointments.</p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Grooming;