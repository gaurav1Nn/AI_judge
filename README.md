# AI Judge - Mock Trial System

Justice, Simulated. Truth, Revealed.

## Overview

AI Judge is a full-stack web application that simulates a complete legal trial process. Users can submit cases with arguments from two opposing sides, receive AI-generated verdicts, engage in a rebuttal phase, and obtain final judgments. The system uses Google's Gemini AI to analyze legal arguments and provide detailed verdicts with reasoning, confidence scores, and legal precedents.

**Live Demo:** https://ai-judge-nine.vercel.app/

**Video Walkthrough:** https://youtu.be/2T5eqJMzJpA

## Application Flow

The application progresses through distinct phases:

1. **Landing** - Introduction and start page
2. **Submission** - Case details and arguments input
3. **Processing** - AI analysis in progress
4. **Verdict** - Initial AI-generated verdict display
5. **Arguments** - Rebuttal submission phase (up to 5 per side)
6. **Final** - Final verdict after considering rebuttals

## Key Features

**Case Management**
- Support for three case types: Criminal, Civil, and Contract
- Dual-side argument system (Plaintiff vs Defendant)
- Structured case submission with title and detailed arguments

**AI-Powered Analysis**
- Initial verdict generation with detailed reasoning
- Confidence scoring system
- Applicable legal sections identification
- Similar case references
- Rebuttal analysis with strength ratings (Weak, Moderate, Strong)
- Final verdict determination considering all arguments

**User Experience**
- Smooth animations and transitions using Framer Motion
- Responsive design with Tailwind CSS
- Real-time state management with Zustand
- Clean, intuitive interface

## Technology Stack

### Frontend Technologies
- **React 18** - Core framework for building the user interface
- **TypeScript** - Type-safe JavaScript for better development experience
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework for styling
- **Framer Motion** - Animation library for smooth transitions
- **Zustand** - Lightweight state management solution
- **Lucide React** - Icon library

### Backend Infrastructure
- **Supabase** - Backend-as-a-Service platform
- **PostgreSQL** - Relational database via Supabase
- **Supabase Edge Functions** - Serverless functions running on Deno runtime
- **Deno** - Secure TypeScript/JavaScript runtime for edge functions

### AI Integration
- **Google Gemini AI** - Gemini 2.5 Flash model for verdict generation and analysis
- **Google AI Studio** - API key management and model access

## Prerequisites

Before you begin, ensure you have the following installed and configured:

### Required Software

1. **Node.js** (version 18 or later)
   - Download from: https://nodejs.org/
   - Verify installation: `node --version`

2. **npm** (comes with Node.js)
   - Verify installation: `npm --version`

3. **Supabase CLI**
   - Installation: `npm install -g supabase`
   - Verify installation: `supabase --version`

### Required Accounts

1. **Supabase Account**
   - Sign up at: https://supabase.com/
   - Free tier is sufficient for development and testing

2. **Google AI Studio Account**
   - Access at: https://aistudio.google.com/
   - Required for Gemini API key generation

## Installation Guide

### Step 1: Supabase Project Setup

#### 1.1 Create New Supabase Project

1. Log in to your Supabase Dashboard at https://app.supabase.com/
2. Click "New Project" button
3. Fill in the project details:
   - Project Name: Choose a descriptive name (e.g., "ai-judge")
   - Database Password: Create a strong password (save this securely)
   - Region: Select the region closest to your users
   - Pricing Plan: Select Free tier for development
4. Click "Create new project"
5. Wait for the project to be provisioned (usually 2-3 minutes)

#### 1.2 Retrieve API Credentials

1. Once the project is ready, navigate to "Project Settings" (gear icon in sidebar)
2. Click on "API" in the settings menu
3. Locate and copy the following values:
   - **Project URL**: Found under "Project URL" section
   - **anon public key**: Found under "Project API keys" section (anon/public key)
