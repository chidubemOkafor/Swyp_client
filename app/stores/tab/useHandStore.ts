import MeetingId from "@/app/components/modals/MeetingId";
import { useSocketStore } from "@/app/ws-functions/ws.config";
import { create } from "zustand";

interface IHandStore {
    isHand: boolean,
    handRaisedArray: string[] | [],
    setHandRaisedArray: (value: string[]) => void,
    toggleHand: (meetingId: string) => void
}

export const useHandStore = create<IHandStore>((set, get) => ({
    isHand: false,
    handRaisedArray: [],
    setHandRaisedArray: (value) => {
        set({
            handRaisedArray: value
        })
    },
    toggleHand: (meetingId) => {
        if(get().isHand) {
            handleHandDown(meetingId)
            set({ isHand: false })
        } else {
            handleHandUp(meetingId)
            set({ isHand: true})
        }
    }
}))

function handleHandUp(meetingId: string) {
    const socket = initializeSocketfunction(meetingId)
    socket?.emit('raise_hand')
}

function handleHandDown(meetingId: string) {
    const socket = initializeSocketfunction(meetingId)
    socket?.emit('hand_down')
}

function initializeSocketfunction(meetingId: string) {
    const initializeSocket = useSocketStore.getState().initializeSocket
    const socket = useSocketStore.getState().socket
    if(!socket) {
        initializeSocket(meetingId)
        return
    }
    return socket
}