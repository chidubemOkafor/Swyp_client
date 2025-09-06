import { handleCopy } from '@/app/util/copy';
import React, { useState } from 'react'
import { TbCopy, TbCopyCheck } from 'react-icons/tb';

function MeetingId({meetingId, className=''}: {meetingId: string, className?: string}) {
    const [copied, setCopied] = useState(false)

    if(copied === true) {
        setTimeout(() => {
            setCopied(false)
        },3000)
    }
    const copySize = 'size-5 cursor-pointer'
  return (
    <div className={`bg-neutral-800 p-5 rounded-md flex justify-between items-center ${className} gap-4`}>
        {meetingId}
        {!copied ? <TbCopy className={copySize} type='button' onClick={() => {handleCopy(meetingId as string); setCopied(true)}}/> : <TbCopyCheck className={copySize}/>}
      </div>
  )
}

export default MeetingId
