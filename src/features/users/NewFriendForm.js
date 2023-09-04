import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { motion } from 'framer-motion'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { useAddFriendMutation } from './usersApiSlice'
import useAuth from '../../hooks/useAuth'
import { Avatar } from '@mui/material'

export default function NewFriendForm({ users }) 
{
    const [animationParent] = useAutoAnimate()
    const { id } = useAuth()

    const navigate = useNavigate()

    const [addFriend, 
        {
            isLoading,
            isSuccess,
            isError,
            error
        }] = useAddFriendMutation()

    const [username, setUsername] = useState('')
    const [matchingUsers, setMatchingUsers] = useState([
        {
            id: '',
            username: '',
            added: false
        }])

    const usersNames = users.map(user => ({username: user.username, id: user.id}))

    const onUsernameChanged = (e) => {
        setUsername(e.target.value)
    }

    useEffect(() => 
    {
        const addedUsers = matchingUsers.filter(user => user.added === true)

        const array = usersNames.map(user => 
            {
                if(Matching(user.username, username)) return {id: user.id, username: user.username, added: false}
                else return null
            })
        
        const filteredArray = array.filter(elem => elem !== null)

        const finalArray = canAdd(filteredArray, addedUsers)

        username ? setMatchingUsers(finalArray) : addedUsers.length ? setMatchingUsers(addedUsers) : setMatchingUsers([])
        //eslint-disable-next-line
    }, [username])

    function canAdd(filteredArray, addedUsers)
    {
        const finalArray = []
        filteredArray.forEach(filtered =>
            {
                let flag = false
                addedUsers.forEach(added => 
                {
                    if(filtered.username === added.username) flag = true
                })
                if(!flag) finalArray.push(filtered)
            })
        return [...addedUsers, ...finalArray]
    }

    function Matching(user, username)
    {
        for(let i = 0; i < username.length; i++)
        {
            if(username[i].toLowerCase() !== user[i].toLowerCase()) return false
        }
        return true
    }

    function onButtonClicked(username)
    {
        setMatchingUsers(prev => 
            {
                const filteredUser = prev.filter(user => user.username === username)[0]
                const filteredArray = prev.filter(user => user.username !== username)
                const newUser = { ...filteredUser, added: !filteredUser.added }
                return [newUser, ...filteredArray]
            })
    }

    const options = matchingUsers.map(user => 
        {
            return (
                !user.added 
                ? <button key={user.username} style={{ textAlign: 'center' }} onClick={() => onButtonClicked(user.username)}><Avatar></Avatar><div className='Name'>{user.username} <FontAwesomeIcon icon={faPlus} color='#00b7c2' /></div></button>
                : <motion.button style={{ textAlign: 'center', background: '#008ec2', fontWeight: '700' }} key={user.username} onClick={() => onButtonClicked(user.username)} ><Avatar></Avatar><div className='Name'>{user.username} <FontAwesomeIcon icon={faPlus} color='#00b7c2' /></div></motion.button>
            )
        })

    async function onSubmitClicked(e)
    {
        e.preventDefault()
        try
        {
            await Promise.all(matchingUsers.map(async (user) => 
            {
                if(user.added) await addFriend({ id, friendId: user.id })
            }))
            setUsername('')
        }
        catch(e)
        {
            console.error(e)
        }
    }

    const canSave = username && username?.length && !isLoading

    return(
        <div className='FindFriend'>
            {/*@ts-ignore */}
            {isError && <p>{error?.data?.message}</p>}
            <form onSubmit={onSubmitClicked}>
                <input
                    type='text'
                    value={username}
                    onChange={onUsernameChanged}
                    required
                    placeholder='Username. . .'
                />
                <button
                    disabled={!canSave || isSuccess}
                >
                    {isSuccess ? 'Added!' : 'Add'}
                </button>
            </form>
            <motion.div ref={animationParent} className='friendsButtons'>
                {!isSuccess && options}
                {isSuccess && <button onClick={() => {
                    navigate('/messages')
                    window.location.reload()
                }}><div style={{ textAlign: 'center' }} className='addFriendsButton'>Go Back To Messaging!</div></button>}
            </motion.div>
        </div>
    )
}
