import { create } from "zustand";

interface IAmount {
    amount: number;
    setAmount: (value: number) => void
}

export const useContribAmountStore = create<IAmount>((set) => ({
    amount: 0,
    setAmount: (value) => set({ amount: value})
}))