"use client"

import useToggle from '@/app/stores/auth/useAuthToggle'
import AuthModal from './AuthModal'
import NewMeetingModal from './NewMeetingModal'
import MeetingLinkModal from './MeetingLinkModal'
import SettingsModal from '../settings/SettingsModal'
import ScheduleMeeting from './ScheduleMeeting'

export default function Modals() {
  const { open } = useToggle()
  return (
    <>
      {open === "auth" && <AuthModal />}
      {open === "meeting" && <NewMeetingModal/>}
      {open === "meeting_link" && <MeetingLinkModal/>}
      {open === "settings" && <SettingsModal/>}
      {open === "schedule" && <ScheduleMeeting/>}
    </>
  )
}
