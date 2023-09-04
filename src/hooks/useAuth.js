import { selectCurrentToken } from '../features/auth/authSlice'
import jwtDecode from 'jwt-decode'
import { useSelector } from 'react-redux'

export default function useAuth() 
{
    const token = useSelector(selectCurrentToken)

    if(token)
    {
        const decoded = jwtDecode(token)
        //@ts-ignore
        const { id, username, email, friends, active } = decoded.UserInfo

        return { id, username, email, friends, active }
    }

    return { id: '', username: '', email: '', friends: [], active: false }
}
