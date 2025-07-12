import React, { useState } from 'react'
import { Icon } from '../lib/iconGenerator'
import Toggle from '../Toggle'
import Create from './Create'
import Join from './Join'
import { useMeetingStore } from '../../stores/video/useMeeting'
import useViewSettings from '@/app/stores/display_settings/useViewSettings'
import { useVideoElement } from '../hook/useVideoElement'

function CreateMeeting() {
  const videoRef = useVideoElement() 
  const {
    mediaStream,
    streamType,
    isAudio,
  } = useMeetingStore();


  const [tb, setTb] = useState<'create' | 'join'>('create')
  const tabActive = 'bg-blue-500 cursor-pointer bg-neutral-800'
  const tabNotActive = 'bg-gray-700 cursor-pointer hover:bg-neutral-900'

  return (
    <section className='flex items-center justify-center h-screen'>
      <div className='flex space-x-5'>
        {streamType === 'video' || streamType === 'screenrecording' ? (
          <video
            ref={videoRef}
            className='w-[640px] aspect-video shadow-xl rounded-md object-cover'
            autoPlay
            playsInline
            muted
          />
        ) : (
          <div className='w-[640px] aspect-video bg-neutral-900 rounded-md shadow-xl flex items-center justify-center'>
            {isAudio ? (
              <div className='flex flex-col items-center space-y-2'>
                <Icon />
                <p className='text-gray-400 text-sm'>🎤 Audio Only</p>
              </div>
            ) : (
              <Icon />
            )}
          </div>
        )}
        <div className='space-y-5'>
          <div className='w-full flex space-x-5'>
            <button 
              className={`w-full py-2 rounded-md ${tb === 'create' ? tabActive : tabNotActive}`} 
              onClick={() => setTb('create')}
            >
              Create
            </button>
            <button 
              className={`w-full py-2 rounded-md ${tb === 'join' ? tabActive : tabNotActive}`} 
              onClick={() => setTb('join')}
            >
              Join
            </button>
          </div>
          {tb === 'create' && <Create />}
          {tb === 'join' && <Join />}
          <Toggle/>
        </div>
      </div>
    </section>
  )
}

export default CreateMeeting