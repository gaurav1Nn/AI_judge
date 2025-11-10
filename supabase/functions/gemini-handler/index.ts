// import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
// import {
//   GoogleGenerativeAI,
//   GenerationConfig,
// } from 'npm:@google/generative-ai@^0.16.0';

// // Get the API key we set in the Supabase secrets
// const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
// if (!GEMINI_API_KEY) {
//   // This is the most likely cause of your 500 error.
//   console.error('!!! CRITICAL ERROR: Missing GEMINI_API_KEY environment variable');
//   throw new Error('Missing GEMINI_API_KEY environment variable');
// }

// // Initialize the Gemini client
// const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
// const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });

// // We want the model to always respond with JSON
// const generationConfig: GenerationConfig = {
//   responseMimeType: 'application/json',
// };

// // --- Define the Prompts for the AI Judge ---
// const getPrompt = (action: string, payload: any): string => {
//   switch (action) {
//     case 'generateInitialVerdict': {
//       const { caseType, sideADetails, sideBDetails } = payload;
//       return `
//         You are an AI judge. Analyze the following case and provide an initial verdict.
//         Case Type: ${caseType}
//         Side A (Plaintiff/Prosecution) Details: ${sideADetails}
//         Side B (Defendant) Details: ${sideBDetails}

//         Return your verdict as a JSON object with this exact structure:
//         {
//           "favor": "string (must be 'Side A (Plaintiff)' or 'Side B (Defendant)')",
//           "reasoning": ["string", "string", "string"],
//           "confidence": number (0-100),
//           "legal_sections": ["string", "string"],
//           "similar_cases": ["string", "string"]
//         }
//       `;
//     }

//     case 'generateArgumentResponse': {
//       const { argumentText, side } = payload;
//       return `
//         You are an AI judge. A rebuttal argument has been submitted.
//         Side Submitting: ${side}
//         Argument: "${argumentText}"

//         Analyze the strength of this argument and provide a concise response.
//         Return your response as a JSON object with this exact structure:
//         {
//           "response": "string (Your analysis of the argument)",
//           "strengthRating": "Weak" | "Moderate" | "Strong"
//         }
//       `;
//     }

//     case 'generateFinalVerdict': {
//       const { initialVerdict, allArguments } = payload;
//       return `
//         You are an AI judge. You must now issue a final verdict after reviewing rebuttals.

//         Your Initial Verdict was:
//         ${JSON.stringify(initialVerdict, null, 2)}

//         The arguments submitted were:
//         ${JSON.stringify(allArguments, null, 2)}

//         Analyze the initial verdict and the arguments.
//         Return your final verdict as a JSON object with the same structure as the initial verdict:
//         {
//           "favor": "string (must be 'Side A (Plaintiff)' or 'Side B (Defendant)')",
//           "reasoning": ["string", "string", "string"],
//           "confidence": number (0-100),
//           "legal_sections": ["string", "string"],
//           "similar_cases": ["string", "string"]
//         }
        
//         - Your final "reasoning" array must include a new point about why the verdict was or was not changed based on the arguments.
//       `;
//     }

//     default:
//       throw new Error(`Unknown action: ${action}`);
//   }
// };

// // --- Handle Incoming Requests ---
// serve(async (req) => {
//   // Handle CORS preflight
//   if (req.method === 'OPTIONS') {
//     return new Response('ok', {
//       headers: {
//         'Access-Control-Allow-Origin': '*',
//         'Access-Control-Allow-Methods': 'POST',
//         'Access-Control-Allow-Headers':
//           'authorization, x-client-info, apikey, content-type',
//       },
//     });
//   }

//   try {
//     const { action, payload } = await req.json();
//     console.log(`Action received: ${action}`);

//     const prompt = getPrompt(action, payload);

//     const result = await model.generateContent({
//       contents: [{ role: 'user', parts: [{ text: prompt }] }],
//       generationConfig,
//     });

//     const aiResponseText = result.response.text();

//     // --- NEW DEBUG LOG ---
//     // This will show us exactly what Gemini sent back, *before* we try to parse it.
//     console.log('Gemini Response Text:', aiResponseText);
//     // --- END NEW DEBUG LOG ---
    
//     const aiResponseJson = JSON.parse(aiResponseText);

//     return new Response(JSON.stringify(aiResponseJson), {
//       headers: {
//         'Access-Control-Allow-Origin': '*',
//         'Content-Type': 'application/json',
//       },
//     });
//   } catch (error) {
//     // This is where the error is caught and sent back as a 500
//     console.error('!!! ERROR in Edge Function:', error.message);
//     return new Response(JSON.stringify({ error: error.message }), {
//       headers: {
//         'Access-Control-Allow-Origin': '*',
//         'Content-Type': 'application/json',
//       },
//       status: 500,
//     });
//   }
// });

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from 'npm:@google/generative-ai@0.21.0';

// Get the API key from Supabase secrets
const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
if (!GEMINI_API_KEY) {
  console.error('CRITICAL ERROR: Missing GEMINI_API_KEY environment variable');
  throw new Error('Missing GEMINI_API_KEY environment variable');
}

// Initialize the Gemini client
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Configure the model with safety settings
const model = genAI.getGenerativeModel({
  model: 'gemini-2.5-flash',  // Latest Gemini 2.5 Flash model (non-live version)
  generationConfig: {
    temperature: 0.7,
    topK: 40,
    topP: 0.95,
    maxOutputTokens: 8192,
    responseMimeType: "application/json",
  },
  safetySettings: [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
  ],
});

