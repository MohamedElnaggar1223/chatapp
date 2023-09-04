import React, { memo } from 'react'
import FriendButton from './FriendButton'

function FriendsButtons({ userId, friendsUsernames }) 
{
    let chats
    if(!Array.isArray(friendsUsernames) || !friendsUsernames.length) chats = <p style={{ textAlign: 'center' }}>No Chats Yet</p>
    else
    {
        chats = friendsUsernames.map((friend, index) => <FriendButton key={friend.id} userId={userId} friend={friend} />)
    }
    return chats
}

const memoizedButtons = memo(FriendsButtons)
export default memoizedButtons
