import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Plus, Target } from "lucide-react";

const Plans = () => {
  return (
    <div className="space-y-6" role="main" aria-labelledby="plans-title">
      <div className="flex items-center justify-between">
        <div>
          <h1 id="plans-title" className="text-3xl font-bold text-foreground">
            Training Plans
          </h1>
          <p className="text-muted-foreground">Manage your AI-generated training plans</p>
        </div>
        <Button className="flex items-center gap-2" aria-label="Create new training plan">
          <Plus className="h-4 w-4" aria-hidden="true" />
          New Plan
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Ironman 70.3 Plan</CardTitle>
              <Target className="h-5 w-5 text-primary" aria-hidden="true" />
            </div>
            <CardDescription>12-week comprehensive training plan</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="mr-2 h-4 w-4" aria-hidden="true" />
              Race Date: June 15, 2024
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>6/12 weeks</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full" 
                  style={{ width: '50%' }}
                  role="progressbar"
                  aria-valuenow={50}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label="Training plan progress: 50%"
                ></div>
              </div>
            </div>
            <Button variant="outline" className="w-full">
              View Plan
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Sprint Recovery</CardTitle>
              <Target className="h-5 w-5 text-secondary" aria-hidden="true" />
            </div>
            <CardDescription>4-week active recovery plan</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="mr-2 h-4 w-4" aria-hidden="true" />
              Started: March 1, 2024
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>2/4 weeks</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-secondary h-2 rounded-full" 
                  style={{ width: '50%' }}
                  role="progressbar"
                  aria-valuenow={50}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label="Recovery plan progress: 50%"
                ></div>
              </div>
            </div>
            <Button variant="outline" className="w-full">
              View Plan
            </Button>
          </CardContent>
        </Card>

        <Card className="border-dashed border-2 border-muted">
          <CardContent className="flex flex-col items-center justify-center p-6 text-center min-h-[200px]">
            <Plus className="h-8 w-8 text-muted-foreground mb-4" aria-hidden="true" />
            <h3 className="text-lg font-semibold mb-2">Create New Plan</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Let AI generate a personalized training plan for your next race
            </p>
            <Button>Get Started</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Plans;