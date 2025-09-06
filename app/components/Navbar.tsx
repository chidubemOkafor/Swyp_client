"use client"

import React, { useEffect, useState } from 'react'
import useToggle from '../stores/auth/useAuthToggle'
import useAuth from '../stores/auth/useAuthStore'
import { isLoggedIn } from '../stores/auth/useAuthStore'
import { getSetting } from './lib/settings'
import Jazzicon from 'react-jazzicon'
import { getUsername } from '../stores/auth/useAuthStore'
import MeetingId from './modals/MeetingId'
import { useParams } from 'next/navigation'

function Navbar() {
    const { setOpen,setIsLogIn } = useToggle()
    const { logOut, isLggedIn } = useAuth()
    const params = useParams()
    
    const [ islog, setIsLog ] = useState(false)
    const [ jazId, setJazId ] = useState("")
    const [ username, setUsername] = useState("")

    useEffect(() => {
        async function checkIsLoggedIn() {
            setIsLog(await isLoggedIn() as boolean)
            setJazId(await setting() as string)
            fetchUsername()
        }
        checkIsLoggedIn()
    },[isLggedIn])
    
    const [tb, setTb] = useState<'SignUp'| 'SignIn' | 'logout'>('SignUp')

    const tabActive = 'bg-blue-500 cursor-pointer bg-neutral-800'
    const tabNotActive = 'bg-gray-700 cursor-pointer hover:bg-neutral-900'

    function signup() {
        setTb('SignUp')
        setOpen("auth")
        setIsLogIn(false)
    }

    function signin() {
        setTb('SignIn')
        setOpen("auth")
        setIsLogIn(true)
    }

    async function setting() {
       const set = await getSetting()
       return set?.imageId
    }

    async function fetchUsername() {
        setUsername(await getUsername())
    }
    
  return (
    <nav className=' flex justify-between py-5 px-10'>
           <div className='flex items-center gap-3'>
                <p><b>Meeting ID:</b></p>
                <MeetingId meetingId={params.id as string}/>
            </div>
        <div className='p-3 rounded-4xl flex justify-between items-center space-x-2'>
         
           {islog && <div className='flex gap-2'>
                <Jazzicon diameter={25} seed={parseInt(jazId)}/>
                <span>{username}</span>
            </div>}
            {!islog ?
               ( <>
                    <button className={`px-10 py-2 rounded-md ${tb === 'SignUp' ? tabActive : tabNotActive}`} onClick={signup}>SignUp</button>
                    <button className={`px-10 py-2 rounded-md ${tb === 'SignIn' ? tabActive : tabNotActive}`} onClick={signin}>SignIn</button>
                </>)
                :
                <button className={`px-10 py-2 rounded-md ${tb === 'logout' ? tabActive : tabNotActive}`} onClick={logOut}>loggout</button>
            }
        </div>
    </nav>
  )
}

export default Navbar