4. Save these values - you'll need them for the `.env.local` file

#### 1.3 Get Project Reference ID

1. In "Project Settings", go to "General"
2. Copy the "Reference ID" (also called Project Ref)
3. Save this value - you'll need it for linking the Supabase CLI

#### 1.4 Create Database Tables

1. In the Supabase Dashboard, navigate to "SQL Editor" from the left sidebar
2. Click "New query" button
3. Open the file `supabase/migrations/20251110140842_create_mock_trial_tables.sql` from the project
4. Copy the entire SQL content from this file
5. Paste it into the SQL Editor in Supabase
6. Click "RUN" button at the bottom right
7. Verify that the query executed successfully (you should see a success message)
8. Navigate to "Table Editor" to confirm three tables were created:
   - `cases`
   - `verdicts`
   - `arguments`

### Step 2: Google AI API Key Setup

#### 2.1 Get Gemini API Key

1. Go to Google AI Studio at https://aistudio.google.com/app/apikey
2. Sign in with your Google account
3. Click "Get API key" or "Create API key"
4. Select "Create API key in new project" or use an existing project
5. Copy the generated API key immediately
6. Store this key securely - you'll need it for Supabase secrets

### Step 3: Local Project Configuration

#### 3.1 Clone the Repository

```bash
git clone https://github.com/gaurav1Nn/ai-judge.git
cd ai-judge
```

#### 3.2 Install Dependencies

```bash
npm install
```

This will install all required packages including:
- React and React DOM
- TypeScript
- Vite
- Tailwind CSS and its dependencies
- Framer Motion
- Zustand
- Lucide React
- Supabase client library

#### 3.3 Create Environment File

1. In the root directory of the project, create a new file named `.env.local`
2. Add the following content (replace with your actual values from Step 1.2):

```env
VITE_SUPABASE_URL=YOUR_SUPABASE_PROJECT_URL
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_PUBLIC_KEY
```

Example:
```env
VITE_SUPABASE_URL=https://abcdefghijk.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Important Notes:**
- Never commit this file to version control
- The `.env.local` file is already in `.gitignore`
- These variables are prefixed with `VITE_` to expose them to the client-side code
- The Supabase client in `src/lib/supabase.ts` uses these environment variables

### Step 4: Supabase Edge Function Deployment

Edge Functions handle all AI processing and must be deployed to your Supabase project.

#### 4.1 Login to Supabase CLI

```bash
supabase login
```

This will:
1. Open your browser for authentication
2. Ask you to authorize the Supabase CLI
3. Create a session token for CLI operations

#### 4.2 Link Your Project

```bash
supabase link --project-ref YOUR_PROJECT_REF
```

Replace `YOUR_PROJECT_REF` with the Reference ID from Step 1.3.

You'll be prompted to:
1. Confirm your project details
2. Enter your database password (from Step 1.1)

Once linked, the CLI can deploy functions to your project.

#### 4.3 Set Google AI API Key as Secret

```bash
supabase secrets set GEMINI_API_KEY=YOUR_GOOGLE_AI_API_KEY
```

Replace `YOUR_GOOGLE_AI_API_KEY` with the key from Step 2.1.

**What this does:**
- Securely stores the API key in Supabase
- Makes it available to Edge Functions as `Deno.env.get('GEMINI_API_KEY')`
- Keeps the key out of your codebase

#### 4.4 Deploy the Edge Function

```bash
supabase functions deploy gemini-handler
```

**What happens during deployment:**
1. The CLI bundles the function code from `supabase/functions/gemini-handler/`
2. Uploads it to your Supabase project
3. Makes it available at: `https://YOUR_PROJECT_REF.supabase.co/functions/v1/gemini-handler`

**Verification:**
- Check the Supabase Dashboard under "Edge Functions"
- You should see `gemini-handler` listed
- The function configuration is defined in `supabase/config.toml`

### Step 5: Running the Application

