import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Vets = () => {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Vet Directory</h1>
        <Card>
          <CardHeader>
            <CardTitle>Find a Vet</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Locate veterinarians near you.</p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Vets;