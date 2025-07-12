import { Formik } from 'formik'
import React from 'react'
import * as Yup from "yup"
import { errortext } from '../auth/SignUp';
import { useMeeting } from '@/app/stores/meeting/useMeetingStore';
import { useRouter } from 'next/navigation';

function Join() {
    const join = useMeeting(state => state.join)
    const router = useRouter();

    return (
    <div className='space-y-5 flex justify-between flex-col w-[30em]'>
        <Formik initialValues={{room_name: "", meeting_id: ""}}
            validationSchema={Yup.object({
                room_name: Yup.string()
                    .nullable() 
                    .notRequired(),

                meeting_id: Yup.string()
                    .uuid("Invalid meeting ID format")
                    .required("meeting ID is required to join")
            })}

            onSubmit={(values, { setSubmitting }) => {
                setTimeout(async() => {
                  const meetingId = await join(values)
                  router.push(`/meeting/${meetingId}`);
                  setSubmitting(false);
                }, 400);
              }}
        >

            {formik => (
                <form onSubmit={formik.handleSubmit} className='w-full space-y-5'>
                <div>
                    <input 
                    type='text' 
                    placeholder= "your name" 
                    className='bg-neutral-800 outline-none w-full h-10 pl-5 rounded-md'
                    {...formik.getFieldProps("room_name")}
                    />
                    {formik.touched.room_name && formik.errors.room_name ? (
                    <span className={errortext}>{formik.errors.room_name}</span>
                    ) : null}
                </div>
                <div>
                    <input 
                        type='text' 
                        placeholder= "meeting id" 
                        className='bg-neutral-800 outline-none w-full h-10 pl-5 rounded-md'
                        required
                        {...formik.getFieldProps("meeting_id")}
                    />
                    {formik.touched.meeting_id && formik.errors.meeting_id ? (
                    <span className={errortext}>{formik.errors.meeting_id}</span>
                    ) : null}
                   
                </div>
                    <button 
                    type='submit' 
                    className={` w-full rounded-md py-2 ${!formik.isSubmitting ? 'cursor-pointer bg-neutral-500' : 'cursor-progress bg-neutral-400'}`} disabled = {formik.isSubmitting}>
                        Join
                    </button>
                </form>
            )}
        </Formik>
    </div>
    )
}

export default Join