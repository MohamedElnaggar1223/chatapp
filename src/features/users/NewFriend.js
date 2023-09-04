import React from 'react'
import useAuth from '../../hooks/useAuth'
import { useGetUsersQuery } from './usersApiSlice'
import NewFriendFrom from './NewFriendForm'

export default function NewFriend() 
{
    const { id, friends } = useAuth()
    const { users } = useGetUsersQuery('usersList',
    {
        selectFromResult: ({ data }) => ({
            users: data?.ids.map(id => data?.entities[id])
        })
    })

    const usersWithoutFriends = users?.filter(user => !friends.includes(user.id) && user.id !== id)

    if(!usersWithoutFriends) return <p>Loading...</p>

    return <NewFriendFrom users={usersWithoutFriends || []} />
}
