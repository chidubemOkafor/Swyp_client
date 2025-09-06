import React from 'react'
import Button from './Button'
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa'
import { BsFillMenuButtonWideFill } from 'react-icons/bs'

function MeetingCard() {
    const button = 'backdrop-blur-lg bg-neutral-600/30 p-3 rounded-md cursor-pointer'
    const style = 'flex items-center space-x-5 text-lg w-[6em]'
  return (
     <div className='backdrop-blur-lg bg-neutral-900/60 rounded-xl flex gap-3 shadow-lg w-[50em] flex-col'>
            <div className='flex justify-between p-10 w-full'>
                <div className='space-y-3'>
                    <div><p className='text-2xl font-bold'>Meeting</p></div>
                    <p className='font-semibold text-lg'>Monday, OCT 18 . 4:00PM - 4:30PM(UTC)</p>
                </div>
                <div className='flex items-center gap-3'>
                    <Button>
                        Join meeting
                    </Button>
                    <button className={button}><FaEdit className='size-6'/></button>
                    <button className={button}><FaTrash className='size-6'/></button>
                    <button className={button}><BsFillMenuButtonWideFill className='size-6'/></button>
                </div>
            </div>
            {/* underline */}
            <div className='w-full'>
                <div className='bg-neutral-600 h-[2px] rounded-md mx-10'/>
            </div>
            <div className='p-10'>
                <div className='flex items-center space-x-5 text-lg'>
                    <p className='font-semibold text-neutral-400 w-[7em]'>Participants:</p>
                    <p>
                        You, Lian, Anna(Organizer)
                    </p>
                </div>
                <div className='flex items-center space-x-5 text-lg'>
                    <p className='font-semibold text-neutral-400 w-[7em]'>Description:</p>
                    <p>
                        Discussing 2024 roadmap
                    </p>
                </div>
                <div className='flex items-center space-x-5 text-lg'>
                    <p className='font-semibold text-neutral-400 w-[7em]'>Type:</p>
                    <p>
                        Audio,Video
                    </p>
                </div>
                <div className='flex items-center space-x-5 text-lg'>
                    <p className='font-semibold text-neutral-400 w-[7em]'>Meeting link:</p>
                    <p className='underline text-amber-600 cursor-pointer'>https://localhost:4000/meeting/urefnurefnu3-33n</p>
                </div>

            </div>
        </div>
  )
}

export default MeetingCard
