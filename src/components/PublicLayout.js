import { motion } from 'framer-motion'
import React from 'react'
import { Link } from 'react-router-dom'

export default function PublicLayout()
{
    return (
        <motion.div exit={{ x: '-100vw' }} transition={{ duration: 0.4, ease: 'easeInOut', type: 'tween' }} className='Welcome'>
            <motion.h1 transition={{ duration: 3 }} initial={{ opacity: 0 }} animate={{ opacity: [0, 0.8, 1] }}>Welcome To My Chat App</motion.h1>
            <Link to='/login'><button>Log in</button></Link>
            <Link to='/signup'><button>Sign up</button></Link>
        </motion.div>
    )
}