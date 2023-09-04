import React, { memo } from 'react'
import { socket } from '../../config/socket'
import PulseLoader from 'react-spinners/PulseLoader'
import { selectTyping, setTyping } from './displaySlice'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from "framer-motion"

function Typing({friendId, userId}) 
{
    socket.connect()

    const dispatch = useDispatch()
    
    const typing = useSelector(selectTyping)
    
    socket.timeout(1500).on(`${friendId}typingto${userId}`, () => 
        {
            if(!typing) dispatch(setTyping({typing: true}))
        })

    setTimeout(() => {
        if(typing) dispatch(setTyping({typing: false}))
    }, 3000);

    socket.on('newMessageSent', () => dispatch(setTyping({typing: false})))

    return typing && <motion.div className='receiver' > <PulseLoader /></motion.div>
}

const momoizedTyping = memo(Typing)
export default momoizedTyping
