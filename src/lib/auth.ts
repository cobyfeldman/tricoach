import { supabase } from "@/integrations/supabase/client";

export const signInWithMagicLink = async (email: string) => {
  const redirectUrl = `${window.location.origin}/dashboard`;
  
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: redirectUrl,
      shouldCreateUser: true
    }
  });
  
  return { error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };
};

export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();
  
  return { profile: data, error };
};

export const createUserProfile = async (profile: {
  user_id: string;
  full_name: string;
  training_level: string;
  race_date: string;
  sport_focus: string;
}) => {
  const { data, error } = await supabase
    .from('profiles')
    .insert(profile)
    .select()
    .single();
  
  return { profile: data, error };
};

export const updateUserProfile = async (userId: string, updates: Partial<{
  full_name: string;
  training_level: string;
  race_date: string;
  sport_focus: string;
}>) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('user_id', userId)
    .select()
    .single();
  
  return { profile: data, error };
};