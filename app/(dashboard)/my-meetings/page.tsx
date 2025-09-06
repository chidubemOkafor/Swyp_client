import React from 'react'
import { FaPlus } from 'react-icons/fa'
import Button from '@/app/components/ui/Button'
import MeetingCard from '../../components/ui/MeetingCard'
import MeetingsHeader from '@/app/components/meeting-actions/MeetingsHeader'

function page() {

    return (
        <div className='mr-10 my-10 space-y-10 ml-[30em] w-[76vw]'>
            <MeetingsHeader/>
            <div className='flex flex-wrap gap-5 justify-center items-center'>
                <MeetingCard/>
                <MeetingCard/>
                <MeetingCard/>
                <MeetingCard/>
            </div>
        </div>
  )
}

export default page
