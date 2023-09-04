import React, { memo, useEffect, useRef } from 'react'
//import { useGetMessagesQuery } from './messagesApiSlice'
import Message from './Message'
import SendMessage from './SendMessage'
import Typing from './Typing'
import autoAnimate from '@formkit/auto-animate'
import { AnimatePresence, motion } from 'framer-motion'

function Messages({ chatsData, userId, username, friendId }) 
{
    const parent = useRef(null)

    useEffect(() => {
        parent.current && autoAnimate(parent.current)
      }, [parent])

    const { ids, entities } = chatsData
    const chats = ids.map(id => 
        {
            if(entities[id].sender === friendId || entities[id].receiver === friendId) return entities[id]
            else return null
        })

    const chatsArray = Array.isArray(chats) && chats.filter(chat => chat != null)

    let messages
    if(!Array.isArray(chatsArray) || !chatsArray.length) messages = <div style={{ height: '100%', 'textAlign': 'center', 'marginTop': '20%' }}> This Is The Start Of Your Chat!</div>
    else
    {
        messages = chatsArray.map((message, index) => 
            {
                let className
                if(message.sender === userId) className = 'sender'
                else className = 'receiver'
                return (
                    <Message key={message.id} end={index === chatsArray.length - 1} className={className} message={message} />
                )
            })
    }



    return (
        <div ref={parent} className='MessagesList'>
            
            <motion.div className='ChatBody'>
                <AnimatePresence>
                    {messages}
                </AnimatePresence>
                <Typing userId={userId} friendId={friendId} />
            </motion.div>
            
            {messages && <SendMessage userId={userId} friendId={friendId} />}
        </div>
    )
}

const memoizedMessage = memo(Messages)

export default memoizedMessage