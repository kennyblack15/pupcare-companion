import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Health = () => {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Health Tracker</h1>
        <Card>
          <CardHeader>
            <CardTitle>Health Records</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Track vet visits, vaccinations, and weight here.</p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Health;