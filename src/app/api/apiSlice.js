import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { setCredentials } from '../../features/auth/authSlice'

const baseQuery = fetchBaseQuery(
    {
        baseUrl: 'https://chatapp-najajer-api.onrender.com',
        credentials: 'include',
        prepareHeaders: (headers, { getState }) => 
        {
            //@ts-ignore
            const token = getState().auth.token
            
            if(token) headers.set('authorization', `Bearer ${token}`)

            return headers
        }
    })

const baseQueryWithReauth = async (args, api, extraOptions) => 
{
    let result = await baseQuery(args, api, extraOptions)

    if(result?.error?.status === 403)
    {
        const refresh = await baseQuery('/auth/refresh', api, extraOptions)
        if(refresh?.data)
        {
            api.dispatch(setCredentials({ ...refresh.data }))
            result = await baseQuery(args, api, extraOptions)
        }
        else
        {
            if(refresh?.error?.status === 403)
            {
                //@ts-ignore
                refresh.error.data.message = 'Your Log In Has Expired'
            }
            return refresh
        }
    }

    return result
}

export const apiSlice = createApi(
    {
        baseQuery: baseQueryWithReauth,
        tagTypes: ['User', 'Message'],
        endpoints: (builder) => ({})
    })