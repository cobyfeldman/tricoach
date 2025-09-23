import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log('Chat function called');
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // For development mode - allow chat without authentication
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

    console.log('Using user ID:', userId);

    const { message, conversation = [] } = await req.json();
    console.log('Chat request:', { message, conversationLength: conversation.length });
    
    if (!message || typeof message !== 'string') {
      return new Response(JSON.stringify({ error: 'Message is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Prepare conversation history for Gemini
    const systemPrompt = `You are TriFlow AI, a helpful assistant specialized in triathlon training, nutrition, and race preparation. You help users with:
    - Training advice and workout planning
    - Nutrition guidance for endurance sports
    - Race day preparation and strategy
    - Recovery and injury prevention
    - Equipment recommendations
    - Goal setting and motivation
    
    Keep your responses helpful, encouraging, and focused on triathlon and endurance sports. Be concise but informative.`;

    // Convert conversation to Gemini format
    const contents = [];
    
    // Add conversation history
    for (const msg of conversation) {
      contents.push({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      });
    }
    
    // Add current message
    contents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    console.log('Calling Gemini API');
    const geminiResponse = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent', {
      method: 'POST',
      headers: {
        'x-goog-api-key': geminiApiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: contents,
        systemInstruction: {
          parts: [{ text: systemPrompt }]
        },
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 500,
        }
      }),
    });

    if (!geminiResponse.ok) {
      console.error('Gemini API error:', geminiResponse.status, await geminiResponse.text());
      throw new Error('Failed to get response from AI');
    }

    const geminiData = await geminiResponse.json();
    console.log('Gemini response received');
    
    const reply = geminiData.candidates[0].content.parts[0].text;

    return new Response(JSON.stringify({
      reply,
      success: true
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in chat function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Internal server error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});