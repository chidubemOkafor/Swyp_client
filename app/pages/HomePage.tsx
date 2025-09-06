import React from 'react'
import SideBar from '../components/sidebar/SideBar'
import MeetingAction from '../components/meeting-actions/MeetingAction'
import LatestUpcoming from '../components/meeting-actions/LatestUpcoming'

function HomePage() {
  return (
    <section className='space-y-5 h-screen w-full'>
      <MeetingAction/>
      <LatestUpcoming />
    </section>
  )
}

export default HomePage
