import React, { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { store } from '../../app/store'
import { messagesApiSlice } from '../messages/messagesApiSlice'
import { usersApiSlice } from '../users/usersApiSlice'
import useAuth from '../../hooks/useAuth'
 
export default function Prefetch()
{
    const { username } = useAuth()

    useEffect(() => 
    {
        store.dispatch(messagesApiSlice.util.prefetch('getMessages', { username }, { force: true }))
        store.dispatch(usersApiSlice.util.prefetch('getUsers', 'usersList', { force: true }))
    }, [username])
    return <Outlet />
}