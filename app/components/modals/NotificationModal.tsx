import React from 'react'
import Button from '../ui/Button'
import Jazzicon from 'react-jazzicon'
import { AiFillSchedule } from 'react-icons/ai'
import { BiCheckDouble } from 'react-icons/bi'

const NotificationModal = () => {
  return (
    <div className='fixed backdrop-blur-3xl bg-neutral-900/30 p-5 w-[30em] h-[40em] z-2 right-10 bottom-30 rounded-md'>
        {/* <div className='h-full flex justify-center items-center'>
            <span className='text-neutral-500'>no notifiction</span>
        </div> */}
        <div className='h-[91%]'>
          <div className='flex flex-col items-start gap-5 w-full overflow-y-scroll h-full pr-5'>
            <div className='border-l-2  border-green-400 flex gap-4 bg-neutral-800 p-5 rounded-md'>
                <AiFillSchedule className='size-8'/>
                <div>
                    <p><span className='font-bold'>david</span> added you to a meeting <span className='font-bold'>team sprint</span> on <span className='font-bold'>July 14, 2034 by 14:50pm</span></p>
                </div>
                <span className='text-sm text-neutral-400'>1am</span>
            </div>
            <div className='flex items-center'>
                <span className='bg-inherit text-neutral-600 italic font-bold px-3'> read </span>
                <div className='w-[21.4em] rounded-md border-neutral-600 border-[1px]'></div>
            </div>
            <div className='flex gap-4 bg-neutral-800 p-5 rounded-md'>
                <AiFillSchedule className='size-8'/>
                <div>
                    <p><span className='font-bold'>david</span> added you to a meeting <span className='font-bold'>team sprint</span> on <span className='font-bold'>July 14, 2034 by 14:50pm</span></p>
                </div>
                <span className='text-sm text-neutral-400'>1am</span>
            </div>
          </div>
          <Button>Mark all as Read<BiCheckDouble className='size-7'/></Button>
        </div>
    </div>
  )
}

export default NotificationModal
