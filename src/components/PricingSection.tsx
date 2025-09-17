import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Zap } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for getting started with triathlon training",
    features: [
      "1 race plan",
      "Basic workout logging",
      "Limited analytics",
      "Community support",
      "Mobile app access"
    ],
    cta: "Start Free",
    variant: "outline" as const,
    popular: false
  },
  {
    name: "Pro",
    price: "$12",
    period: "per month",
    description: "For serious athletes who want AI-powered optimization",
    features: [
      "Unlimited race plans",
      "AI training adjustments",
      "Advanced analytics",
      "Coach dashboard access",
      "Device integrations",
      "Custom training zones",
      "Race day strategies",
      "Priority support"
    ],
    cta: "Start 14-Day Trial",
    variant: "hero" as const,
    popular: true
  },
  {
    name: "Team",
    price: "$29",
    period: "per month",
    description: "For coaches managing multiple athletes",
    features: [
      "Everything in Pro",
      "Up to 10 athletes",
      "Team analytics dashboard",
      "Bulk plan creation",
      "Advanced coaching tools",
      "White-label options",
      "API access",
      "Dedicated support"
    ],
    cta: "Contact Sales",
    variant: "secondary" as const,
    popular: false
  }
];

const PricingSection = () => {
  return (
    <section id="pricing" className="py-16 sm:py-24 bg-gradient-subtle">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground mb-4">
            Choose Your Training Level
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Start free and upgrade as you progress. All plans include our core training features.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card key={index} className={`relative ${plan.popular ? 'border-primary shadow-glow scale-105' : ''} hover:shadow-primary transition-all duration-300`}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-athletic text-white px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                    <Zap className="h-3 w-3" />
                    Most Popular
                  </div>
                </div>
              )}
              
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-muted-foreground">/{plan.period}</span>
                </div>
                <CardDescription className="mt-2">
                  {plan.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3">
                      <Check className="h-4 w-4 text-success flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button variant={plan.variant} className="w-full" size="lg">
                  {plan.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground">
            All plans include a 14-day free trial. No credit card required.
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;