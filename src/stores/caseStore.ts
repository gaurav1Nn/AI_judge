import { create } from 'zustand';
import { Case, DocumentMetadata } from '../lib/supabase';

interface CaseStore {
  currentCase: Partial<Case> | null;
  phase: 'landing' | 'submission' | 'processing' | 'verdict' | 'arguments' | 'final';
  setPhase: (phase: CaseStore['phase']) => void;
  updateCase: (data: Partial<Case>) => void;
  addDocument: (side: 'A' | 'B', doc: DocumentMetadata) => void;
  removeDocument: (side: 'A' | 'B', fileName: string) => void;
  resetCase: () => void;
}

export const useCaseStore = create<CaseStore>((set) => ({
  currentCase: null,
  phase: 'landing',

  setPhase: (phase) => set({ phase }),

  updateCase: (data) =>
    set((state) => ({
      currentCase: { ...state.currentCase, ...data },
    })),

  addDocument: (side, doc) =>
    set((state) => {
      const key = side === 'A' ? 'side_a_documents' : 'side_b_documents';
      const currentDocs = (state.currentCase?.[key] as DocumentMetadata[]) || [];
      return {
        currentCase: {
          ...state.currentCase,
          [key]: [...currentDocs, doc],
        },
      };
    }),

  removeDocument: (side, fileName) =>
    set((state) => {
      const key = side === 'A' ? 'side_a_documents' : 'side_b_documents';
      const currentDocs = (state.currentCase?.[key] as DocumentMetadata[]) || [];
      return {
        currentCase: {
          ...state.currentCase,
          [key]: currentDocs.filter((doc) => doc.name !== fileName),
        },
      };
    }),

  resetCase: () => set({ currentCase: null, phase: 'landing' }),
}));