#### 5.1 Start Development Server

```bash
npm run dev
```

This command:
- Starts the Vite development server
- Enables hot module replacement (HMR)
- Watches for file changes
- Compiles TypeScript in real-time

#### 5.2 Access the Application

1. Open your browser
2. Navigate to `http://localhost:5173` (or the URL shown in your terminal)
3. You should see the AI Judge landing page

#### 5.3 Test the Application

**Complete Flow Test:**

1. **Landing Page**
   - Click "Start New Case" or "Begin Trial"

2. **Case Submission**
   - Select a case type (Criminal, Civil, or Contract)
   - Enter a case title
   - Fill in arguments for Side A (Plaintiff)
   - Fill in arguments for Side B (Defendant)
   - Click "Submit Case"

3. **Processing Screen**
   - Wait while the AI analyzes the case
   - This typically takes 5-15 seconds

4. **Initial Verdict**
   - Review the AI's decision
   - Check the reasoning and confidence score
   - Note applicable legal sections
   - Review similar cases if provided
   - Click "Proceed to Arguments Phase"

5. **Arguments Phase**
   - Submit rebuttals for Side A (up to 5 arguments)
   - Submit rebuttals for Side B (up to 5 arguments)
   - Each rebuttal is analyzed and given a strength rating
   - Click "Request Final Verdict"

6. **Final Verdict**
   - Review the final decision
   - Check if rebuttals changed the outcome
   - See updated reasoning

## Project Structure

```
ai-judge/
│
├── supabase/
│   ├── functions/
│   │   └── gemini-handler/
│   │       └── index.ts              # Edge function that interfaces with Gemini AI
│   │                                 # Handles verdict generation and argument analysis
│   │
│   ├── migrations/
│   │   └── 20251110140842_create_mock_trial_tables.sql
│   │                                 # Database schema definition
│   │                                 # Creates cases, verdicts, and arguments tables
│   │
│   └── config.toml                   # Supabase project configuration
│                                     # Defines function settings and project metadata
│
├── src/
│   ├── components/                   # React components for each app phase
│   │   ├── LandingPage.tsx          # Initial welcome screen
│   │   ├── CaseSubmission.tsx       # Form for case details and arguments
│   │   ├── ProcessingScreen.tsx     # Loading state during AI processing
│   │   ├── VerdictDisplay.tsx       # Initial verdict presentation
│   │   ├── ArgumentsPhase.tsx       # Rebuttal submission interface
│   │   └── FinalVerdict.tsx         # Final judgment display
│   │
│   ├── lib/
│   │   └── supabase.ts              # Supabase client initialization
│   │                                # Type definitions for database tables
│   │                                # Helper functions for database operations
│   │
│   ├── stores/                       # Zustand state management stores
│   │   ├── caseStore.ts             # Manages case data and app phase
│   │   ├── argumentsStore.ts        # Handles rebuttal arguments state
│   │   └── verdictStore.ts          # Stores initial and final verdicts
│   │
│   ├── utils/
│   │   └── mockAI.ts                # API wrapper functions
│   │                                # Calls Supabase Edge Function
│   │                                # Handles response formatting
│   │
│   ├── App.tsx                       # Main application component
│   │                                # Phase-based routing logic
│   │                                # Component orchestration
│   │
│   └── main.tsx                      # Application entry point
│                                     # React root mounting
│                                     # Global styles import
│
├── public/                           # Static assets
│
├── .env.local                        # Environment variables (create this)
│                                     # Contains Supabase URL and anon key
│                                     # DO NOT commit to version control
│
├── package.json                      # Project dependencies and scripts
├── tsconfig.json                     # TypeScript configuration
├── vite.config.ts                    # Vite bundler configuration
├── tailwind.config.js                # Tailwind CSS customization
├── postcss.config.js                 # PostCSS configuration for Tailwind
└── README.md                         # This file
```

## Available Scripts

