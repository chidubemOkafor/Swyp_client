"use client"

import React from 'react'
import Jazzicon from 'react-jazzicon'

function SideBar() {
  return (
    <div className='bg-neutral-900 h-svh w-[25em] m-10 rounded-md fixed'>
        <div className='p-10 flex items-center gap-5'>
            <Jazzicon diameter={80} seed={parseInt("100")}/>
            <p>mike david</p>
        </div>
        <nav className='flex flex-col '>
            <span className='bg-amber-400 text-black mr-10 rounded-r-full text-md py-2 pl-10 text-bold cursor-pointer'>Home</span>
            <span className='text-md py-2 pl-10 text-bold cursor-pointer'>My Meetings</span>
            <span className='text-md py-2 pl-10 text-bold cursor-pointer'>Previous</span>
            <span className='text-md py-2 pl-10 text-bold cursor-pointer'>Recordings</span>
            <span className='text-md py-2 pl-10 text-bold cursor-pointer'>Spaces</span>
        </nav>
    </div>
  )
}

export default SideBar
