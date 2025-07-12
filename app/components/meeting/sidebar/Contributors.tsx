"use client"

import React, { useState, useEffect } from 'react'
import { IoIosMic } from 'react-icons/io'
import { RiArrowDropDownLine } from 'react-icons/ri'
import Jazzicon from 'react-jazzicon'
import { motion, AnimatePresence } from 'framer-motion'
import { RiSearch2Line } from "react-icons/ri";
import { useSocketStore } from '@/app/ws-functions/ws.config';
import { useParams } from 'next/navigation'
import { useContributorsStore } from '@/app/stores/contributors/useContributorsStore'

function Contributors({setTitle}:{setTitle: React.Dispatch<React.SetStateAction<string>>}) {
  const [open, setOpen] = useState(false)
  const {socket, initializeSocket} = useSocketStore()
  const {peers} = useContributorsStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const params = useParams()

  useEffect(() => {
    setTitle("contributors")
    
    if (!socket) {
      initializeSocket(params.id as string);
      return;
    }
  
    setLoading(true);
    setLoading(false);
    setError(null);
  
    socket.on('get-peers-error', (err) => {
      setError(err.error || "Unknown error");
      setLoading(false);
    });

    return () => {
      socket.off('get-peers');
      socket.off('get-peers-error');
    };
  }, [socket,initializeSocket, params.id]);

  return (
    <div className='space-y-3 mt-5'>
      <form className='bg-neutral-800 w-full rounded-md flex'>
        <input
          type='search'
          className='bg-neutral-700 w-full rounded-l-md outline-0 pl-4 py-3'
          placeholder='Search for person'
        />
        <button className='px-4 cursor-pointer' type='submit'>
          <RiSearch2Line/>
        </button>
      </form>
    
      <b>IN THE MEETING</b>
      <div className='space-y-1 mt-3'>
        <div
          className={`flex justify-between bg-neutral-800 p-4 py-3 transition-all duration-300 ease-in-out ${
            open ? 'rounded-t-md' : 'rounded-md'
          }`}
        >
          <span>peers</span>
          <div className='space-x-9 flex items-center'>
            <span>{peers.length}</span>
            <button onClick={() => setOpen(!open)}>
              <RiArrowDropDownLine
                className={`size-7 transform transition-transform duration-300 ${
                  open ? 'rotate-180' : ''
                }`}
              />
            </button>
          </div>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              key="dropdown"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className='bg-neutral-800 rounded-b-md overflow-hidden'
            >
             {loading ||peers.map((peer, index) => (
              <div key={index} className='flex justify-between p-2'>
                <div className='flex items-center gap-3'>
                  <Jazzicon diameter={30} seed={parseInt(peer.userId)} />
                  <div>
                    <p>{peer.username}</p>
                    <p className='text-[10px]'>{peer.role}</p>
                  </div>
                </div>
                <div className='space-x-9 flex items-center'>
                  <IoIosMic className='size-6' />
                </div>
              </div>))
              }
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default Contributors
