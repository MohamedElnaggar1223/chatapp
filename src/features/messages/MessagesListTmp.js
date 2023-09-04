// import React, { memo, useEffect } from 'react'
// import useAuth from '../../hooks/useAuth'
// import { useGetUsersQuery } from '../users/usersApiSlice'
// import { selectDisplay, setDisplay, setChats, selectChats } from './displaySlice'
// import { useDispatch, useSelector } from 'react-redux'
// import Messages from './Messages'
// import { messagesApiSlice } from './messagesApiSlice'
// import { store } from '../../app/store'

// function MessagesList()
// {
//     const { id, username, friends } = useAuth()
//     const dispatch = useDispatch()
//     const chatsData = useSelector(selectChats)

//     // const 
//     // { 
//     //     data: chatsData,
//     //     isSuccess,
//     // } = useGetMessagesQuery(username, 
//     //     {
//     //         pollingInterval: 12000000,
//     //         refetchOnFocus: false,
//     //         refetchOnMountOrArgChange: false,
//     //         refetchOnReconnect: false
//     //     })
//     useEffect(() => 
//     {
//         async function getChatsData()
//         {
//             let data = await store.dispatch(messagesApiSlice.endpoints.getMessages.initiate({ username }, { forceRefetch: false })).unwrap().then((chats) => ({ids: chats.ids, entities: chats.entities}))
//             dispatch(setChats(data))
//             return data
//         }
//         getChatsData()
//     }, [username, dispatch])

//     // const { id } = useGetUsersQuery('usersList', 
//     // {
//     //     selectFromResult: ({ data }) => ({
//     //         id: data?.ids.find(id => data?.entities[id].username === username)
//     //     })
//     // })
//     console.log(chatsData)

//     const chatDisplayed = useSelector(selectDisplay)

//     const { friendsArray } = useGetUsersQuery('usersList', 
//     {
//         selectFromResult: ({ data }) => ({
//             friendsArray: data?.ids.map(id => 
//                 {
//                     if(friends.includes(id)) return { username: data?.entities[id].username, id }
//                     else return null
//                 })
//         })
//     })

//     const friendsUsernames = Array.isArray(friendsArray) && friendsArray.filter(field => field != null)

//     let chats
//     if(chatsData)
//     {
//         if(!Array.isArray(friendsUsernames) || !friendsUsernames.length) chats = <p>No Chats Yet</p>
//         else
//         {
//             chats = friendsUsernames.map(friend => <button onClick={() => dispatch(setDisplay(friend))} key={friend.id}> {friend.username} </button>)
//         }
    

//         return(
//             <div className='MessagesApp'>
//                 <div className='friendsButtons'>
//                     {chats}
//                 </div>
//                 {/*//@ts-ignore*/}
//                 {chatDisplayed && <Messages chatsData={chatsData} key={chatDisplayed} userId={id} username={username} friendId={chatDisplayed} />}
//             </div>
//         ) 
//     }
//     else return <p>Loading...</p>
// }

// const memoizedMessagesList = memo(MessagesList)
// export default memoizedMessagesList