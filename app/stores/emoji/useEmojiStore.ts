import { create } from 'zustand';

interface FloatingEmoji {
  id: number;
  emoji: string;
  username: string
}

interface FloatingEmojiState {
  floating: FloatingEmoji[];
  triggerEmoji: (emoji: string, username: string) => void;
}

export const useFloatingEmojiStore = create<FloatingEmojiState>((set, get) => ({
  floating: [],
  triggerEmoji: (emoji: string, username: string) => {
    const id = Date.now();

    set((state) => ({
      floating: [...state.floating, { id, emoji, username }],
    }));

    setTimeout(() => {
      set((state) => ({
        floating: state.floating.filter((e) => e.id !== id),
      }));
    }, 1500);
  },
}));
