import { create } from "zustand"
import axios from "axios"
import dotenv from "dotenv"
import { getJwt, http_server } from "../auth/useAuthStore"
import { toast } from "react-toastify"
import useToggle from "../auth/useAuthToggle"

dotenv.config()

interface IMeetingValue {
    room_name: string,
    meeting_id: string
}

interface ICreateMeetingValue {
    // title: string
    // displayName: string
    room_name: string,
    meeting_title: string
}

interface IMeeting {
    join: (value: IMeetingValue) => Promise<void>,
    create: (value: ICreateMeetingValue) => Promise<string | undefined>,
    meetingId: string | null,
    setMeetingId: (value: string) => void,
    createMeetingValue: ICreateMeetingValue | null,
    setCreateMeetingValue: (value: ICreateMeetingValue) => void
}

export const useMeeting = create<IMeeting>((set) => ({
    join: async(value) => await Join(value),
    create: async(value) => {
        const id = await CreateMeeting(value);
        if (id) {
          set({ meetingId: id });
        }
        return id;
      },
    meetingId: null,
    setMeetingId: (value) => set({meetingId: value}),
    createMeetingValue: null,
    setCreateMeetingValue: async(value) => set({createMeetingValue: value})
}))

async function Join(value: IMeetingValue) {
    // console.log("value", value)
    try {
        const jwt = await getJwt()
        if(!jwt) {
            toast.error("login to continue")
            useToggle.getState().setOpen("auth")
        }
        const response = await axios.post(`${http_server}meeting/join`,
        {
            room_name: value.room_name, 
            meetingId: value.meeting_id,
        }, {
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        })
            toast.success(response.data.message)
            return response.data.meeting.meetingId
    } catch (error: any) {
        if (error.response.status === 404 || 
            error.response.status === 409) {
                toast.error(error.response.data.message)
        }

        console.error(error)
    }
}

async function CreateMeeting(value: ICreateMeetingValue) {
    try {
        const jwt = await getJwt()
        if(!jwt) {
            toast.error("login to continue")
            useToggle.getState().setOpen("auth")
        }
        const response = await axios.post(`${http_server}meeting/create`,
            { 
                title: value.meeting_title, 
                displayName: value.room_name
            }, {
                headers: {
                    Authorization: `Bearer ${jwt}`
                }
            })
        return response.data.meetingId as string
    } catch (error) {
        console.error(error)
    }
}

