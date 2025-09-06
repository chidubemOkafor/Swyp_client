import React from 'react'
import Backdrop from '../lib/Backdrop'
import { PiLinkSimpleHorizontal } from "react-icons/pi";
import { IoAddCircleOutline } from "react-icons/io5";
import { RiUser4Line } from "react-icons/ri"
import useToggle from '@/app/stores/auth/useAuthToggle';
import { initial } from '@/app/util/instantMeeting';
import { useMeeting } from '@/app/stores/meeting/useMeetingStore';
import { useRouter } from 'next/navigation';
import Button from '../ui/Button';


function NewMeetingModal() {
    const router = useRouter()
    const { setOpen } = useToggle()
    const { instantMeeting } = initial()
    const { meetingId } = useMeeting()
    const buttonStyle = "outline-none w-full h-10 pl-5 rounded-md bg-neutral-900 text-start flex items-center gap-5 cursor-pointer hover:border-gray-600"

    async function handleNavigate() {
        const id = await instantMeeting ();
        setOpen(null)
        router.push(`/meeting/${id}`);
    }
  return (
    <Backdrop>
        <div className='flex flex-col space-y-5 text-start'>
            <Button onClick={() => setOpen("schedule")}> 
                {/* 
            meeting_link */}
                <PiLinkSimpleHorizontal className='size-5'/>
                <p>Schedule a Meeting</p>
            </Button>
            <Button onClick={handleNavigate}>
                <IoAddCircleOutline className='size-5'/>
                <p>Start an instant meeting</p>
            </Button>
            <div className={`justify-between ${buttonStyle}`}>
                <div className='flex gap-5'>
                    <RiUser4Line className='size-5'/>
                    <p>Disable Scarlett</p>
                </div>
                <input type='checkbox' id='isScarlett' className='justify-self-end-safe mr-5'/>
            </div>
        </div>
    </Backdrop>
  )
}

export default NewMeetingModal
