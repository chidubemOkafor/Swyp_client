"use client"

import React, { useState } from 'react'
import Toggle from '../../Toggle'
import { FaRegClosedCaptioning } from "react-icons/fa";
import { IoHandRightOutline } from "react-icons/io5";
import { RiSettings4Line } from "react-icons/ri";
import { MdCallEnd } from "react-icons/md";
import useToggle from '@/app/stores/auth/useAuthToggle';
import { useParams } from 'next/navigation';
import { useSocketStore } from '@/app/ws-functions/ws.config';
import { useRouter } from 'next/navigation';
import { useHandStore } from '@/app/stores/tab/useHandStore';
import { BsFillEmojiLaughingFill } from "react-icons/bs";
import Emojies from '../../emojies/Emojies';

function TabButtons() {
    const router = useRouter()
    const { setOpen } = useToggle()
    const { socket, initializeSocket } = useSocketStore();
    const { isHand, toggleHand } = useHandStore()
    const [ showEmojies, setShowEmojies] = useState(false)

    const params = useParams()

    function exitRoom() {
        if (!socket) {
            initializeSocket(params.id as string);
            return;
        }
        socket.emit('exit-meeting');
        router.push('/');
    }

    function handleHandToggle() {
        toggleHand(params.id as string)
    }

    function handleShowEmojies() {
        setShowEmojies(!showEmojies)
    }

    const buttonStype = 'bg-gray-700 text-white p-4 rounded-md cursor-pointer hover:bg-gray-800'
    return (
        <div className='relative flex items-center gap-5'>
            {showEmojies && <div className='absolute top-[-6em] flex items-center justify-center w-full'>
                <Emojies />
            </div>}
            <Toggle/>
            <div className='space-x-5'>
                <button className={buttonStype}>
                    <FaRegClosedCaptioning className='size-6'/> 
                </button>
                <button className={`${buttonStype} ${showEmojies && 'bg-orange-600 hover:bg-orange-700'}`} onClick={handleShowEmojies}>
                    <BsFillEmojiLaughingFill className='size-6'/>
                </button>
                <button className={`${buttonStype} ${isHand && 'bg-orange-600 hover:bg-orange-700'}`} onClick={handleHandToggle}>
                    <IoHandRightOutline className='size-6'/> 
                </button>
                <button className={buttonStype} onClick={() => setOpen("settings")}>
                    <RiSettings4Line className='size-6'/> 
                </button>
                <button className={`${buttonStype} bg-red-600 hover:bg-red-800`} onClick={exitRoom}>
                    <MdCallEnd className='size-6'/> 
                </button>
            </div>
        </div>
    )
}

export default TabButtons