// Define the Prompts for the AI Judge
const getPrompt = (action: string, payload: any): string => {
  switch (action) {
    case 'generateInitialVerdict': {
      const { caseType, sideADetails, sideBDetails } = payload;
      return `
        You are an AI judge. Analyze the following case and provide an initial verdict.
        Case Type: ${caseType}
        Side A (Plaintiff/Prosecution) Details: ${sideADetails}
        Side B (Defendant) Details: ${sideBDetails}

        You must return ONLY a valid JSON object with this exact structure:
        {
          "favor": "Side A (Plaintiff)" or "Side B (Defendant)",
          "reasoning": ["reason1", "reason2", "reason3"],
          "confidence": 75,
          "legal_sections": ["section1", "section2"],
          "similar_cases": ["case1", "case2"]
        }

        Requirements:
        - favor must be exactly either "Side A (Plaintiff)" or "Side B (Defendant)"
        - reasoning must contain exactly 3 concise points
        - confidence must be a number between 0 and 100
        - legal_sections must contain exactly 2 items
        - similar_cases must contain exactly 2 items
      `;
    }

    case 'generateArgumentResponse': {
      const { argumentText, side } = payload;
      return `
        You are an AI judge. A rebuttal argument has been submitted.
        Side Submitting: ${side}
        Argument: "${argumentText}"

        Analyze the strength of this argument.
        You must return ONLY a valid JSON object with this exact structure:
        {
          "response": "Your analysis of the argument",
          "strengthRating": "Weak" or "Moderate" or "Strong"
        }

        The strengthRating must be exactly one of: "Weak", "Moderate", or "Strong"
      `;
    }

    case 'generateFinalVerdict': {
      const { initialVerdict, allArguments } = payload;
      return `
        You are an AI judge. Issue a final verdict after reviewing rebuttals.

        Initial Verdict was:
        ${JSON.stringify(initialVerdict, null, 2)}

        Arguments submitted:
        ${JSON.stringify(allArguments, null, 2)}

        You must return ONLY a valid JSON object with this exact structure:
        {
          "favor": "Side A (Plaintiff)" or "Side B (Defendant)",
          "reasoning": ["reason1", "reason2", "reason3", "reason about arguments"],
          "confidence": 75,
          "legal_sections": ["section1", "section2"],
          "similar_cases": ["case1", "case2"]
        }

        Requirements:
        - favor must be exactly either "Side A (Plaintiff)" or "Side B (Defendant)"
        - reasoning must contain at least 3 points, with the last one explaining why the verdict was or wasn't changed
        - confidence must be a number between 0 and 100
        - legal_sections must contain exactly 2 items
        - similar_cases must contain exactly 2 items
      `;
    }

    default:
      throw new Error(`Unknown action: ${action}`);
  }
};

// Handle Incoming Requests
serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    });
  }

  try {
    // Parse request body
    const body = await req.json();
    console.log('Request received:', { action: body.action, hasPayload: !!body.payload });

    if (!body.action || !body.payload) {
      throw new Error('Missing action or payload in request body');
    }

    const { action, payload } = body;

    // Generate prompt
    const prompt = getPrompt(action, payload);
    console.log('Prompt generated for action:', action);

    // Call Gemini API
    const result = await model.generateContent(prompt);
    
    if (!result.response) {
      throw new Error('No response from Gemini API');
    }

    const aiResponseText = result.response.text();
    console.log('Gemini raw response:', aiResponseText.substring(0, 200) + '...');

    // Clean the response (remove markdown code blocks if present)
    let cleanedResponse = aiResponseText.trim();
    if (cleanedResponse.startsWith('```json')) {
      cleanedResponse = cleanedResponse.replace(/^```json\s*/, '').replace(/```\s*$/, '');
    } else if (cleanedResponse.startsWith('```')) {
      cleanedResponse = cleanedResponse.replace(/^```\s*/, '').replace(/```\s*$/, '');
    }

    // Parse JSON
    let aiResponseJson;
    try {
      aiResponseJson = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error('Failed to parse Gemini response as JSON:', cleanedResponse);
      throw new Error(`Invalid JSON response from AI: ${parseError.message}`);
    }

    // Validate response structure based on action
    if (action === 'generateInitialVerdict' || action === 'generateFinalVerdict') {
      if (!aiResponseJson.favor || !Array.isArray(aiResponseJson.reasoning) || 
          typeof aiResponseJson.confidence !== 'number') {
        throw new Error('Invalid verdict structure from AI');
      }
    } else if (action === 'generateArgumentResponse') {
      if (!aiResponseJson.response || !aiResponseJson.strengthRating) {
        throw new Error('Invalid argument response structure from AI');
      }
    }

    console.log('Successfully processed request for action:', action);

    // Return success response
    return new Response(JSON.stringify(aiResponseJson), {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      status: 200,
    });

  } catch (error) {
    console.error('Error in Edge Function:', error);
    
    // Detailed error response for debugging
    const errorResponse = {
      error: error.message || 'An unexpected error occurred',
      details: error.stack || 'No stack trace available',
      timestamp: new Date().toISOString(),
    };

    return new Response(JSON.stringify(errorResponse), {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      status: 500,
    });
  }
});

console.log('Edge function initialized and ready');