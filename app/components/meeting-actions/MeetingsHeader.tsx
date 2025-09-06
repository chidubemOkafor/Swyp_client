"use client"

import React from 'react'
import Button from '../ui/Button'
import { FaPlus } from 'react-icons/fa'
import useToggle from '@/app/stores/auth/useAuthToggle'

function MeetingsHeader() {
    const { open, setOpen } = useToggle()
    return (
        <div className='flex justify-between'>
            <div>
                <p className='text-3xl font-bold'>My Meetings</p>
                <p>Time zone: UTC</p>
            </div>
            <Button variant='primary' onClick={() => setOpen("meeting")}>
                <FaPlus/>
                <p>New Meeting</p>
            </Button>
        </div>
    )
}

export default MeetingsHeader
