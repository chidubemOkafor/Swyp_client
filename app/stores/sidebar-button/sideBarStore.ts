import { create } from "zustand";

type options = "ai" | "chat" | "contrb" | "details" | null

interface ITab {
    tab: options,
    setTab: (value: options) => void
}

export const sidebarStore = create<ITab>((set) => ({
    tab: null,
    setTab: (value) => set({tab: value})
}))