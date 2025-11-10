// export const generateCaseNumber = (): string => {
//   const year = new Date().getFullYear();
//   const randomHex = Math.random().toString(16).substring(2, 6).toUpperCase();
//   return `TRIAL-${year}-${randomHex}`;
// };

// export const generateInitialVerdict = async (
//   caseType: string,
//   sideADetails: string,
//   sideBDetails: string
// ): Promise<{
//   favor: string;
//   reasoning: string[];
//   confidence: number;
//   legal_sections: string[];
//   similar_cases: string[];
// }> => {
//   await new Promise((resolve) => setTimeout(resolve, 2500));

//   const verdicts: Record<string, any> = {
//     Criminal: {
//       favor: 'Side A (Prosecution)',
//       reasoning: [
//         'CCTV evidence places defendant at crime scene during incident timeframe',
//         'Forensic evidence establishes physical contact with crime location',
//         'Timeline analysis shows opportunity and motive alignment',
//         'Witness testimony corroborated by digital records',
//       ],
//       confidence: 78,
//       legal_sections: ['IPC 379 - Theft', 'IPC 411 - Receiving stolen property', 'IPC 114 - Abettor present'],
//       similar_cases: [
//         'State vs. Sharma (2019) - Similar CCTV evidence pattern',
//         'State vs. Patel (2021) - Forensic evidence precedent',
//       ],
//     },
//     Civil: {
//       favor: 'Side A (Plaintiff)',
//       reasoning: [
//         'Contract terms clearly specify agreed-upon specifications',
//         'Documented evidence shows material deviation from contract',
//         'Breach of contract established through measurement discrepancies',
//         'Defendant failed to provide adequate remedy within reasonable timeframe',
//       ],
//       confidence: 82,
//       legal_sections: [
//         'Contract Act Section 73 - Compensation for breach',
//         'RERA Act 2016 - Real Estate obligations',
//         'Consumer Protection Act 2019',
//       ],
//       similar_cases: [
//         'Kumar vs. BuildTech Ltd (2020) - Similar contract breach',
//         'Mehta vs. Property Developers (2022) - Specification deviation case',
//       ],
//     },
//     Contract: {
//       favor: 'Side B (Defendant)',
//       reasoning: [
//         'Force majeure clause applicable to circumstances presented',
//         'Good faith effort demonstrated through documentation',
//         'Industry standard compliance maintained throughout process',
//         'Reasonable compensation offered for acknowledged delays',
//       ],
//       confidence: 71,
//       legal_sections: [
//         'Contract Act Section 56 - Impossibility of performance',
//         'Contract Act Section 32 - Contingent contracts',
//       ],
//       similar_cases: [
//         'Tech Solutions vs. Client Corp (2020) - Force majeure precedent',
//         'Services Inc vs. Buyer Ltd (2019) - Industry standard case',
//       ],
//     },
//   };

//   const baseVerdict = verdicts[caseType] || verdicts.Civil;

//   const detailsLength = sideADetails.length + sideBDetails.length;
//   const confidenceAdjustment = Math.floor((detailsLength % 20) - 10);

//   return {
//     ...baseVerdict,
//     confidence: Math.min(95, Math.max(65, baseVerdict.confidence + confidenceAdjustment)),
//   };
// };

// export const generateArgumentResponse = async (
//   argumentText: string,
//   argumentNumber: number,
//   side: 'A' | 'B'
// ): Promise<{ response: string; strengthRating: 'Weak' | 'Moderate' | 'Strong' }> => {
//   await new Promise((resolve) => setTimeout(resolve, 1800));

//   const responses = [
//     {
//       response: "The court acknowledges this point. However, the preponderance of evidence still supports the original assessment. The argument introduces reasonable doubt but does not fundamentally alter the core findings.",
//       strengthRating: 'Moderate' as const,
//     },
//     {
//       response: "This presents a compelling counter-argument. The court will weigh this new perspective against the established evidence. The procedural concerns raised warrant careful consideration.",
//       strengthRating: 'Strong' as const,
//     },
//     {
//       response: "While noted, this argument fails to address the fundamental issues at hand. The point raised has been previously considered in the initial analysis. No material impact on verdict.",
//       strengthRating: 'Weak' as const,
//     },
//     {
//       response: "An interesting legal interpretation. The precedent cited provides valuable context. However, the factual circumstances differ sufficiently to limit its applicability to this case.",
//       strengthRating: 'Moderate' as const,
//     },
//     {
//       response: "This argument significantly challenges a key assumption in the initial verdict. The evidence presented requires thorough re-examination. The court recognizes the validity of this concern.",
//       strengthRating: 'Strong' as const,
//     },
//   ];

