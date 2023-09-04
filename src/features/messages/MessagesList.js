import React, { memo } from 'react'
import useAuth from '../../hooks/useAuth'
import { selectDisplay } from './displaySlice'
import { useSelector } from 'react-redux'
import Messages from './Messages'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import FriendsButtons from './FriendsButtons'

function MessagesList({ friendsArray, chatsData })
{
    const { id, username } = useAuth()

    const navigate = useNavigate()

    const chatDisplayed = useSelector(selectDisplay)

    const [animationParent] = useAutoAnimate()

    const { ids, entities } = friendsArray
    const friendsUsernames = ids?.map(id => entities[id]) || []

    const friendsButtons = <FriendsButtons userId={id} friendsUsernames={friendsUsernames} />

    const addFriendsButton = (
        <button onClick={() => navigate('/addfriends')} style={{ textAlign: 'center', justifyContent: 'center', alignItems: 'center', width: '100%' }}><div className='addFriendsButton'><FontAwesomeIcon icon={faPlus} color='#00b7c2' /> Add New Friend </div></button>
    )

    return(
        <div className='MessagesApp'>
            <div ref={animationParent} className='friendsButtons'>
                {friendsButtons}
                {addFriendsButton}
            </div>
            {chatDisplayed && <Messages chatsData={chatsData} key={chatDisplayed} userId={id} username={username} friendId={chatDisplayed} />}
        </div>
    )

}

const memoizedMessagesList = memo(MessagesList)
export default memoizedMessagesList