import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { createUserProfile } from "@/lib/auth";
import { useAuth } from "@/contexts/AuthContext";

interface OnboardingData {
  full_name: string;
  training_level: string;
  race_date: string;
  sport_focus: string;
}

interface OnboardingWizardProps {
  onComplete: () => void;
}

export function OnboardingWizard({ onComplete }: OnboardingWizardProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<OnboardingData>({
    full_name: "",
    training_level: "",
    race_date: "",
    sport_focus: "",
  });
  const { toast } = useToast();
  const { user, refreshProfile } = useAuth();

  const handleNext = () => {
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleComplete = async () => {
    if (!user) return;
    
    setLoading(true);
    
    const { error } = await createUserProfile({
      user_id: user.id,
      ...data,
    });

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      await refreshProfile();
      toast({
        title: "Welcome to TriCoach!",
        description: "Your profile has been created successfully.",
      });
      onComplete();
    }

    setLoading(false);
  };

  const updateData = (field: keyof OnboardingData, value: string) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return data.full_name.trim() !== "";
      case 2:
        return data.training_level !== "";
      case 3:
        return data.race_date !== "" && data.sport_focus.trim() !== "";
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Welcome to TriCoach</CardTitle>
          <CardDescription>
            Let's set up your training profile (Step {step} of 3)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name</Label>
                <Input
                  id="full_name"
                  placeholder="Enter your full name"
                  value={data.full_name}
                  onChange={(e) => updateData("full_name", e.target.value)}
                  required
                />
              </div>
              <Button 
                onClick={handleNext} 
                className="w-full" 
                disabled={!isStepValid()}
              >
                Next
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="training_level">Training Level</Label>
                <Select onValueChange={(value) => updateData("training_level", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your training level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleBack} className="flex-1">
                  Back
                </Button>
                <Button 
                  onClick={handleNext} 
                  className="flex-1" 
                  disabled={!isStepValid()}
                >
                  Next
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="race_date">Target Race Date</Label>
                <Input
                  id="race_date"
                  type="date"
                  value={data.race_date}
                  onChange={(e) => updateData("race_date", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sport_focus">Sport Focus</Label>
                <Input
                  id="sport_focus"
                  placeholder="e.g., Olympic Triathlon, Marathon, etc."
                  value={data.sport_focus}
                  onChange={(e) => updateData("sport_focus", e.target.value)}
                  required
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleBack} className="flex-1">
                  Back
                </Button>
                <Button 
                  onClick={handleComplete} 
                  className="flex-1" 
                  disabled={!isStepValid() || loading}
                >
                  {loading ? "Creating..." : "Complete"}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}