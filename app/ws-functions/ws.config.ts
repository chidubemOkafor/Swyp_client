import { io, Socket } from "socket.io-client"
import { create } from "zustand";
import Cookies from "js-cookie";

interface ISocketStore {
    socket: Socket | null,
    initializeSocket: (meetingId: string) => void
}

export const useSocketStore = create<ISocketStore>((set) => ({
    socket: null,
    initializeSocket: async(meetingId) => {  set({socket: await initSocket(meetingId) })}
}))

async function initSocket(meetingId: string) {

    const token = Cookies.get('jsonwebtoken') || ""
    const socket = io("ws://localhost:8989", {
        auth: { token },
        query: { meetingId }
    });

    return socket
}