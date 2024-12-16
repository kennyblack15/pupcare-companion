import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Training = () => {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Training Tips</h1>
        <Card>
          <CardHeader>
            <CardTitle>Daily Training Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Get personalized training tips for your dog.</p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Training;