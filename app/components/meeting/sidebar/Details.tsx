"use client"

import React, { useEffect, useState } from 'react'
import MeetingId from '../../modals/MeetingId'
import { useParams } from 'next/navigation'

function Details({setTitle}:{setTitle: React.Dispatch<React.SetStateAction<string>>}) {
  const params = useParams()

  useEffect(() => {
    setTitle("detail")
  },[])
  return (
    <div className='space-y-3 mt-5'>
        <p>Joining info</p>
      <MeetingId meetingId={`http://localhost:3000/meeting/${params.id}`} className="bg-neutral-800"/>
    </div>
  )
}

export default Details