//   const argumentStrength = argumentText.length > 200 ? 1 : argumentText.length > 100 ? 2 : 0;
//   const responseIndex = (argumentNumber + (side === 'A' ? 0 : 1) + argumentStrength) % responses.length;

//   return responses[responseIndex];
// };

// export const generateFinalVerdict = async (
//   initialVerdict: any,
//   caseArguments: any[]
// ): Promise<any> => {
//   await new Promise((resolve) => setTimeout(resolve, 2000));

//   const strongArguments = caseArguments.filter((arg) => arg.strength_rating === 'Strong');
//   const shouldChange = strongArguments.length >= 2;

//   if (shouldChange) {
//     const newFavor = initialVerdict.favor.includes('Side A')
//       ? 'Side B (Defendant)'
//       : 'Side A (Plaintiff)';

//     return {
//       ...initialVerdict,
//       favor: newFavor,
//       reasoning: [
//         'Upon reconsideration, compelling arguments have shifted the balance',
//         'New perspectives on evidence interpretation provided by rebuttals',
//         'Procedural and substantive concerns raised warrant verdict modification',
//         ...initialVerdict.reasoning.slice(0, 2),
//       ],
//       confidence: Math.max(60, initialVerdict.confidence - 15),
//     };
//   }

//   const moderateArguments = caseArguments.filter((arg) => arg.strength_rating === 'Moderate');
//   if (moderateArguments.length >= 3) {
//     return {
//       ...initialVerdict,
//       confidence: Math.max(65, initialVerdict.confidence - 8),
//       reasoning: [
//         ...initialVerdict.reasoning,
//         'Arguments presented have introduced reasonable considerations',
//       ],
//     };
//   }

//   return {
//     ...initialVerdict,
//     confidence: Math.min(90, initialVerdict.confidence + 5),
//     reasoning: [
//       ...initialVerdict.reasoning,
//       'Rebuttals examined thoroughly; initial assessment confirmed',
//     ],
//   };
// };
import { supabase, Verdict, Argument } from '../lib/supabase';

// This function doesn't need AI, so we keep it as-is
export const generateCaseNumber = (): string => {
  const year = new Date().getFullYear();
  const randomHex = Math.random().toString(16).substring(2, 6).toUpperCase();
  return `TRIAL-${year}-${randomHex}`;
};

/**
 * Helper function to call our Supabase Edge Function 'gemini-handler'
 * @param action The specific AI task to perform
 * @param payload The data needed for the task (case details, argument text, etc.)
 */
const invokeGeminiHandler = async (action: string, payload: unknown) => {
  const { data, error } = await supabase.functions.invoke('gemini-handler', {
    body: { action, payload },
  });

  if (error) {
    console.error(`Error invoking function for action "${action}":`, error);
    throw error;
  }

  if (data.error) {
    // This catches errors from *inside* the Edge Function
    console.error(`Error from Gemini handler for action "${action}":`, data.error);
    throw new Error(data.error);
  }

  return data;
};

// --- REWRITTEN AI FUNCTIONS ---
// These now call our Supabase Function instead of returning mock data.
// The rest of the app (the components) won't know the difference!

export const generateInitialVerdict = async (
  caseType: string,
  sideADetails: string,
  sideBDetails: string
): Promise<Omit<Verdict, 'id' | 'case_id' | 'verdict_type' | 'created_at'>> => {
  
  // Show a loading screen for at least 2.5 seconds to match old behavior
  await new Promise((resolve) => setTimeout(resolve, 2500));

  const payload = { caseType, sideADetails, sideBDetails };
  return invokeGeminiHandler('generateInitialVerdict', payload);
};

export const generateArgumentResponse = async (
  argumentText: string,
  argumentNumber: number,
  side: 'A' | 'B'
): Promise<{ response: string; strengthRating: 'Weak' | 'Moderate' | 'Strong' }> => {
  
  // Show a loading screen for at least 1.8 seconds
  await new Promise((resolve) => setTimeout(resolve, 1800));
  
  const payload = { argumentText, argumentNumber, side };
  return invokeGeminiHandler('generateArgumentResponse', payload);
};

export const generateFinalVerdict = async (
  initialVerdict: Verdict,
  allArguments: Argument[]
): Promise<Omit<Verdict, 'id' | 'case_id' | 'verdict_type' | 'created_at'>> => {
  
  // Show a loading screen for at least 2 seconds
  await new Promise((resolve) => setTimeout(resolve, 2000));
  
  const payload = { initialVerdict, allArguments };
  return invokeGeminiHandler('generateFinalVerdict', payload);
};