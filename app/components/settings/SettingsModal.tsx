import React, { useState } from 'react'
import Backdrop from '../lib/Backdrop'
import useToggle from '@/app/stores/auth/useAuthToggle'

function SettingsModal() {    
  const [tb, setTb] = useState<'Audio'| 'Video' | 'Caption'>('Audio')


  const tabActive = 'bg-blue-500  rounded-4xl w-[49%] cursor-pointer'
  const tabNotActive = 'bg-gray-700 rounded-4xl w-[49%] hover:bg-gray-800 cursor-pointer'
  return (
    <Backdrop >
         <div className="w-full border-2 border-gray-800 p-3 rounded-4xl flex justify-between gap-2">
          <button
            className={tb === 'Audio' ? tabActive : tabNotActive}
            onClick={() => setTb('Audio')}
          >
            Audio
          </button>
          <button
            className={tb === 'Video' ? tabActive : tabNotActive}
            onClick={() => setTb('Video')}
          >
            Video
          </button>
          <button
            className={tb === 'Caption' ? tabActive : tabNotActive}
            onClick={() => setTb('Caption')}
          >
            Caption
          </button>
        </div>
    </Backdrop>
  )
}

export default SettingsModal
