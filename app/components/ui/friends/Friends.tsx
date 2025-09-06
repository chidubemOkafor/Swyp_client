import React from 'react'
import { Icon } from '../../lib/iconGenerator'
import Jazzicon from 'react-jazzicon'
import { FaCheck } from 'react-icons/fa'
import { IoMdClose } from 'react-icons/io'
import FriendCard from './FriendCard'

function Friends() {
    // mock data
    const friendArray: 
        {
            name: string,
            email: string
        }[] | []
     = [
        {
            name: "james Rodriguez",
            email: "james674@gmail.com"
        }
    ]
    if (friendArray.length === 0) {
        return (
            <div className='justify-center h-full p-5 flex items-center bg-neutral-800/30 rounded-md w-[30em]'>
                <p className='text-neutral-500'>You are friendless!</p>
            </div>
        )
    }
    return (
        <div className='h-[26em] p-5 flex items-start bg-neutral-800/30 rounded-md overflow-scroll overflow-x-hidden flex-col gap-5 w-[30em]'>
            {friendArray.map((friend, index) => (<FriendCard key = {index} friend={friend}/> ))}
        </div>
    )
}

export default Friends
