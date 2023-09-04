import React, { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { useLoginMutation } from './authApiSlice'
import { useAddUserMutation } from '../users/usersApiSlice'
import { setCredentials } from './authSlice'
import profilePic from '../../imgs/profile.png'
import { Avatar } from '@mui/material'
import { motion } from 'framer-motion'

const USER_REGEX = /^[A-z]{3,16}$/
const PWD_REGEX = /^[A-z0-9!@#$%]{4,16}$/
const EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

export default function SignUp() 
{
    const userRef = useRef('')
    const errRef = useRef('')

    const [register, 
        {
            isLoading,
            isSuccess,
            isError,
            error
        }] = useAddUserMutation()

    const [login, 
        {
            isLoading: isLoadingLogin,
            isSuccess: isSuccessLogin,
            isError: isErrorLogin,
            error: errorLogin
        }] = useLoginMutation()

    const [image, setImage] = useState('')
    const [username, setUsername] = useState('')
    const [validUsername, setValidUsername] = useState(false)
    const [password, setPassword] = useState('')
    const [validPassword, setValidPassword] = useState(false)
    const [email, setEmail] = useState('')
    const [validEmail, setValidEmail] = useState(false)

    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => 
    {
        setValidUsername(USER_REGEX.test(username))
    }, [username])

    useEffect(() => 
    {
        setValidPassword(PWD_REGEX.test(password))
    }, [password])

    useEffect(() => 
    {
        setValidEmail(EMAIL_REGEX.test(email))
    }, [email])

    useEffect(() => 
    {
        if(isSuccess && isSuccessLogin)
        {
            setUsername('')
            setPassword('')
            setEmail('')
            navigate('/messages')
            window.location.reload()
        }
    }, [isSuccess, isSuccessLogin, navigate])

    const onUsernameChanged = (e) => setUsername(e.target.value)
    const onPasswordChanged = (e) => setPassword(e.target.value)
    const onEmailChanged = (e) => setEmail(e.target.value)
    const onImageChanged = async (e) => {
        const file = e.target.files[0]
        const base64 = await convertToBase64(file)
        setImage(base64)
    }

    const canSave = [validUsername, validPassword, validEmail].every(Boolean) && !isLoading && !isLoadingLogin

    async function handleSubmit(e)
    {
        e.preventDefault()
        try
        {
            image ? await register({ image, username, email, password }).unwrap() : await register({ username, email, password }).unwrap()
            const { accessToken } = await login({ username, password }).unwrap()
            dispatch(setCredentials({ accessToken }))
            setUsername('')
            setPassword('')
            setEmail('')
        }
        catch(e)
        {
            console.error(e)
        }
    }

    async function convertToBase64(file)
    {
        return new Promise((resolve, reject) => 
        {
            const fileReader = new FileReader()
            fileReader.readAsDataURL(file)
            fileReader.onload = () => 
            {
                resolve(fileReader.result)
            }
            fileReader.onerror = (error) => 
            {
                reject(error)
            }
        })
    }

    //@ts-ignore
    const err = isError ? <p ref={errRef}>{error?.data?.message}</p> : isErrorLogin ? <p ref={errRef}>{errorLogin?.data?.message}</p> : null

    return (
        <motion.div className='SignupForm'>
        {err}
        <motion.form 
            onSubmit={handleSubmit}
            initial={{ x: '100vw' }}
            animate={{ x: 0 }}
            transition={{ duration: 0.4, delay: 0, type: 'tween', ease: 'easeInOut' }}
            exit={{ x: '-100vw' }}
        >
            <label className='imageLabel' htmlFor='image'><Avatar src={image || profilePic} alt='Profile' sx={{ width: 96, height: 96 }} /></label>
            <input
                type='file'
                id='image'
                onChange={onImageChanged}
                accept='.jpeg, .png, .jpg'
             />

            <label htmlFor='email'>Email:</label>
            <input
                type='email'
                id='email'
                value={email}
                onChange={onEmailChanged}
                autoComplete="off"
                required
             />

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
                Sign up
             </button>
             <div className='signup'>
                <p>Already a User ? <Link to='/login'>Log in</Link></p>
             </div>
        </motion.form>
        </motion.div>
    )
}
