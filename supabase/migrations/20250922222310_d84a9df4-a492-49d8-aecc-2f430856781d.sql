-- Drop 'plan' column from profiles table
ALTER TABLE IF EXISTS public.profiles
  DROP COLUMN IF EXISTS plan;

-- Ensure RLS is enabled and policies exist
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and recreate them
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can create their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Create clean RLS policies
CREATE POLICY "self read profiles"
  ON public.profiles FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "self upsert profiles"
  ON public.profiles FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "self update profiles"
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = user_id);