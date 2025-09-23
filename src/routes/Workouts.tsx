import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Clock, MapPin, Heart } from "lucide-react";
import { WorkoutQuickAdd } from "@/components/WorkoutQuickAdd";
import { WorkoutImportCSV } from "@/components/WorkoutImportCSV";

const Workouts = () => {
  const workouts = [
    {
      id: 1,
      type: "swim",
      title: "Endurance Swim",
      duration: "45 min",
      distance: "2000m",
      date: "Today, 6:00 AM",
      intensity: "Zone 2",
      completed: true,
      rpe: 6
    },
    {
      id: 2,
      type: "bike",
      title: "Hill Intervals",
      duration: "60 min",
      distance: "35km",
      date: "Yesterday, 5:30 PM",
      intensity: "Zone 4",
      completed: true,
      rpe: 8
    },
    {
      id: 3,
      type: "run",
      title: "Easy Run",
      duration: "30 min",
      distance: "5km",
      date: "Tomorrow, 7:00 AM",
      intensity: "Zone 1",
      completed: false,
      rpe: null
    }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'swim': return 'bg-swim';
      case 'bike': return 'bg-bike';
      case 'run': return 'bg-run';
      default: return 'bg-muted';
    }
  };

  const getIntensityVariant = (intensity: string) => {
    if (intensity.includes('1') || intensity.includes('2')) return 'secondary';
    if (intensity.includes('3') || intensity.includes('4')) return 'default';
    return 'destructive';
  };

  return (
    <div className="space-y-6" role="main" aria-labelledby="workouts-title">
      <div className="flex items-center justify-between">
        <div>
          <h1 id="workouts-title" className="text-3xl font-bold text-foreground">
            Workouts
          </h1>
          <p className="text-muted-foreground">Track and log your training sessions</p>
        </div>
        <div className="flex gap-2">
          <WorkoutImportCSV />
          <WorkoutQuickAdd />
        </div>
      </div>

      <div className="space-y-4">
        {workouts.map((workout) => (
          <Card key={workout.id} className={workout.completed ? 'bg-muted/30' : ''}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${getTypeColor(workout.type)}`} aria-hidden="true"></div>
                  <CardTitle className="text-lg">{workout.title}</CardTitle>
                  <Badge variant={getIntensityVariant(workout.intensity)}>
                    {workout.intensity}
                  </Badge>
                </div>
                {workout.completed && (
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    Completed
                  </Badge>
                )}
              </div>
              <CardDescription className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" aria-hidden="true" />
                  {workout.date}
                </span>
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                    <span>{workout.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                    <span>{workout.distance}</span>
                  </div>
                  {workout.rpe && (
                    <div className="flex items-center gap-1">
                      <Heart className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                      <span>RPE {workout.rpe}/10</span>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  {workout.completed ? (
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  ) : (
                    <>
                      <Button variant="outline" size="sm">
                        Skip
                      </Button>
                      <Button size="sm">
                        Start Workout
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Workouts;