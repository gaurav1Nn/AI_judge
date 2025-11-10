/*
  # AI Judge Mock Trial System - Database Schema

  ## Overview
  Creates tables to store mock trial cases, verdicts, and arguments for the AI Judge system.

  ## New Tables
  
  ### `cases`
  Stores all trial cases with submission details from both sides
  - `id` (uuid, primary key) - Unique case identifier
  - `case_number` (text, unique) - Auto-generated case number (e.g., TRIAL-2024-A7F3)
  - `case_type` (text) - Type of case (Criminal/Civil/Contract)
  - `title` (text) - Case title
  - `side_a_name` (text) - Plaintiff/Prosecution name
  - `side_a_details` (text) - Side A case details and arguments
  - `side_a_documents` (jsonb) - Array of document metadata
  - `side_b_name` (text) - Defendant name  
  - `side_b_details` (text) - Side B case details and arguments
  - `side_b_documents` (jsonb) - Array of document metadata
  - `status` (text) - Current phase of trial
  - `created_at` (timestamptz) - Case creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### `verdicts`
  Stores AI judge verdicts (both initial and final)
  - `id` (uuid, primary key) - Unique verdict identifier
  - `case_id` (uuid, foreign key) - References cases table
  - `verdict_type` (text) - 'initial' or 'final'
  - `favor` (text) - Which side won (Side A/Side B)
  - `reasoning` (jsonb) - Array of reasoning points
  - `confidence` (integer) - Confidence score 0-100
  - `legal_sections` (jsonb) - Array of applicable legal sections
  - `similar_cases` (jsonb) - Array of similar precedent cases
  - `created_at` (timestamptz) - Verdict timestamp

  ### `arguments`
  Stores rebuttals and AI responses during arguments phase
  - `id` (uuid, primary key) - Unique argument identifier
  - `case_id` (uuid, foreign key) - References cases table
  - `side` (text) - Which side made the argument (A/B)
  - `argument_number` (integer) - Argument count (1-5)
  - `argument_text` (text) - The rebuttal argument
  - `ai_response` (text) - AI judge's consideration
  - `strength_rating` (text) - Weak/Moderate/Strong
  - `created_at` (timestamptz) - Argument timestamp

  ## Security
  - Enable RLS on all tables
  - Allow public read access for demo purposes
  - Allow public write access for demo purposes (no auth required)

  ## Notes
  - This is a demo application, so authentication is not required
  - All users can create and view cases
  - JSONB fields store structured data for documents and legal references
*/

-- Create cases table
CREATE TABLE IF NOT EXISTS cases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_number text UNIQUE NOT NULL,
  case_type text NOT NULL,
  title text NOT NULL,
  side_a_name text NOT NULL DEFAULT 'Plaintiff',
  side_a_details text NOT NULL,
  side_a_documents jsonb DEFAULT '[]'::jsonb,
  side_b_name text NOT NULL DEFAULT 'Defendant',
  side_b_details text NOT NULL,
  side_b_documents jsonb DEFAULT '[]'::jsonb,
  status text NOT NULL DEFAULT 'submission',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create verdicts table
CREATE TABLE IF NOT EXISTS verdicts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id uuid NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  verdict_type text NOT NULL,
  favor text NOT NULL,
  reasoning jsonb NOT NULL DEFAULT '[]'::jsonb,
  confidence integer NOT NULL DEFAULT 0,
  legal_sections jsonb DEFAULT '[]'::jsonb,
  similar_cases jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create arguments table
CREATE TABLE IF NOT EXISTS arguments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id uuid NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  side text NOT NULL,
  argument_number integer NOT NULL,
  argument_text text NOT NULL,
  ai_response text NOT NULL,
  strength_rating text NOT NULL DEFAULT 'Moderate',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE verdicts ENABLE ROW LEVEL SECURITY;
ALTER TABLE arguments ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (demo mode)
CREATE POLICY "Anyone can view cases"
  ON cases FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can create cases"
  ON cases FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can update cases"
  ON cases FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can view verdicts"
  ON verdicts FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can create verdicts"
  ON verdicts FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can view arguments"
  ON arguments FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can create arguments"
  ON arguments FOR INSERT
  TO public
  WITH CHECK (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_cases_case_number ON cases(case_number);
CREATE INDEX IF NOT EXISTS idx_cases_status ON cases(status);
CREATE INDEX IF NOT EXISTS idx_verdicts_case_id ON verdicts(case_id);
CREATE INDEX IF NOT EXISTS idx_arguments_case_id ON arguments(case_id);
CREATE INDEX IF NOT EXISTS idx_cases_created_at ON cases(created_at DESC);
