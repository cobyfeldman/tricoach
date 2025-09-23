-- Temporarily disable RLS on plans table for development
ALTER TABLE public.plans DISABLE ROW LEVEL SECURITY;

-- Also disable RLS on workouts table for development  
ALTER TABLE public.workouts DISABLE ROW LEVEL SECURITY;