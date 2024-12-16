import { Check } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const tiers = [
  {
    name: "Free",
    price: "$0",
    description: "Essential features for basic dog care",
    features: [
      "Dog profile management",
      "Basic care tips",
      "Care reminders",
      "Community access"
    ]
  },
  {
    name: "Premium",
    price: "$9.99/month",
    description: "Advanced features for comprehensive pet care",
    features: [
      "All Free features",
      "Health tracking & analytics",
      "Expert training tips",
      "Vet directory access",
      "Priority support"
    ]
  }
];

export function SubscriptionTiers() {
  return (
    <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
      {tiers.map((tier) => (
        <Card key={tier.name} className="flex flex-col">
          <CardHeader>
            <CardTitle className="text-2xl">{tier.name}</CardTitle>
            <CardDescription className="text-xl font-semibold">{tier.price}</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="text-muted-foreground mb-4">{tier.description}</p>
            <ul className="space-y-2">
              {tier.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full">
              {tier.name === "Free" ? "Get Started" : "Upgrade Now"}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}