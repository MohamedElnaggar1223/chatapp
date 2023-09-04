import React, { useState, useEffect, useRef } from 'react'
import { useLoginMutation } from './authApiSlice'
import { setCredentials } from './authSlice'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const USER_REGEX = /^[A-z]{3,16}$/
const PWD_REGEX = /^[A-z0-9!@#$%]{4,16}$/

export default function Login()
{
    const userRef = useRef('')
    const errRef = useRef('')

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [login, 
        {
            isLoading,
            isSuccess,
            isError,
            error
        }] = useLoginMutation()

    const [username, setUsername] = useState('')
    const [validUsername, setValidUsername] = useState(false)
    const [password, setPassword] = useState('')
    const [validPassword, setValidPassword] = useState(false)

    useEffect(() => 
    {
        
        setTimeout(() => {
            //@ts-ignore
            userRef.current.focus()
        }, 1000);
    }, [])

    useEffect(() => 
    {
        setValidUsername(USER_REGEX.test(username))
    }, [username])

    useEffect(() => 
    {
        setValidPassword(PWD_REGEX.test(password))
    }, [password])

    const canSave = [validUsername, validPassword].every(Boolean) && !isLoading

    //@ts-ignore
    const err = isError && <p ref={errRef}>{error?.data?.message}</p>

    useEffect(() => 
    {
        if(isSuccess)
        {
            navigate('/messages')
        }
    }, [isSuccess, navigate])

    const onUsernameChanged = (e) => setUsername(e.target.value)
    const onPasswordChanged = (e) => setPassword(e.target.value)

    async function handleSubmit(e)
    {
        e.preventDefault()
        try
        {
            const { accessToken } = await login({ username, password }).unwrap()
            dispatch(setCredentials({ accessToken }))
            setUsername('')
            setPassword('')
        }
        catch(e)
        {
            console.error(e)
        }
    }

    return(
        <motion.div className='LoginForm'>
        {err}
        <motion.form 
            onSubmit={handleSubmit}
            initial={{ x: '100vw' }}
            animate={{ x: 0 }}
            transition={{ duration: 0.4, delay: 0, type: 'tween', ease: 'easeInOut' }}
            exit={{ x: '-100vw' }}
        >
            <label htmlFor='username'>Username:</label>
            <input
                type='text'
                id='username'
                value={username}
                onChange={onUsernameChanged}
                //@ts-ignore
                ref={userRef}
                autoComplete="off"
                required
             />

            <label htmlFor='password'>Password:</label>
            <input
                type='password'
                id='password'
                value={password}
                onChange={onPasswordChanged}
                //@ts-ignore
                autoComplete="off"
                required
             />
             <button
                disabled={!canSave}
             >
                Login
             </button>
             <div className='signup'>
                <p>New User ? <Link to='/signup'>Sign up</Link></p>
             </div>
        </motion.form>
        </motion.div>
    )
        
}