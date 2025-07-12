import React from 'react'
import { IoIosMic, IoMdMicOff } from "react-icons/io";
import { FiVideo, FiVideoOff } from "react-icons/fi";
import { LuScreenShare, LuScreenShareOff } from "react-icons/lu";
import { useMeetingStore } from '../stores/video/useMeeting';
import { useHandStore } from '../stores/tab/useHandStore';
import { useParams } from 'next/navigation';

export default function Toggle({
    className = "",
}: {
    className?: string
}) {
    const {
        streamType,
        isAudio,
        toggleAudioOnly,
        toggleMediaScreen,
        toggleScreenCapture
    } = useMeetingStore()

    const { isHand, toggleHand } = useHandStore()
    const params = useParams()

    function handleToggleMediaScreen() {
        handleCloseHand()
        toggleMediaScreen()
    }

    function handleAudioOnlyToggle() {
        handleCloseHand()
        toggleAudioOnly()
    }

    function handleScreenCaptureToggle() {
        handleCloseHand()
        toggleScreenCapture()
    }

    function handleCloseHand() {
        if(isHand) {
            toggleHand(params.id as string)
        }
    }

    const buttonStyle = 'bg-gray-700 text-white p-4 rounded-md cursor-pointer hover:bg-gray-800'
    
    return (
        <section className={`flex space-x-5 ${className}`}>
            <div className=''>
                {streamType !== 'video' ?
                    <button className={buttonStyle} onClick={handleToggleMediaScreen}>
                        <FiVideoOff className='size-6'/>
                    </button>
                :
                    <button className={buttonStyle} onClick={handleToggleMediaScreen}>
                        <FiVideo className='size-6'/>
                    </button>
                }
            </div>
            <div>
                {!isAudio ?
                    <button className={buttonStyle} onClick={handleAudioOnlyToggle}>
                        <IoMdMicOff className='size-6'/>
                    </button>
                :
                    <button className={buttonStyle} onClick={handleAudioOnlyToggle}>
                        <IoIosMic className='size-6'/>
                    </button>
                }
            </div>
            <div>
                {streamType === 'screenrecording' ?
                    <button className={buttonStyle} onClick={handleScreenCaptureToggle}>
                        <LuScreenShare className='size-6'/>
                    </button>
                :
                    <button className={buttonStyle} onClick={handleScreenCaptureToggle}>
                        <LuScreenShareOff className='size-6'/>
                    </button>
                }
            </div>
        </section>
    )
}