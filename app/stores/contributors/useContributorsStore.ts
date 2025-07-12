import React from "react";
import { create } from "zustand";

export type TPeers = {
    isYou: boolean,
    role: string,
    userId: string
    username: string,
    videoRef: React.RefObject<HTMLVideoElement | null>
  }

interface IContributors {
    peers: TPeers[] | [],
    amount: number
    setPeers: (value: TPeers[] | ((prev: TPeers[]) => TPeers[])) => void;
    getAmount: (valueOrUpdater: number | ((prev: number) => number)) => void;
}

export const useContributorsStore = create<IContributors>((set) => ({
    peers: [],
    amount: 0,
    setPeers: (valueOrUpdater) =>
        set((state) => ({
          peers: typeof valueOrUpdater === "function"
            ? valueOrUpdater(state.peers)
            : valueOrUpdater
        })),
    getAmount: (valueOrUpdater) =>
        set((state) => ({
            amount: typeof valueOrUpdater === "function"
            ? valueOrUpdater(state.amount)
            : valueOrUpdater
        }))
}))

export function returnAmount(value : number) {
    return value
}