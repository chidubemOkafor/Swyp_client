import { create } from "zustand";

export type MessageType = {
    createdAt: string;
    message: any;
    user: {
        username: string;
        userId: string;
        createdAt?: Date;
    };
}

interface IChat {
    chat: MessageType[];
    setChat: (value: MessageType[] | ((prev: MessageType[]) => MessageType[])) => void;
  }
  
  export const useChatStore = create<IChat>((set) => ({
    chat: [],
    setChat: (value) => {
      if (typeof value === "function") {
        set((state) => ({
          chat: value(state.chat)
        }));
      } else {
        set({ chat: value });
      }
    }
}));


  