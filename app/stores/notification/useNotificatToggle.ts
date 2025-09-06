import React from 'react'
import { create } from 'zustand'

interface IUseNotificationToggle {
  isNotiOpen: boolean,
  setIsNotiOpen: () => void
}

export const useNotificationToggle = create<IUseNotificationToggle>((set) => ({
  isNotiOpen: false,
  setIsNotiOpen: () => set({
    isNotiOpen: !useNotificationToggle.getState().isNotiOpen
  })
}))
