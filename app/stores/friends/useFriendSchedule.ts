import { create } from "zustand";

interface IFriendSchedule {
    friends: {
        name: string | null
        email: string | null,
    }[] | [],
    setFriend: (value: {
        name: string,
        email: string
    }) => void
}

export const useFriendSchedule = create<IFriendSchedule>((set) => ({
    friends: [],
    setFriend: (value) => {
        if(useFriendSchedule.getState().friends.find(friend => friend === value)) {
            const newFriends = useFriendSchedule.getState().friends.filter((friend) => friend !== value)
            set({
                friends: [...newFriends]
            })
        } else {
            set((state) => (
                {
                    friends: [...state.friends, value]
                }
            ))
        }
    }
}))