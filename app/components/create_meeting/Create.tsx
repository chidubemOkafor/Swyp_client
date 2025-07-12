import React from 'react'
import * as Yup from "yup"
import { Formik } from 'formik'
import { errortext } from '../auth/SignUp';
import useToggle from '@/app/stores/auth/useAuthToggle';
import { useMeeting } from '@/app/stores/meeting/useMeetingStore';

function Create() {
    const setCreateMeetingValue = useMeeting(state => state.setCreateMeetingValue)
    const { setOpen } = useToggle()
  return (
    <div className='space-y-5 flex justify-between flex-col w-[30em]'>

        <Formik
            initialValues={{room_name: "", meeting_title: ""}}
            validationSchema={
                Yup.object({
                    room_name: Yup.string()
                    .nullable() 
                    .notRequired(),

                    meeting_title: Yup.string()
                    .required("you need a title to create a meeting")
                })
            }

            onSubmit={(values, { setSubmitting }) => {
                setTimeout(async() => {
                    console.log(values)
                    setOpen("meeting")
                    setCreateMeetingValue(values)
                    setSubmitting(false);
                }, 400);
              }}
            >
            {formik => (
                <form 
                    className='w-full space-y-5'
                    onSubmit={formik.handleSubmit}
                >
                <div>
                    <input 
                        type='text' 
                        placeholder= "your name" 
                        className='bg-neutral-800 outline-none w-full h-10 pl-5 rounded-md'
                        {...formik.getFieldProps("room_name")}
                    />
                    {
                        formik.touched.room_name && formik.errors.room_name 
                            ? 
                                (
                                    <span className={errortext}>{formik.errors.room_name}</span>
                                ) 
                            : 
                                null
                    }   
                </div>
                <div>
                    <input 
                        type='text' 
                        placeholder= "meeting title" 
                        className='bg-neutral-800 outline-none w-full h-10 pl-5 rounded-md' 
                        required
                        {...formik.getFieldProps("meeting_title")}
                    />
                    {
                        formik.touched.meeting_title && formik.errors.meeting_title 
                            ? 
                                (
                                    <span className={errortext}>{formik.errors.meeting_title}</span>
                                ) 
                            : 
                                null
                    }  
                </div>
                <button 
                    type='submit' 
                    className={` w-full rounded-md py-2 ${!formik.isSubmitting ? 'cursor-pointer bg-neutral-500' : 'cursor-progress bg-neutral-400'}`} disabled = {formik.isSubmitting}>
                        New Meeting
                </button>
            </form>)}
        </Formik>
        </div>
  )
}

export default Create
