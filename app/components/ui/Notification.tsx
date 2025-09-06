"use client"

import { useNotificationToggle } from '@/app/stores/notification/useNotificatToggle'
import React,{useEffect, useRef} from 'react'
import { IoIosNotificationsOutline } from 'react-icons/io'
import NotificationModal from '../modals/NotificationModal'

function Notification() {
    const { isNotiOpen, setIsNotiOpen } = useNotificationToggle()
    return (
        <>
            { isNotiOpen && <NotificationModal/> }
            <div className='fixed right-10 bottom-10 cursor-pointer' onClick={setIsNotiOpen}>
                <div className='text-[10px] font-bold bg-green-400 rounded-full w-fit px-1 translate-x-0.5 z-2'>{2}</div>
                <div className='bg-neutral-900/80 backdrop-blur-2xl rounded-full p-2'>
                    <IoIosNotificationsOutline  className='size-8  z-0'/>
                </div>
            </div>
        </>
    )
}

export default Notification
