import React from 'react'
import { Icon } from '../../lib/iconGenerator'
import Jazzicon from 'react-jazzicon'
import { FaCheck } from 'react-icons/fa'
import { IoMdClose } from 'react-icons/io'
import FriendCard from './FriendCard'
import SearchBar from './SearchBar'

function SearchForFriend() {
    // mock data
    const friendArray: 
        {
            name: string,
            email: string
        }[] | []
     = [
    ]
    return (
        <div className='h-[26em] p-5 flex items-start bg-neutral-800/30 rounded-md overflow-scroll overflow-x-hidden flex-col gap-5 w-[30em]'>
            <SearchBar/>
            {friendArray.map((friend, index) => (<FriendCard key = {index} friend={friend}/> ))}
            {friendArray.length === 0 &&
            <div className='w-full h-full flex justify-center items-center'>
                 <p className='text-neutral-500'>You are friendless!</p>
            </div>
        
             }
        </div>
    )
}

export default SearchForFriend
