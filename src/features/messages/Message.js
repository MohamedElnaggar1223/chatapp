import { motion } from 'framer-motion'
import React, { memo, useEffect, useRef } from 'react'

function Message({ end, message, className }) 
{
    const endRef = useRef()

    useEffect(() => 
    {
        //@ts-ignore
        end && endRef.current.scrollIntoView()
    }, [end])
    
    const content = className === 'sender' && end
    ? (
        
        <motion.div initial={{  x: '-50%', y:'100%', opacity: 0 }} animate={{  x: 0, y: 0, opacity: 1 }} transition={{ delay: 0.05, type: 'tween', duration: 0.5 }}
// @ts-ignore
        ref={endRef} className={className} key={message._id}>
            <div className='Message'>
                {`${message.message}`}
            </div>
            <div className='Date'>
                {`${new Date(message.createdAt).toLocaleTimeString()}\n`}
            </div> 
        </motion.div>
        
    )
    : className === 'receiver' && end
    ? (
        
            <motion.div initial={{ originY: 0 }} animate={{  y: 0 }} transition={{ type: 'tween', duration: 0.5 }}
// @ts-ignore
            ref={endRef} className={className} key={message._id}>
                <div className='Date'>
                    {`${new Date(message.createdAt).toLocaleTimeString()}\n`}
                </div> 
                <div className='Message'>
                    {`${message.message}`}
                </div>
            </motion.div>
        
    )
    : className === 'receiver' 
    ? (
        
            <motion.div initial={{ originY: 0 }} animate={{  y: 0 }} transition={{ type: 'tween', duration: 0.5 }} className={className} key={message._id}>
                <div className='Date'>
                    {`${new Date(message.createdAt).toLocaleTimeString()}\n`}
                </div> 
                <div className='Message'>
                    {`${message.message}`}
                </div>
            </motion.div>
        
    )
    : (
        
            <motion.div initial={{ originY: 0 }} animate={{  y: 0 }} transition={{ type: 'tween', duration: 0.5 }} className={className} key={message._id}>
                <div className='Message'>
                    {`${message.message}`}
                </div>
                <div className='Date'>
                    {`${new Date(message.createdAt).toLocaleTimeString()}\n`}
                </div> 
            </motion.div>
        
    )

    return content
}

const memoizedMessage = memo(Message)

export default memoizedMessage