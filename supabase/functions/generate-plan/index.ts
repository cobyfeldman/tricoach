import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Zod-like validation schema
function validateGeneratePlanRequest(data: any) {
  const errors: string[] = [];
  
  if (!data.profile || typeof data.profile !== 'object') {
    errors.push('profile is required and must be an object');
  } else {
    if (!data.profile.training_level || !['Beginner', 'Intermediate', 'Advanced'].includes(data.profile.training_level)) {
      errors.push('profile.training_level must be one of: Beginner, Intermediate, Advanced');
    }
    if (!data.profile.sport_focus || typeof data.profile.sport_focus !== 'string') {
      errors.push('profile.sport_focus is required');
    }
  }
  
  if (!data.distance || typeof data.distance !== 'string') {
    errors.push('distance is required');
  }
  
  return errors;
}

function generatePlanPrompt(profile: any, distance: string) {
  return `Generate a detailed 12-week triathlon training plan for:
- Training Level: ${profile.training_level}
- Sport Focus: ${profile.sport_focus}
- Race Distance: ${distance}

Return ONLY a JSON object with this exact structure:
{
  "title": "descriptive plan title",
  "weeks": [
    {
      "week": 1,
      "days": [
        {
          "day": 1,
          "sessions": [
            {
              "sport": "swim|bike|run",
              "distance_m": number_in_meters,
              "duration_s": number_in_seconds,
              "intensity": "easy|moderate|hard|interval|recovery",
              "notes": "specific workout description"
            }
          ]
        }
      ]
    }
  ]
}

Guidelines:
- Include 7 days per week (some may have rest or light sessions)
- Balance swim, bike, run across the plan
- Progressive overload throughout 12 weeks
- Include rest/recovery days
- Adjust intensity based on training level
- Distance in meters, duration in seconds
- Be specific with workout notes`;
}

serve(async (req) => {
  console.log('Generate plan function called');
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // For development mode - allow plan generation without authentication
    let userId = 'development-user';
    
    const authHeader = req.headers.get('authorization');
    if (authHeader) {
      const { data: { user }, error: authError } = await supabase.auth.getUser(
        authHeader.replace('Bearer ', '')
      );

      if (!authError && user) {
        userId = user.id;
        console.log('User authenticated:', user.id);
      }
    }

    console.log('Using user ID for plan generation:', userId);

    const requestData = await req.json();
    console.log('Request data:', requestData);
    
    // Validate request
    const validationErrors = validateGeneratePlanRequest(requestData);
    if (validationErrors.length > 0) {
      console.error('Validation errors:', validationErrors);
      return new Response(JSON.stringify({ 
        error: 'Validation failed', 
        details: validationErrors 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Generate plan with OpenAI
    console.log('Calling OpenAI API');
    console.log('OpenAI API Key exists:', !!openAIApiKey);
    console.log('OpenAI API Key length:', openAIApiKey?.length || 0);
    
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }
    
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: 'You are an expert triathlon coach. Generate structured training plans in valid JSON format only.' 
          },
          { 
            role: 'user', 
            content: generatePlanPrompt(requestData.profile, requestData.distance) 
          }
        ],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    });

    console.log('OpenAI Response Status:', openAIResponse.status);
    if (!openAIResponse.ok) {
      const errorText = await openAIResponse.text();
      console.error('OpenAI API error:', openAIResponse.status, errorText);
      throw new Error(`OpenAI API error: ${openAIResponse.status} - ${errorText}`);
    }

    const openAIData = await openAIResponse.json();
    console.log('OpenAI response received');
    
    let planData;
    try {
      planData = JSON.parse(openAIData.choices[0].message.content);
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', parseError);
      throw new Error('Invalid plan format from AI');
    }

    // Save plan to database
    console.log('Saving plan to database');
    const { data: savedPlan, error: dbError } = await supabase
      .from('plans')
      .insert({
        user_id: userId,
        title: planData.title || `${requestData.distance} Training Plan`,
        distance: requestData.distance,
        weeks: planData.weeks,
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      throw new Error('Failed to save plan');
    }

    console.log('Plan saved successfully:', savedPlan.id);

    return new Response(JSON.stringify({
      success: true,
      plan: savedPlan
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-plan function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Internal server error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});