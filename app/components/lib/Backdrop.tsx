import useToggle from '@/app/stores/auth/useAuthToggle';
import React, { useRef } from 'react'
import { IoIosCloseCircle } from 'react-icons/io';
import { useClickAway } from 'react-use';

function Backdrop({children}: Readonly<{ children?: React.ReactNode}>) {
    const { setOpen } = useToggle()
    const authModalRef = useRef<HTMLDivElement | null>(null)

    useClickAway(authModalRef, () => {
      setOpen(null)
    });
    //bg-[#202020]
  return (
    <div className="backdrop-blur-sm fixed inset-0 flex items-center justify-center z-20">
    <div 
      ref = {authModalRef}
    className="bg-neutral-800 rounded-md shadow-xl p-5 space-y-5 w-[30em]">
        <div className='flex justify-end'>
          <button className='cursor-pointer' onClick={() => setOpen(null)}>
            <IoIosCloseCircle className='size-5'/>
          </button>
        </div>
      {children}
    </div>
    </div>
  )
}

export default Backdrop
