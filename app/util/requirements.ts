import * as Yup from "yup"

export const requirements = {
    username: Yup.string()
        .max(15, 'Must be 15 characters or less')
        .required('Required'),
    password: Yup.string()
        .min(8, 'Must be at least 8 characters')
        .matches(/[a-z]/, 'Must contain at least one lowercase letter')
        .matches(/[A-Z]/, 'Must contain at least one uppercase letter')
        .matches(/\d/, 'Must contain at least one number')
        .matches(/[@$!%*?&]/, 'Must contain at least one special character (@$!%*?&)')
        .required('Password is required'),
}