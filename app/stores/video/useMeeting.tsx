import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import useViewSettings from '@/app/stores/display_settings/useViewSettings'
import React from 'react'

type StreamType = 'video' | 'screenrecording' | null

interface MeetingStore {
  mediaStream: MediaStream | null,
  remoteStream: MediaStream | null,
  streamType: StreamType
  isAudio: boolean
  videoElements: Set<HTMLVideoElement>
  
  // Actions
  registerVideoElement: (element: HTMLVideoElement) => void
  registerRemoteStream: () => void
  unregisterVideoElement: (element: HTMLVideoElement) => void
  toggleMediaScreen: () => Promise<void>
  toggleScreenCapture: () => Promise<void>
  toggleAudioOnly: () => Promise<void>
  stopStreamAndClearVideo: () => void
}

export const useMeetingStore = create<MeetingStore>()(
  devtools((set, get) => {
    const { addView, removeView, resetView } = useViewSettings.getState()

    return {
      remoteStream: null,
      mediaStream: null,
      streamType: null,
      isAudio: false,
      videoElements: new Set(),

      registerVideoElement: (element: HTMLVideoElement) => {
        const { videoElements, mediaStream } = get()
        const newSet = new Set(videoElements)
        newSet.add(element)
        
        if (mediaStream) {
          element.srcObject = mediaStream
          element.play().catch(console.error)
        }
        
        set({ videoElements: newSet })
      },

      unregisterVideoElement: (element: HTMLVideoElement) => {
        const { videoElements } = get()
        const newSet = new Set(videoElements)
        newSet.delete(element)
        set({ videoElements: newSet })
      },

      stopStreamAndClearVideo: () => {
        const { mediaStream, videoElements } = get()

        if (mediaStream) {
          mediaStream.getTracks().forEach(track => track.stop())
        }

        videoElements.forEach(element => {
          element.srcObject = null
        })

        set({ mediaStream: null, streamType: null, isAudio: false })
        resetView()
      },

      toggleMediaScreen: async () => {
        const { streamType, stopStreamAndClearVideo, videoElements } = get()

        if (streamType === 'video') {
          stopStreamAndClearVideo()
          return
        }

        stopStreamAndClearVideo()

        try {
          const stream = await navigator.mediaDevices.getUserMedia({ 
            audio: true, 
            video: {
              width: { ideal: 1280, max: 1920 },
              height: { ideal: 720, max: 1080 },
              frameRate: { ideal: 30, max: 30 },
              facingMode: 'user'
            } 
          })

          videoElements.forEach(element => {
            element.srcObject = stream
            element.play().catch(console.error)
          })

          set({ mediaStream: stream, streamType: 'video', isAudio: true })

          addView('video')
          addView('audio')

          console.log('Video stream started:', stream)
        } catch (err) {
          alert('Access to camera and microphone was denied.')
          console.error(err)
        }
      },

      toggleScreenCapture: async () => {
        const { streamType, stopStreamAndClearVideo, videoElements } = get()

        if (streamType === 'screenrecording') {
          stopStreamAndClearVideo()
          return
        }

        stopStreamAndClearVideo()

        try {
          const stream = await navigator.mediaDevices.getDisplayMedia({ 
            video: true, 
            audio: true 
          })

          videoElements.forEach(element => {
            element.srcObject = stream
          })

          set({ mediaStream: stream, streamType: 'screenrecording', isAudio: true })

          addView('screen_recording')
          addView('audio')

          stream.getVideoTracks()[0].addEventListener('ended', () => {
            get().stopStreamAndClearVideo()
          })
        } catch (err) {
          console.warn('Screen sharing cancelled or failed', err)
        }
      },

      toggleAudioOnly: async () => {
        const { streamType, mediaStream, isAudio, stopStreamAndClearVideo } = get()

        if (streamType === 'video' || streamType === 'screenrecording') {
          if (mediaStream) {
            const audioTracks = mediaStream.getAudioTracks()
            if (audioTracks.length > 0) {
              const newAudioState = !isAudio
              audioTracks.forEach(track => (track.enabled = newAudioState))
              set({ isAudio: newAudioState })

              if (newAudioState) addView('audio')
              else removeView('audio')
            }
          }
          return
        }

        if (isAudio && mediaStream && !streamType) {
          stopStreamAndClearVideo()
          return
        }

        if (!mediaStream) {
          try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
              audio: true, 
              video: false 
            })
            set({ mediaStream: stream, isAudio: true })
            addView('audio')
          } catch (err) {
            alert('Unable to access microphone.')
            console.error(err)
          }
        }
      }
    }
  })
)