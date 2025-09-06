import { create } from "zustand"

interface IUseToggleFriends {
    isFriendsOpen: boolean,
    setIsFriendsOpen: (value: boolean) => void
}

export const useToggleAddFriends = create<IUseToggleFriends>((set) => ({
    isFriendsOpen: false,
    setIsFriendsOpen: (value) => 
        set({
            isFriendsOpen: value
        })
    
}))
