import React, { useEffect, useRef } from 'react'
import { useSendLogoutMutation } from './authApiSlice'
import { useNavigate } from 'react-router-dom'
import Login from './Login'

export default function Logout() 
{
    const [logout, 
        {
            isSuccess
        }] = useSendLogoutMutation()

    const ranRef = useRef(false)
    const navigate = useNavigate()

    //@ts-ignore
    useEffect(() => 
    {

        if(ranRef.current === true || process.env.NODE_ENV !== 'development')
        {
            async function sendLogOut()
            {
                try
                {
                    //@ts-ignore
                    await logout()
                }
                catch(e)
                {
                    console.error(e)
                }
            }

            sendLogOut()
        }

        return () => ranRef.current = true
        // eslint-disable-next-line
    }, [])

    if(isSuccess) 
    {
        navigate('/login')
        setTimeout(() => {
            return <Login />
        }, 500);
    }
}
