import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Case {
  id: string;
  case_number: string;
  case_type: string;
  title: string;
  side_a_name: string;
  side_a_details: string;
  side_a_documents: DocumentMetadata[];
  side_b_name: string;
  side_b_details: string;
  side_b_documents: DocumentMetadata[];
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Verdict {
  id: string;
  case_id: string;
  verdict_type: 'initial' | 'final';
  favor: string;
  reasoning: string[];
  confidence: number;
  legal_sections: string[];
  similar_cases: string[];
  created_at: string;
}

export interface Argument {
  id: string;
  case_id: string;
  side: 'A' | 'B';
  argument_number: number;
  argument_text: string;
  ai_response: string;
  strength_rating: 'Weak' | 'Moderate' | 'Strong';
  created_at: string;
}

export interface DocumentMetadata {
  name: string;
  size: number;
  type: string;
  uploadedAt: string;
}
