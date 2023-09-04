//import React, { useEffect, useState } from 'react'
import React from 'react'
import { socket } from '../../config/socket'
// import { Outlet } from 'react-router-dom'
import { store } from '../../app/store'
import { messagesApiSlice, useGetMessagesQuery } from '../messages/messagesApiSlice'
import useAuth from '../../hooks/useAuth'
import MessagesList from '../messages/MessagesList'
import { useGetFriendsQuery, usersApiSlice } from '../users/usersApiSlice'
// import { selectDisplay } from '../messages/displaySlice'
// import { useSelector } from 'react-redux'

export default function Socket()
{
    const { id, username } = useAuth()

    socket.connect()

    const 
    { 
        data: chatsData,
        isSuccess,
    } = useGetMessagesQuery({username}, 
        {
            pollingInterval: 120000000,
            refetchOnFocus: false,
            refetchOnMountOrArgChange: false,
            refetchOnReconnect: false
        })

    const 
    {
        data: friendsArray,
        isSuccess: friendsSuccess
    } = useGetFriendsQuery({id}, 
        {
            pollingInterval: 120000000,
            refetchOnFocus: false,
            refetchOnMountOrArgChange: false,
            refetchOnReconnect: false
        })

    socket.on('newMessageSent', async () => {
        //console.log('socket ran')
        await store.dispatch(messagesApiSlice.util.prefetch('getMessages', { username }, { force: true }))
        await store.dispatch(usersApiSlice.util.prefetch('getFriends', { id }, { force: true }))
        //await store.dispatch(messagesApiSlice.endpoints.getMessages.initiate({ username }, { forceRefetch: false }))
        //store.dispatch(messagesApiSlice.util.invalidateTags([{type: 'Message', id: 'LIST'}]))
        //console.log('data refreshed')
    })

    // //@ts-ignore
    // useEffect(() => 
    // {
    //     socket.connect()

    //     return () => socket.disconnect()
    // }, [])
    // const [refresh, setRefresh] = useState(false)

    // socket.on('newMessageSent', () => {
    //     setRefresh(prev => !prev)
    // })

    // useEffect(() => 
    // {   
    //     store.dispatch(messagesApiSlice.endpoints.getMessages.initiate({ username }, { forceRefetch: false }))
    //     //store.dispatch(messagesApiSlice.util.invalidateTags([{ type: 'Message', id: 'LIST' }]))
    //     // store.dispatch(messagesApiSlice.util.updateQueryData('getMessages', undefined, (draftmessages) => 
    //     // {
            
    //     // }))
    //     // store.dispatch(messagesApiSlice.endpoints.getMessages.initiate(username))
    //     // store.dispatch(messagesApiSlice.util.updateQueryData('getMessages', username, () => {}))
    // }, [refresh, username, friendId])

    if(isSuccess && friendsSuccess) return <MessagesList friendsArray={friendsArray || []} chatsData={chatsData} />
}