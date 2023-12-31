import { apiSlice } from "../../app/api/apiSlice";
import { logout, setCredentials } from './authSlice'

export const authApiSlice = apiSlice.injectEndpoints(
    {
        endpoints: builder => (
            {
                login: builder.mutation(
                    {
                        query: (credentials) => 
                        ({
                            url: '/auth',
                            method: 'POST',
                            body: { ...credentials }
                        })
                    }),
                sendLogout: builder.mutation(
                    {
                        query: () => 
                        ({
                            url: '/auth/logout',
                            method: 'POST'
                        }),
                        async onQueryStarted(arg, { dispatch, queryFulfilled })
                        {
                            try
                            {
                                await queryFulfilled
                                //@ts-ignore
                                dispatch(logout())
                                setTimeout(() => 
                                { 
                                    dispatch(apiSlice.util.resetApiState()) 
                                }, 1000)
                            }
                            catch(e)
                            {
                                console.log(e)
                            }
                        }
                    }),
                refresh: builder.mutation(
                    {
                        query: () => 
                        ({
                            url: '/auth/refresh',
                            method: 'GET'
                        }),
                        async onQueryStarted(arg, { dispatch, queryFulfilled })
                        {
                            try
                            {
                                const { data } = await queryFulfilled
                                const { accessToken } = data
                                dispatch(setCredentials({ accessToken }))
                            }
                            catch(e)
                            {
                                console.error(e)
                            }
                        }
                    })
            })
    })

export const
{
    useLoginMutation,
    useSendLogoutMutation,
    useRefreshMutation
} = authApiSlice