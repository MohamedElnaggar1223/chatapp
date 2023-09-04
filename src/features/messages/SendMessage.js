import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { memo, useEffect, useState } from 'react'
import { useAddMessageMutation } from './messagesApiSlice'
import { socket } from '../../config/socket'

function SendMessage({ userId, friendId }) 
{
    socket.connect()
    const [sendMessage, setSendMessage] = useState('')
    
    const [sendNewMessage, 
            {
                isLoading,
                isSuccess
            }] = useAddMessageMutation()

    useEffect(() => 
        {
            if(isSuccess) setSendMessage('')
        }, [isSuccess])

    const canSave = sendMessage && !isLoading

    const onMessageChange = (e) => {
        // socket.timeout(10).emit(`${userId}typingto${friendId}`, userId, () => console.log(`${userId} typing to ${friendId}`))
        socket.timeout(10).emit('typing', {userId, friendId}, () => {})
        setSendMessage(e.target.value)
    }

    async function onSendNewMessage(e)
    {
        e.preventDefault()
        try
        {
            await sendNewMessage({ friendId, sender: userId, receiver: friendId, message: sendMessage }).unwrap()
        }
        catch(e)
        {
            console.error(e)
        }
    }

    const newMessage = (
        <div className='newMessageForm'>
            <form style={ {display: 'flex', flexDirection: 'row'} }>
                <input
                    type='text'
                    value={sendMessage}
                    onChange={onMessageChange}
                    placeholder='message...'
                    autoComplete="off"
                />
                <button 
                    disabled={!canSave} 
                    onClick={onSendNewMessage}>
                        <FontAwesomeIcon icon={faPaperPlane} />
                </button>
            </form>
        </div>
    )
    return newMessage
}

const memoizedSendMessage = memo(SendMessage)
export default memoizedSendMessage
