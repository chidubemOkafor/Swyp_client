import { create } from "zustand"

type modals = "auth" | "meeting" | "meeting_link" | "settings" | null
interface IAuthToggle {
  open: modals
  setOpen: (value: modals) => void,
  islogIn: boolean,
  setIsLogIn: (value: boolean) => void
}

const useToggle = create<IAuthToggle>((set) => ({
  open: null,
  islogIn: false,
  setOpen: (value) => set({ open: value }),
  setIsLogIn: (value) => set({ islogIn: value })
}))

export default useToggle