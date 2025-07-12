import React from 'react'
import { IoMdInformationCircleOutline } from "react-icons/io"
import { IoPeopleCircle } from "react-icons/io5";
import { RiUser4Line } from 'react-icons/ri';
import { PiChatTeardropTextBold } from "react-icons/pi";
import { sidebarStore } from '@/app/stores/sidebar-button/sideBarStore';
import { useContributorsStore } from '@/app/stores/contributors/useContributorsStore';


function RightTab() {
    const { tab, setTab } = sidebarStore()
    const amount = useContributorsStore(state => state.amount)
    
    const buttonStyle = 'hover:bg-neutral-900 p-3 rounded-full cursor-pointer'
  return (
    <div className='flex space-x-1'>
        <button className={`${buttonStyle} ${tab === 'details' ? 'bg-neutral-900': ''}`} onClick={() => setTab(tab === "details" ? null : "details")}>
            <IoMdInformationCircleOutline className='size-7'/>
        </button>
        <button className={`${buttonStyle} ${tab === 'contrb' ? 'bg-neutral-900': ''} flex items-center gap-2`} onClick={() => setTab(tab === "contrb" ? null : "contrb")}>
            <div className='bg-red-400 size-6 rounded-full font-bold flex justify-center items-center'>{amount}</div>
            <IoPeopleCircle className='size-7'/>
        </button>
        <button className={`${buttonStyle} ${tab === 'chat' ? 'bg-neutral-900': ''}`} onClick={() => setTab(tab === "chat" ? null : "chat")}>
            <PiChatTeardropTextBold className='size-7'/>
        </button>
        <button className={`${buttonStyle} ${tab === 'ai' ? 'bg-neutral-900': ''}`} onClick={() => setTab(tab === "ai" ? null : "ai")}>
            <RiUser4Line className='size-7'/>
        </button>
    </div>
  )
}

export default RightTab