### Development

```bash
npm run dev
```
Starts the development server with hot reload at `http://localhost:5173`

### Build

```bash
npm run build
```
Creates an optimized production build in the `dist/` directory

### Preview Production Build

```bash
npm run preview
```
Serves the production build locally for testing

### Type Check

```bash
npm run type-check
```
Runs TypeScript compiler to check for type errors without emitting files

### Lint

```bash
npm run lint
```
Runs ESLint to check code quality and style

## Database Schema

### Cases Table

Stores information about each submitted case.

```sql
cases
  - id (uuid, primary key)
  - created_at (timestamp)
  - case_type (text) - 'Criminal', 'Civil', or 'Contract'
  - title (text)
  - side_a_arguments (text) - Plaintiff arguments
  - side_b_arguments (text) - Defendant arguments
```

### Verdicts Table

Stores initial and final AI-generated verdicts.

```sql
verdicts
  - id (uuid, primary key)
  - case_id (uuid, foreign key to cases)
  - created_at (timestamp)
  - verdict_type (text) - 'initial' or 'final'
  - favored_side (text) - 'A' or 'B'
  - reasoning (text)
  - confidence_score (numeric)
  - legal_sections (text[]) - Array of applicable laws
  - similar_cases (text[]) - Array of precedent cases
```

### Arguments Table

Stores rebuttal arguments submitted during the arguments phase.

```sql
arguments
  - id (uuid, primary key)
  - case_id (uuid, foreign key to cases)
  - created_at (timestamp)
  - side (text) - 'A' or 'B'
  - argument_text (text)
  - ai_response (text) - AI's analysis of the argument
  - strength_rating (text) - 'Weak', 'Moderate', or 'Strong'
```

## Edge Function Details

### gemini-handler Function

**Location:** `supabase/functions/gemini-handler/index.ts`

**Purpose:** Acts as a proxy between the frontend and Google's Gemini AI API.

**Endpoints:**

The function handles different request types based on the `action` parameter:

1. **generate-verdict**
   - Analyzes initial case arguments
   - Returns comprehensive verdict with reasoning
   - Includes confidence score and legal references

2. **analyze-argument**
   - Evaluates a single rebuttal argument
   - Provides AI response and strength rating
   - Considers context of the case

3. **generate-final-verdict**
   - Reviews all arguments and rebuttals
   - Determines if original verdict should change
   - Provides updated reasoning

**Request Format:**

```typescript
{
  action: 'generate-verdict' | 'analyze-argument' | 'generate-final-verdict',
  caseData: {
    caseType: string,
    title: string,
    sideAArguments: string,
    sideBArguments: string,
    // ... additional fields based on action
  }
}
```

**Authentication:**
- Uses Supabase authentication automatically
- Requires valid anon key from environment variables

## Environment Variables

### Frontend (.env.local)

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Note:** Variables must be prefixed with `VITE_` to be accessible in the browser.

### Backend (Supabase Secrets)

```bash
GEMINI_API_KEY=your_google_ai_api_key
```

Set via: `supabase secrets set GEMINI_API_KEY=your_key`

## Troubleshooting

### Common Issues and Solutions

#### Issue: "Cannot find module" errors

