import { useEffect, useRef } from 'react'
import { useMeetingStore } from '@/app/stores/video/useMeeting'

export const useVideoElement = () => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const { registerVideoElement, unregisterVideoElement } = useMeetingStore()

  useEffect(() => {
    const element = videoRef.current
    if (element) {
      registerVideoElement(element)
      
      return () => {
        unregisterVideoElement(element)
      }
    }
  }, [registerVideoElement, unregisterVideoElement])

  return videoRef
}