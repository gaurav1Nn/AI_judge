import { create } from 'zustand';
import { Verdict } from '../lib/supabase';

interface VerdictStore {
  initialVerdict: Verdict | null;
  finalVerdict: Verdict | null;
  setInitialVerdict: (verdict: Verdict) => void;
  setFinalVerdict: (verdict: Verdict) => void;
  resetVerdicts: () => void;
}

export const useVerdictStore = create<VerdictStore>((set) => ({
  initialVerdict: null,
  finalVerdict: null,

  setInitialVerdict: (verdict) => set({ initialVerdict: verdict }),
  setFinalVerdict: (verdict) => set({ finalVerdict: verdict }),
  resetVerdicts: () => set({ initialVerdict: null, finalVerdict: null }),
}));
