import React, { useEffect, useState } from 'react'
import Backdrop from '../lib/Backdrop'
import { v4 as uuid } from "uuid"
import { handleCopy } from '@/app/util/copy';
import { TbCopy, TbCopyCheck } from "react-icons/tb";
import Loading from '../lib/Loading';
import { useMeeting } from '@/app/stores/meeting/useMeetingStore';
import MeetingId from './MeetingId';

function MeetingLinkModal() {
    const { create, createMeetingValue, meetingId } = useMeeting()
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        async function handleMeetingCreate() {
            setLoading(true)
            try {
                if(createMeetingValue) 
                    await create(createMeetingValue)
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        }
        handleMeetingCreate()
    }, [])

    const copySize = 'size-5 cursor-pointer'
  return (
    <Backdrop>
      <p>Send the code to people you want to have a meeting with. Save it so you can use it later</p>
      {loading && <Loading/>}
      {loading || <MeetingId meetingId={meetingId as string}/>}
    </Backdrop>
  )
}

export default MeetingLinkModal
