import React from 'react'
import { FaCheck } from 'react-icons/fa'
import { IoMdClose } from 'react-icons/io'
import Jazzicon from 'react-jazzicon'
import { useFriendSchedule } from '@/app/stores/friends/useFriendSchedule'

function FriendCard({friend, variant = "schedule", ...params}: { friend: { name: string, email: string }, variant?: "schedule" | "addFriend" }) {
    const { friends, setFriend } = useFriendSchedule()
    const button = 'backdrop-blur-lg bg-green-600/80 p-3 rounded-md cursor-pointer'
    return (
        <div className='flex bg-neutral-800 items-center rounded-md w-full justify-between p-5' {...params}>
            <div className='flex gap-4'>
                <Jazzicon diameter={50}/>
                <div>
                    <p>{friend.name}</p>
                    <p>{friend.email}</p>
                </div>
            </div>
            {variant === "addFriend" && <div className='flex space-x-3'>
                <button className={button}><FaCheck className='size-6'/></button>
                <button className={`${button} bg-red-500/80`}><IoMdClose className='size-6'/></button>
            </div>}
            {variant === "schedule" && <div className='flex'>
                <button 
                    onClick={() => setFriend(friend)}
                    className='border-3 w-10 h-10 rounded-md cursor-pointer flex justify-center'>
                    <Check type={friends.find((value) => value === friend) ? "check": null}/>
                </button>
            </div>}
        </div>
    )
}

export function Check({type = null}: {type?: "check" | "cancel" | null}) {
    let componentMap;

    componentMap = {
        component: "",
        color: ""
    }
    
    if (type === "check") {
        componentMap = {
            component: <FaCheck/>,
            color: 'bg-green-600/80'
        }
    } else if (type === "cancel") {
        componentMap = {
            component: <IoMdClose/>,
            color: 'bg-green-600/80'
        }
    }

    const button = `backdrop-blur-lg ${componentMap.color} p-3 rounded-md cursor-pointer`
    return <div className={button}>{componentMap.component}</div>
}

export default FriendCard
