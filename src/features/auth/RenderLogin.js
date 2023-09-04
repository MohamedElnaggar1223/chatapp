import React, { useEffect, useRef, useState } from 'react'
import { selectCurrentToken } from './authSlice'
import { useSelector } from 'react-redux'
import { useRefreshMutation } from './authApiSlice'
import { Outlet, Link } from 'react-router-dom'

export default function RenderLogin() 
{
    const token = useSelector(selectCurrentToken)
    const [ran, setRan] = useState(false)
    const effectRan = useRef(false)

    const [refresh, 
        {
            isUninitialized,
            isLoading,
            isSuccess,
            isError,
            error
        }] = useRefreshMutation()

    //@ts-ignore
    useEffect(() => 
    {
        if(effectRan.current === true || process.env.NODE_ENV !== 'development')
        {
            async function verifyRefreshToken()
            {
                try
                {
                    //@ts-ignore
                    await refresh()
                    setRan(true)
                }
                catch(e)
                {
                    console.error(e)
                }
            }

            if(!token) verifyRefreshToken()
        }

        return () => effectRan.current = true
        // eslint-disable-next-line
    }, [])

    let content
    if(isLoading) content = <p>Loading...</p>
    //@ts-ignore
    else if(isError) content = <p>{error?.data?.message} <Link to='/login'>Please Log In Again</Link></p>
    else if(isSuccess && ran) content = <Outlet />
    else if(token && isUninitialized) content = <Outlet />

    return content
}
