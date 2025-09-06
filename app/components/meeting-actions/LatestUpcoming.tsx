import React from 'react'

function LatestUpcoming() {
  return (
    <div className='backdrop-blur-lg bg-neutral-900/40 rounded-xl p-10 flex gap-3 shadow-lg h-[20em] flex-col w-full justify-between'>
        <div className='backdrop-blur-lg bg-neutral-400/40 p-3 rounded-md font-bold w-fit'>Upcoming Meeting at: 12:30 PM</div>
        <div>
            <p className='font-bold text-8xl'>09:22 AM</p>
            <p className='font-semibold text-3xl'>Wednesday, Febuary 27, 2040</p>
        </div>
    </div>
  )
}

export default LatestUpcoming
