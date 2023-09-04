import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGetMyImageQuery, useUpdateUserMutation } from '../users/usersApiSlice'
import { Avatar } from '@mui/material'
import useAuth from '../../hooks/useAuth'

const USER_REGEX = /^[A-z]{3,16}$/
const PWD_REGEX = /^[A-z0-9!@#$%]{4,16}$/

export default function Settings() 
{
    const { username: user, id } = useAuth()

    const userRef = useRef('')
    const errRef = useRef('')

    const [updateUser, 
        {
            isSuccess,
            isLoading,
            isError,
            error
        }] = useUpdateUserMutation()

    const { data: userImage, isLoading: imageLoadig} = useGetMyImageQuery({id}, { pollingInterval: 120000000, refetchOnFocus: true, refetchOnMountOrArgChange: true })

    const [image, setImage] = useState(userImage || '')
    const [username, setUsername] = useState(user)
    const [validUsername, setValidUsername] = useState(false)
    const [password, setPassword] = useState('')
    const [validPassword, setValidPassword] = useState(false)

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
        if(isSuccess)
        {
            setUsername('')
            setPassword('')
            navigate('/messages')
            window.location.reload()
        }
    }, [isSuccess, navigate])

    const onUsernameChanged = (e) => setUsername(e.target.value)
    const onPasswordChanged = (e) => setPassword(e.target.value)
    const onImageChanged = async (e) => {
        const file = e.target.files[0]
        const base64 = await convertToBase64(file)
        setImage(base64)
    }

    const canSave = password ? [validUsername, validPassword].every(Boolean) && !isLoading : [validUsername].every(Boolean) && !isLoading

    async function handleSubmit(e)
    {
        e.preventDefault()
        try
        {
            const updatedUser = password ? image ? { id, username, password, image } : { id, username, password } : image ? { id, username, image } : { id, username }
            await updateUser(updatedUser).unwrap()
            setUsername('')
            setPassword('')
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
    const err = isError && <p ref={errRef}>{error?.data?.message}</p>

    if(imageLoadig) return <p>Loading...</p>

    return (
        <div className='SettingsForm'>
        {err}
        <form onSubmit={handleSubmit}>
            <label className='imageLabel' htmlFor='image'><Avatar src={image} sx={{ width: 96, height: 96 }} /></label>
            <input
                type='file'
                id='image'
                onChange={onImageChanged}
                accept='.jpeg, .png, .jpg'
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
             />
             <button
                disabled={!canSave}
             >
                Save
             </button>
        </form>
        </div>
    )
}
