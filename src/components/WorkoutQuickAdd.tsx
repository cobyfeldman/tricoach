import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createWorkout, type Sport, type WorkoutData } from "@/lib/workouts";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";

const workoutSchema = z.object({
  date: z.string().min(1, "Date is required"),
  sport: z.enum(['swim', 'bike', 'run']),
  distance_m: z.number().min(1, "Distance must be greater than 0"),
  duration_s: z.number().min(1, "Duration must be greater than 0"),
  rpe: z.number().min(1).max(10),
  notes: z.string().optional(),
});

type WorkoutFormData = z.infer<typeof workoutSchema>;

interface WorkoutQuickAddProps {
  onWorkoutAdded?: () => void;
}

export function WorkoutQuickAdd({ onWorkoutAdded }: WorkoutQuickAddProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<WorkoutFormData>({
    resolver: zodResolver(workoutSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      sport: 'run' as Sport,
      distance_m: 0,
      duration_s: 0,
      rpe: 5,
      notes: '',
    },
  });

  const onSubmit = async (data: WorkoutFormData) => {
    setIsSubmitting(true);
    try {
      await createWorkout(data as WorkoutData);
      toast({
        title: "Workout added",
        description: "Your workout has been successfully logged.",
      });
      form.reset();
      setOpen(false);
      onWorkoutAdded?.();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add workout. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const convertTimeToSeconds = (timeStr: string): number => {
    const parts = timeStr.split(':');
    if (parts.length === 2) {
      return parseInt(parts[0]) * 60 + parseInt(parts[1]);
    } else if (parts.length === 3) {
      return parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseInt(parts[2]);
    }
    return parseInt(timeStr) || 0;
  };

  const secondsToTimeString = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Workout
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Quick Add Workout</DialogTitle>
          <DialogDescription>
            Log your workout details quickly and easily.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sport"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sport</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select sport" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="swim">Swimming</SelectItem>
                      <SelectItem value="bike">Cycling</SelectItem>
                      <SelectItem value="run">Running</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="distance_m"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Distance (meters)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="e.g., 5000"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="duration_s"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration (MM:SS or HH:MM:SS)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., 30:00 or 1:30:00"
                      value={field.value ? secondsToTimeString(field.value) : ''}
                      onChange={(e) => field.onChange(convertTimeToSeconds(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rpe"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>RPE (1-10)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      max="10"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="How did it feel? Any observations..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Adding..." : "Add Workout"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}