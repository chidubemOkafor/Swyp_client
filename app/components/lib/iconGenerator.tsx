import { useEffect, useState } from 'react'
import Jazzicon from 'react-jazzicon'
import { createSetting, getSetting } from './settings'
import { v4 } from "uuid"

export function Icon() {
    
    const [uuid, setUUID] = useState<string | null>(null)
    useEffect(() => {
        async function get() {
            const id = await getSetting()
            if (id && id.imageId) {
                setUUID(id.imageId)
            }
            await createSetting({
                imageId: v4()
            })
            await getSetting().then(id => id && id.imageId && setUUID(id?.imageId as string))
        }
        get()
    },[])
    return (
        <>
            {uuid == null || <Jazzicon diameter={100} seed={parseInt(uuid)}/>}
        </>
        
    )
}