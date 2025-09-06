"use client"

import React, { useState } from 'react'
import TabButtons from './TabButtons'
import RightTab from './RightTab'
import { v4 as uuid} from 'uuid'
import { handleCopy } from '@/app/util/copy'
import { TbCopy, TbCopyCheck } from 'react-icons/tb'
import MeetingId from '../../modals/MeetingId'

function Tabs() {
  return (
    <div className='flex justify-between items-center'>
        <TabButtons/>
        <RightTab/>
    </div>
  )
}

export default Tabs
