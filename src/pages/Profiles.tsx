import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Profiles = () => {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Dog Profiles</h1>
        <Card>
          <CardHeader>
            <CardTitle>Manage Your Dogs</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Add and manage your dog profiles here.</p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Profiles;