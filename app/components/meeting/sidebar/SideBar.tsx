import React, { useState } from 'react'
import Details from './Details'
import Contributors from './Contributors'
import Chat from './Chat'
import { sidebarStore } from '@/app/stores/sidebar-button/sideBarStore'
import { motion } from 'framer-motion'
import { IoIosCloseCircle } from 'react-icons/io'

function SideBar({
}) {
    const [ title, setTitle ] = useState("")
    const { tab, setTab } = sidebarStore()
  return (
    <>
      {tab !== null && (
            <motion.div
              key="tab-panel"
              layout
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              className='rounded-md w-[20%] p-5 shadow-black'
            >
              <div className='flex justify-between'>
                <b>{title}</b>
                <button
                  className='cursor-pointer'
                  onClick={() => setTab(null)}
                >
                  <IoIosCloseCircle className='size-5' />
                </button>
              </div>
              {tab === "details" && <Details setTitle={setTitle}/>}
              {tab === "contrb" && <Contributors setTitle={setTitle}/>}
              {tab === "chat" && <Chat setTitle={setTitle}/>}
            </motion.div>
          )}
    </>
  )
}

export default SideBar
