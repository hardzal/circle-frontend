import { create } from 'zustand';

type useCounterStore = {
  counter: number;
  add: () => void;
  subtract: () => void;
};

export const useCounterStore = create<useCounterStore>((set) => ({
  counter: 0,
  add: () => set((state) => ({ counter: state.counter + 1 })),
  subtract: () => set((state) => ({ counter: state.counter - 1 })),
}));
