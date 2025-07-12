"use client"

import React, { useState, useRef } from 'react'
import { useClickAway } from 'react-use';
import { IoIosCloseCircle } from "react-icons/io";
import SignIn from '../auth/SignIn';
import SignUp from '../auth/SignUp';
import useToggle from '@/app/stores/auth/useAuthToggle';
import Backdrop from '../lib/Backdrop';

function AuthModal() {
  const { setOpen, islogIn } = useToggle()


  const [tb, setTb] = useState<'SignUp'| 'SignIn'>(islogIn ? 'SignIn' : 'SignUp' )
  const authModalRef = useRef<HTMLDivElement | null>(null)

  useClickAway(authModalRef, () => {
    setOpen(null)
  });

  const tabActive = 'bg-blue-500  rounded-4xl w-[49%] cursor-pointer'
  const tabNotActive = 'bg-gray-700 rounded-4xl w-[49%] hover:bg-gray-800 cursor-pointer'
  return (
    <Backdrop>
        <>
        <div className="w-full p-3 rounded-md flex justify-between">
          <button
            className={tb === 'SignUp' ? tabActive : tabNotActive}
            onClick={() => setTb('SignUp')}
          >
            Sign Up
          </button>
          <button
            className={tb === 'SignIn' ? tabActive : tabNotActive}
            onClick={() => setTb('SignIn')}
          >
            Sign In
          </button>
        </div>
        {tb == "SignUp" && <SignUp/>}
        {tb == "SignIn" && <SignIn/>}
        </>
      </Backdrop>
  )
}

export default AuthModal

