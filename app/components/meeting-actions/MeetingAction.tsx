import React from 'react'
import { BsPlus, BsPersonFill, BsCalendar, BsCameraVideo, BsCameraReels } from "react-icons/bs";

function MeetingAction() {
    const arrays = [
        {
            name: "New Meeting",
            color: "bg-orange-500",
            subText: "Start an instand meeting",
            icon: <BsPlus className='size-6'/> 
        },
          {
            name: "Join Meeting",
            color: "bg-blue-400",
            subText: "Via invitation link",
            icon: <BsPersonFill className='size-6'/>
        },
          {
            name: "Schedule Meeting",
            color: "bg-purple-600",
            subText: "Play your meeting",
            icon: <BsCalendar className='size-6'/>
        },
          {
            name: "View Recordings",
            color: "bg-yellow-400",
            subText: "Meeting Recordings",
            icon: <BsCameraVideo className='size-6'/>
        },
    ]
    //backdrop-blur-lg bg-neutral-900/70 rounded-xl p-4 flex gap-3 shadow-lg

    function createComponent(icon: any) {
        return React.Component = icon
    }
    return (
        <div className='backdrop-blur-lg bg-neutral-800/70 p-10 flex flex-wrap gap-5 rounded-md'>
            {arrays.map((array, index) => (
                <div className={`text-white rounded-md ${array.color} p-5 flex flex-col justify-between h-[10em] w-[20em]`}>
                <div className='backdrop-blur-lg bg-neutral-500/30 rounded-md p-3 shadow-md w-fit'> 
                    {createComponent(array.icon)}
                </div>
                <div>
                    <p className='text-3xl font-bold'>{array.name}</p>
                    <p className='text-md font-semibold'>{array.subText}</p>
                </div>
            </div>))}
        </div>
    )
}

export default MeetingAction
