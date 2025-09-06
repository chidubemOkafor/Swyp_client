import React, { useState } from 'react'
import Button from '../ui/Button'
import Friends from '../ui/friends/Friends'
import SearchForFriend from '../ui/friends/SearchForFriend'

function AddFriend() {
    const [tb, setTb] = useState<'Search'| 'Friends'>('Friends')

    const tabActive = 'bg-amber-400 text-black rounded-md py-3 w-full font-bold cursor-pointer'
    const tabNotActive = 'bg-neutral-700 rounded-md w-full hover:bg-neutral-800 cursor-pointer'
    return (
        <div className='flex flex-col gap-5'>
            <div className="rounded-md flex justify-between gap-5">
                <Button
                    className={tb === 'Friends' ? tabActive : tabNotActive}
                    onClick={() => setTb('Friends')}
                >
                    Friends
                </Button>
                <Button
                    className={tb === 'Search' ? tabActive : tabNotActive}
                    onClick={() => setTb('Search')}
                >
                    Search
                </Button>
            </div>
            {tb == "Friends" && <Friends/>}
            {tb == "Search" && <SearchForFriend/>}
        </div>
    )
}

export default AddFriend
