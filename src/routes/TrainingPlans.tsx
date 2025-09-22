import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Plus, Target, Copy, Eye, Trash2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Plan, getPlans, generatePlan, deletePlan, GeneratePlanRequest } from "@/lib/plans";
import { PlanViewer } from "@/components/PlanViewer";

const TrainingPlans = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [showGenerateDialog, setShowGenerateDialog] = useState(false);
  const [newPlanData, setNewPlanData] = useState<GeneratePlanRequest>({
    profile: {
      training_level: 'Beginner',
      sport_focus: '',
    },
    distance: '',
  });
  const { toast } = useToast();
  const { profile } = useAuth();

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      const userPlans = await getPlans();
      setPlans(userPlans);
    } catch (error) {
      toast({
        title: "Error loading plans",
        description: "Failed to load your training plans. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInviteFriend = () => {
    navigator.clipboard.writeText(window.location.origin);
    toast({
      title: "Link copied!",
      description: "Share TriCoach with your friends - it's free forever!",
    });
  };

  const handleGeneratePlan = async () => {
    if (!newPlanData.distance || !newPlanData.profile.sport_focus) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setGenerating(true);
    try {
      // Use profile data from context if available
      const profileData = {
        training_level: profile?.training_level as any || newPlanData.profile.training_level,
        sport_focus: newPlanData.profile.sport_focus,
      };

      const newPlan = await generatePlan({
        profile: profileData,
        distance: newPlanData.distance,
      });

      setPlans([newPlan, ...plans]);
      setShowGenerateDialog(false);
      setNewPlanData({
        profile: { training_level: 'Beginner', sport_focus: '' },
        distance: '',
      });

      toast({
        title: "Plan generated!",
        description: "Your personalized training plan has been created.",
      });
    } catch (error) {
      toast({
        title: "Error generating plan",
        description: "Failed to generate your training plan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  const handleDeletePlan = async (planId: string) => {
    try {
      await deletePlan(planId);
      setPlans(plans.filter(p => p.id !== planId));
      if (selectedPlan?.id === planId) {
        setSelectedPlan(null);
      }
      toast({
        title: "Plan deleted",
        description: "Training plan has been removed.",
      });
    } catch (error) {
      toast({
        title: "Error deleting plan",
        description: "Failed to delete the training plan. Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (selectedPlan) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => setSelectedPlan(null)}>
            ← Back to Plans
          </Button>
        </div>
        <PlanViewer 
          plan={selectedPlan} 
          onPlanUpdate={(updatedPlan) => {
            setSelectedPlan(updatedPlan);
            setPlans(plans.map(p => p.id === updatedPlan.id ? updatedPlan : p));
          }}
        />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6" role="main" aria-labelledby="plans-title">
      <div className="flex items-center justify-between">
        <div>
          <h1 id="plans-title" className="text-3xl font-bold text-foreground">
            Training Plans
          </h1>
          <p className="text-muted-foreground">Create and manage your AI-generated training plans</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleInviteFriend} className="flex items-center gap-2">
            <Copy className="h-4 w-4" aria-hidden="true" />
            Invite a Friend
          </Button>
          
          <Dialog open={showGenerateDialog} onOpenChange={setShowGenerateDialog}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" aria-hidden="true" />
                Generate Plan
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Generate New Training Plan</DialogTitle>
                <DialogDescription>
                  Create a personalized 12-week training plan with AI
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="distance">Race Distance</Label>
                  <Select onValueChange={(value) => setNewPlanData({...newPlanData, distance: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select race distance" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Sprint Triathlon">Sprint Triathlon</SelectItem>
                      <SelectItem value="Olympic Triathlon">Olympic Triathlon</SelectItem>
                      <SelectItem value="Half Ironman 70.3">Half Ironman 70.3</SelectItem>
                      <SelectItem value="Full Ironman">Full Ironman</SelectItem>
                      <SelectItem value="5K Run">5K Run</SelectItem>
                      <SelectItem value="10K Run">10K Run</SelectItem>
                      <SelectItem value="Half Marathon">Half Marathon</SelectItem>
                      <SelectItem value="Marathon">Marathon</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="sport_focus">Sport Focus</Label>
                  <Input
                    id="sport_focus"
                    placeholder="e.g., swimming technique, cycling endurance"
                    value={newPlanData.profile.sport_focus}
                    onChange={(e) => setNewPlanData({
                      ...newPlanData,
                      profile: { ...newPlanData.profile, sport_focus: e.target.value }
                    })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="training_level">Training Level</Label>
                  <Select 
                    value={newPlanData.profile.training_level}
                    onValueChange={(value) => setNewPlanData({
                      ...newPlanData,
                      profile: { ...newPlanData.profile, training_level: value as any }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Beginner">Beginner</SelectItem>
                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                      <SelectItem value="Advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button 
                  onClick={handleGeneratePlan} 
                  disabled={generating}
                  className="w-full"
                >
                  {generating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Generating...
                    </>
                  ) : (
                    'Generate Plan'
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => (
          <Card key={plan.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{plan.title}</CardTitle>
                <Target className="h-5 w-5 text-primary" aria-hidden="true" />
              </div>
              <CardDescription>{plan.distance} • {plan.weeks.length} weeks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="mr-2 h-4 w-4" aria-hidden="true" />
                Created: {formatDate(plan.created_at)}
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => setSelectedPlan(plan)}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleDeletePlan(plan.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {plans.length === 0 && (
          <Card className="border-dashed border-2 border-muted">
            <CardContent className="flex flex-col items-center justify-center p-6 text-center min-h-[200px]">
              <Plus className="h-8 w-8 text-muted-foreground mb-4" aria-hidden="true" />
              <h3 className="text-lg font-semibold mb-2">Create Your First Plan</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Let AI generate a personalized training plan for your next race - completely free!
              </p>
              <Button onClick={() => setShowGenerateDialog(true)}>Get Started</Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TrainingPlans;