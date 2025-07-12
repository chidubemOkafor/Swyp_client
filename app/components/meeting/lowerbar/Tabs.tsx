"use client"

import React, { useState } from 'react'
import TabButtons from './TabButtons'
import RightTab from './RightTab'
import { v4 as uuid} from 'uuid'
import { handleCopy } from '@/app/util/copy'
import { TbCopy, TbCopyCheck } from 'react-icons/tb'
import MeetingId from '../../modals/MeetingId'
import { useParams } from 'next/navigation'

function Tabs() {
  const params = useParams()
  return (
    <div className='flex justify-between items-center'>
        <div className='flex items-center gap-3'>
            <p><b>Meeting ID:</b></p>
            <MeetingId meetingId={params.id as string}/>
        </div>
        <TabButtons/>
        <RightTab/>
    </div>
  )
}

export default Tabs
