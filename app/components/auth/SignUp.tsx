import React, { useState } from 'react'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { requirements } from '@/app/util/requirements'
import useAuth from '@/app/stores/auth/useAuthStore'

export const errortext = "text-red-500 text-sm"

function SignUp() {
    const signUp = useAuth(state => state.signUp)
    const [isLoading, setIsLoading] = useState(false)
  return (
    <Formik 
        initialValues={{ username: '', password: '', confirmPassword: '' }}
        validationSchema={Yup.object({
            ...requirements,
            confirmPassword: Yup.string()
                .nullable()
                .oneOf([Yup.ref('password'), null], 'Passwords must match')
                .required('Required'),
        })}
        onSubmit={(values, { setSubmitting }) => {
            setIsLoading(true)
            setTimeout(async() => {
              alert(JSON.stringify(values, null, 2));
              await signUp(values)
              setSubmitting(false);
              setIsLoading(false)
            }, 400);

          }}>
        
       {formik  => ( 
        <form
            onSubmit={formik.handleSubmit}
            className="w-full space-y-5">
        <div>
            <input
                type="text"
                placeholder="username"
                className="border border-gray-800 outline-none w-full h-10 pl-5 rounded-4xl"
                required
                {...formik.getFieldProps('username')}
            />
            {formik.touched.username && formik.errors.username ? (
                <span className={errortext}>{formik.errors.username}</span>
            ) : null}
        </div>
 
        <div>
            <input
                type="password"
                placeholder="password"
                className="border border-gray-800 outline-none w-full h-10 pl-5 rounded-4xl"
                required
                {...formik.getFieldProps('password')}
            />
            {formik.touched.password && formik.errors.password ? (
                <span className={errortext}>{formik.errors.password}</span>
            ) : null}
        </div>
        
        <div>
            <input
                type="password"
                placeholder="confirm password"
                className="border border-gray-800 outline-none w-full h-10 pl-5 rounded-4xl"
                required
                {...formik.getFieldProps('confirmPassword')}
            />
            {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
                <span className={errortext}>{formik.errors.confirmPassword}</span>
            ) : null}
        </div>
            <button type='submit' className={` w-full rounded-4xl py-2 ${!isLoading ? 'cursor-pointer bg-gray-500' : 'cursor-progress bg-gray-400'}`} disabled={isLoading}>
                Continue
            </button>
        </form>)}
    </Formik>
  )
}

export default SignUp