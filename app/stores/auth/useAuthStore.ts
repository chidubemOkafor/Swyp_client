import dotenv from "dotenv"
dotenv.config
import axios from "axios"
import { create } from "zustand"
import useToggle from "./useAuthToggle"
import { toast } from "react-toastify"

export const http_server = process.env.NEXT_PUBLIC_HTTP_SERVER

interface IPayload{
    username: string,
    password: string
}

interface IAuth {
    isLggedIn: boolean,
    signIn: (value: IPayload) => Promise<void>
    signUp: (value: IPayload) => Promise<void>
    logOut: () => void
}

const useAuth = create<IAuth>((set) => ({
    isLggedIn: false,
    signIn: async (value) => {
        await SignIn({username: value.username, password: value.password})
        set({isLggedIn: await isLoggedIn()})
    },
    signUp: async (value) => await SignUp({username: value.username, password: value.password}),
    logOut: async () => {
        await logOut()
        set({isLggedIn: false})
    }
}))

async function SignUp({ username, password}: IPayload) {
    try {
        const response = await axios.post(`${http_server}auth/create`, {
            username,
            password
        })

        if(response.status === 201) {
            console.log(response)
            toast.success(response.data.message)
            useToggle.getState().setIsLogIn(true)
        }
        
    } catch (error: any) {
        toast.error(error.response.data.message)
        console.error(error)
    }
}

async function SignIn({ username, password}: IPayload) {
    try {
        const response = await axios.post(`${http_server}auth/signin`, {
            username,
            password
        })

        if (response.status === 201) {
            cookieStore.set('jsonwebtoken', response.data.jwt)
            cookieStore.set('username', response.data.username)
            cookieStore.set('userId', response.data.userId)
        }
        toast.success("logged in successfully")
        useToggle.getState().setOpen(null)
    } catch (error: any) {
        toast.error(error.response.data.message)
        console.error(error)
    }
}

export async function isLoggedIn() {
    try {
        if(await getJwt()) {
            return true
        }
        return false
    } catch (error) {
        console.error
    }
}

async function logOut() {
    if(await getJwt()) {
        cookieStore.delete("jsonwebtoken")
        toast.success("successfully logged out")
    }
}

export async function getUsername() {
    const username = await cookieStore.get("username")
    if(username && username.value) {
        return username.value
    }
    return "no username"
}

export async function getUserId() {
    const userId = await cookieStore.get("userId")
    if(userId && userId.value) {
        return userId.value
    }
    return "no userId"
}

export async function getJwt() {
    try {
        const jwt = await cookieStore.get("jsonwebtoken")
        if(jwt && jwt.value) {
            return jwt.value
        }
    } catch (error) {
        console.error(error)
    }
}

export default useAuth