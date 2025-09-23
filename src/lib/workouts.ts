import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Workout = Database['public']['Tables']['workouts']['Row'];
type WorkoutInsert = Database['public']['Tables']['workouts']['Insert'];
type WorkoutUpdate = Database['public']['Tables']['workouts']['Update'];

export type Sport = 'swim' | 'bike' | 'run';

export interface WorkoutData {
  date: string;
  sport: Sport;
  distance_m: number;
  duration_s: number;
  rpe: number;
  notes?: string;
}

export interface WeeklySummary {
  weekStart: string;
  totalDistance: number;
  totalDuration: number;
  workoutCount: number;
  sports: Record<Sport, { distance: number; duration: number; count: number }>;
}

export async function createWorkout(data: WorkoutData): Promise<Workout> {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error('Not authenticated');

  const { data: workout, error } = await supabase
    .from('workouts')
    .insert({
      user_id: user.user.id,
      ...data,
    })
    .select()
    .single();

  if (error) throw error;
  return workout;
}

export async function getWorkouts(startDate?: string, endDate?: string): Promise<Workout[]> {
  let query = supabase
    .from('workouts')
    .select('*')
    .order('date', { ascending: false });

  if (startDate) {
    query = query.gte('date', startDate);
  }
  if (endDate) {
    query = query.lte('date', endDate);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function updateWorkout(id: string, data: Partial<WorkoutData>): Promise<Workout> {
  const { data: workout, error } = await supabase
    .from('workouts')
    .update(data)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return workout;
}

export async function deleteWorkout(id: string): Promise<void> {
  const { error } = await supabase
    .from('workouts')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function getWeeklySummary(weekStart: string): Promise<WeeklySummary> {
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);
  
  const workouts = await getWorkouts(weekStart, weekEnd.toISOString().split('T')[0]);
  
  const summary: WeeklySummary = {
    weekStart,
    totalDistance: 0,
    totalDuration: 0,
    workoutCount: workouts.length,
    sports: {
      swim: { distance: 0, duration: 0, count: 0 },
      bike: { distance: 0, duration: 0, count: 0 },
      run: { distance: 0, duration: 0, count: 0 },
    },
  };

  workouts.forEach(workout => {
    summary.totalDistance += workout.distance_m;
    summary.totalDuration += workout.duration_s;
    summary.sports[workout.sport as Sport].distance += workout.distance_m;
    summary.sports[workout.sport as Sport].duration += workout.duration_s;
    summary.sports[workout.sport as Sport].count += 1;
  });

  return summary;
}

export function formatDistance(meters: number, sport: Sport): string {
  if (sport === 'swim') {
    return meters >= 1000 ? `${(meters / 1000).toFixed(1)}km` : `${meters}m`;
  }
  return meters >= 1000 ? `${(meters / 1000).toFixed(1)}km` : `${meters}m`;
}

export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

export async function bulkCreateWorkouts(workouts: WorkoutData[]): Promise<Workout[]> {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('workouts')
    .insert(workouts.map(workout => ({
      user_id: user.user.id,
      ...workout,
    })))
    .select();

  if (error) throw error;
  return data || [];
}