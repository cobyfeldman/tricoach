import { supabase } from "@/integrations/supabase/client";

export interface Session {
  sport: 'swim' | 'bike' | 'run';
  distance_m: number;
  duration_s: number;
  intensity: 'easy' | 'moderate' | 'hard' | 'interval' | 'recovery';
  notes: string;
}

export interface Day {
  day: number;
  sessions: Session[];
}

export interface Week {
  week: number;
  days: Day[];
}

export interface Plan {
  id: string;
  user_id: string;
  title: string;
  distance: string;
  weeks: Week[];
  created_at: string;
  updated_at: string;
}

export interface GeneratePlanRequest {
  profile: {
    training_level: 'Beginner' | 'Intermediate' | 'Advanced';
    sport_focus: string;
  };
  distance: string;
}

export const generatePlan = async (request: GeneratePlanRequest): Promise<Plan> => {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    throw new Error('Not authenticated');
  }

  const response = await supabase.functions.invoke('generate-plan', {
    body: request,
    headers: {
      'Authorization': `Bearer ${session.access_token}`,
    },
  });

  if (response.error) {
    throw new Error(response.error.message || 'Failed to generate plan');
  }

  return response.data.plan;
};

export const getPlans = async (): Promise<Plan[]> => {
  const { data, error } = await supabase
    .from('plans')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data || []).map(plan => ({
    ...plan,
    weeks: plan.weeks as unknown as Week[]
  }));
};

export const getPlan = async (planId: string): Promise<Plan | null> => {
  const { data, error } = await supabase
    .from('plans')
    .select('*')
    .eq('id', planId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data ? {
    ...data,
    weeks: data.weeks as unknown as Week[]
  } : null;
};

export const updatePlan = async (planId: string, updates: Partial<Pick<Plan, 'title' | 'weeks'>>): Promise<Plan> => {
  const updateData: any = {};
  if (updates.title) updateData.title = updates.title;
  if (updates.weeks) updateData.weeks = updates.weeks;

  const { data, error } = await supabase
    .from('plans')
    .update(updateData)
    .eq('id', planId)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return {
    ...data,
    weeks: data.weeks as unknown as Week[]
  };
};

export const deletePlan = async (planId: string): Promise<void> => {
  const { error } = await supabase
    .from('plans')
    .delete()
    .eq('id', planId);

  if (error) {
    throw new Error(error.message);
  }
};