import useToggle from '@/app/stores/auth/useAuthToggle';
import React, { useRef } from 'react'
import { IoIosCloseCircle } from 'react-icons/io';
import { useClickAway } from 'react-use';

type IcontextProp = 'no-backdrop'

function Backdrop({children, className = "w-[30em]", title = "", contextProps = [] }: 
  { 
    children?: React.ReactNode, 
    className?: string, 
    title?: string,
    contextProps?: Array<IcontextProp>
  }
  ) {

    let isBackDrop = 'backdrop-blur-sm'
    if(contextProps.includes('no-backdrop')) {
      isBackDrop = ''
    }

    const { setOpen } = useToggle()
    const authModalRef = useRef<HTMLDivElement | null>(null)

    useClickAway(authModalRef, () => {
      setOpen(null)
    });
    //bg-[#202020]
  return (
    <div className={`fixed inset-0 flex items-center justify-center z-2 ${isBackDrop}`}>
    <div 
      ref = {authModalRef}
    className={`bg-neutral-900 rounded-md shadow-xl p-5 space-y-5 ${className}`}>
        <div className='flex justify-between'>
          <p className='text-3xl font-bold'>{title}</p>
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
