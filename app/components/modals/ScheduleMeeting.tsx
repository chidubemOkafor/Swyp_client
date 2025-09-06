import React, { useState } from 'react'
import Backdrop from '../lib/Backdrop'
import Button from '../ui/Button'
import AddFriend from './AddFriend'
import { useToggleAddFriends } from '@/app/stores/friends/useToggleAddFriends'

function ScheduleMeeting() {
    const [ isLoading, setIsLoading ] = useState(false)
    const [ tb, setTb ] = useState<'Open'| 'Closed'>('Closed')

    const { isFriendsOpen,setIsFriendsOpen } = useToggleAddFriends()

    const tabActive = 'bg-purple-400 text-black rounded-md py-3 w-full font-bold cursor-pointer'
    const tabNotActive = 'bg-neutral-700 rounded-md w-full hover:bg-neutral-800 cursor-pointer'
    
    return (
        <Backdrop className='' title='Schedule'>
            <div className='flex gap-5'>
            <form className="space-y-5 flex flex-col text-start w-full">
                <div>
                    <input
                        placeholder="meeting title"
                        className="bg-neutral-800/30 outline-none w-full h-12 pl-5 rounded-md"
                        required
                    />
                </div>
                <div>
                    <textarea
                        placeholder="Add a discription"
                        className="bg-neutral-800/30 outline-none w-full h-12 p-5 rounded-md max-h-[7em] min-h-[7em]"
                        required
                    />
                </div>
                <div>
                    <input
                        type="datetime-local"
                        placeholder="Select Date and Time"
                        className="bg-neutral-800/30 outline-none w-full h-12 pl-5 rounded-md"
                        required
                    />
                </div>
                <div className='flex gap-5'>
                    <input
                        min={5}
                        type="number"
                        placeholder="Meeting duration"
                        className="bg-neutral-800/30 outline-none w-full h-12 pl-5 rounded-md"
                    />
                    <p className='bg-neutral-800/30 p-2 px-4 rounded-md font-bold flex items-center'>Min</p>
                    
                </div>
                <div className="rounded-md flex justify-between gap-5 bg-neutral-800/30 p-3">
                    <div className='w-[20em] flex items-center justify-center'>
                        <p className=''>meeting type</p>
                    </div>
                    <Button
                        type ="button"
                        className={tb === 'Closed' ? tabActive : tabNotActive}
                        onClick={() => {setTb('Closed'); setIsFriendsOpen(false)}}
                    >
                        Open
                    </Button>
                    <Button
                        type ="button"
                        className={tb === 'Open' ? tabActive : tabNotActive}
                        onClick={() => {setTb('Open'); setIsFriendsOpen(true)}}
                    >
                        Closed
                    </Button>
                </div>
                <Button type='submit' disabled={isLoading}>
                    Continue
                </Button>
            </form>
            {isFriendsOpen && <AddFriend />}
            </div>
        </Backdrop>
    )
}

export default ScheduleMeeting
