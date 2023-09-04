import React, { memo, useState } from 'react'
import { useDispatch } from 'react-redux'
import { setDisplay } from './displaySlice'
import { socket } from '../../config/socket'
import AvatarName from './AvatarName'
import AvatarImage from './AvatarImage'
import { amber, blue, blueGrey, deepOrange, deepPurple } from '@mui/material/colors';
const Colors = [ amber, blue, blueGrey, deepOrange, deepPurple ]

function FriendButton({ friend, userId }) 
{
    socket.connect()

    const [typingChat, setTyping] = useState(false)

    const dispatch = useDispatch()
    socket.timeout(1500).on(`${friend.id}typingto${userId}`, () => 
    {
        setTyping(true)
    })

    setTimeout(() => {
        if(typingChat) {
            setTyping(false)
        }
    }, 3000)

    return (
        <button onClick={() => dispatch(setDisplay(friend))} 
                key={friend.id}>
                {
                !(parseInt(friend.image) >= 0)
                ? <AvatarImage image={friend.image} />
                : <AvatarName name={friend.username} color={Colors[parseInt(friend.image)]} />
                }
                <div className='Name'>
                    {friend.username}
                </div> 
                <div className='LastMessage'>
                    {typingChat ? 'typing...' : friend.lastMessage?.message?.length > 10 ? `${friend.lastMessage?.message?.slice(0,10)}...` : friend.lastMessage?.message}
                </div> 
        </button>
    )
}

const memoizedFriendButton = memo(FriendButton)
export default memoizedFriendButton