**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
```

#### Issue: Supabase connection fails

**Possible causes:**
1. Incorrect environment variables in `.env.local`
2. Project URL or anon key is wrong

**Solution:**
- Verify values in Supabase Dashboard > Project Settings > API
- Ensure `.env.local` file exists in project root
- Restart development server after changing environment variables

#### Issue: Edge function deployment fails

**Possible causes:**
1. Not logged in to Supabase CLI
2. Project not linked correctly
3. Function has syntax errors

**Solution:**
```bash
supabase login
supabase link --project-ref YOUR_REF
supabase functions deploy gemini-handler --debug
```

#### Issue: AI responses fail or timeout

**Possible causes:**
1. Gemini API key not set or invalid
2. API quota exceeded
3. Network issues

**Solution:**
- Verify API key: `supabase secrets list`
- Check Google AI Studio for API quota
- Re-set the API key: `supabase secrets set GEMINI_API_KEY=your_key`

#### Issue: Database queries fail

**Possible causes:**
1. Tables not created
2. RLS policies blocking access

**Solution:**
- Re-run the migration SQL in Supabase SQL Editor
- Check Table Editor to verify tables exist
- Review Supabase logs for specific errors

#### Issue: Build fails in production

**Possible causes:**
1. TypeScript errors
2. Missing dependencies
3. Environment variables not set in deployment platform

**Solution:**
```bash
npm run type-check
npm run build
```
- If deploying to Vercel/Netlify, add environment variables in platform settings

## Deployment

### Deploying to Vercel

1. **Prepare for Deployment**
   ```bash
   npm run build
   ```

2. **Install Vercel CLI** (optional)
   ```bash
   npm install -g vercel
   ```

3. **Deploy via Vercel Dashboard**
   - Go to https://vercel.com/
   - Click "Import Project"
   - Connect your GitHub repository
   - Configure project:
     - Framework Preset: Vite
     - Build Command: `npm run build`
     - Output Directory: `dist`
   
4. **Add Environment Variables**
   - In Vercel project settings, go to "Environment Variables"
   - Add:
     - `VITE_SUPABASE_URL` = your Supabase URL
     - `VITE_SUPABASE_ANON_KEY` = your Supabase anon key

5. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy your application

### Deploying to Netlify

1. **Build the Project**
   ```bash
   npm run build
   ```

2. **Deploy via Netlify Dashboard**
   - Go to https://app.netlify.com/
   - Click "Add new site" > "Import an existing project"
   - Connect to your Git provider
   - Configure build settings:
     - Build command: `npm run build`
     - Publish directory: `dist`

3. **Set Environment Variables**
   - Go to Site settings > Environment variables
   - Add the same variables as Vercel

4. **Deploy**
   - Netlify will automatically deploy

## Security Considerations

### API Key Protection

- Never commit API keys to version control
- Use Supabase secrets for backend API keys
- Use environment variables for frontend configuration
- Rotate keys periodically

### Database Security

- Supabase Row Level Security (RLS) should be configured for production
- Limit anon key permissions in Supabase settings
- Use authenticated requests for sensitive operations

### Edge Function Security

- Validate all input data
- Implement rate limiting for production
- Use CORS settings appropriately
- Monitor function logs for suspicious activity

## Performance Optimization

### Frontend Optimization

- Code splitting is handled by Vite automatically
- Lazy load components for different phases
- Minimize bundle size by importing only needed libraries
- Use production build for deployment

### Backend Optimization

- Edge functions are globally distributed
- Database queries are optimized with indexes
- Consider caching frequently accessed data
- Monitor Supabase usage metrics

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style Guidelines

- Use TypeScript for type safety
- Follow existing code formatting
- Write meaningful commit messages
- Add comments for complex logic
- Test thoroughly before submitting

## Support

If you encounter issues or have questions:

1. Check the Troubleshooting section above
2. Review Supabase documentation: https://supabase.com/docs
3. Check Google AI documentation: https://ai.google.dev/docs
4. Open an issue on GitHub: https://github.com/gaurav1Nn/ai-judge/issues

## License

This project is licensed under the MIT License.

## Acknowledgments

- Google Gemini AI for providing the AI analysis capabilities
- Supabase for the backend infrastructure
- The React and Vite communities for excellent development tools

## Author

**gaurav1Nn**
- GitHub: https://github.com/gaurav1Nn
- Live Demo: https://ai-judge-nine.vercel.app/
- Video Walkthrough: https://youtu.be/2T5eqJMzJpA

---

Built with React, TypeScript, Supabase, and Google Gemini AI