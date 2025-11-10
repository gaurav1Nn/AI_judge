import { create } from 'zustand';
import { Argument } from '../lib/supabase';

interface ArgumentsStore {
  arguments: Argument[];
  sideACount: number;
  sideBCount: number;
  addArgument: (argument: Argument) => void;
  incrementCount: (side: 'A' | 'B') => void;
  resetArguments: () => void;
}

export const useArgumentsStore = create<ArgumentsStore>((set) => ({
  arguments: [],
  sideACount: 0,
  sideBCount: 0,

  addArgument: (argument) =>
    set((state) => ({
      arguments: [...state.arguments, argument],
    })),

  incrementCount: (side) =>
    set((state) => ({
      sideACount: side === 'A' ? state.sideACount + 1 : state.sideACount,
      sideBCount: side === 'B' ? state.sideBCount + 1 : state.sideBCount,
    })),

  resetArguments: () => set({ arguments: [], sideACount: 0, sideBCount: 0 }),
}));
