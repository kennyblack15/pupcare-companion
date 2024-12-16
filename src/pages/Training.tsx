import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, PlayCircle, Award, Book } from "lucide-react";
import { AIChatDialog } from "@/components/AIChatDialog";

const trainingCategories = [
  {
    title: "Basic Commands",
    description: "Master essential commands like sit, stay, come, and heel",
    icon: Brain,
  },
  {
    title: "Behavior Training",
    description: "Address common behavioral issues and establish good habits",
    icon: Award,
  },
  {
    title: "Puppy Training",
    description: "Start your puppy's training journey with foundational skills",
    icon: PlayCircle,
  },
  {
    title: "Advanced Training",
    description: "Take your dog's skills to the next level with advanced techniques",
    icon: Book,
  },
];

const Training = () => {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold">Training Tips</h1>
            <p className="text-gray-600 mt-2">Expert guidance for training your dog</p>
          </div>
          <AIChatDialog />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {trainingCategories.map((category) => (
            <Card key={category.title} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="p-2 bg-primary/10 w-fit rounded-full mb-4">
                  <category.icon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>{category.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{category.description}</p>
                <Button variant="outline" className="w-full">
                  View Tips
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Need personalized training advice?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              Our AI assistant can help you with specific training questions and provide
              tailored advice for your dog's needs.
            </p>
            <AIChatDialog />
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Training;