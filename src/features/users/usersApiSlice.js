import { createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

export const usersAdapter = createEntityAdapter()

const initialState = usersAdapter.getInitialState()

export const friendsAdapter = createEntityAdapter({
    sortComparer: (a,b) => b?.lastMessage?.createdAt?.localeCompare(a?.lastMessage?.createdAt)
})

const friendsInitialState = friendsAdapter.getInitialState()

export const usersApiSlice = apiSlice.injectEndpoints(
    {
        endpoints: builder => (
            {
                getUsers: builder.query(
                    {
                        query: () => 
                        ({
                            url: '/users',
                            validateStatus: (response, result) => 
                            {
                                return response.status === 200 && !result.isError
                            }
                        }),
                        transformResponse: (response) => 
                        {
                            //@ts-ignore
                            const loadedUsers = response.map(user => 
                                {
                                    user.id = user._id
                                    return user
                                })
                            return usersAdapter.setAll(initialState, loadedUsers)
                        },
                        //@ts-ignore
                        providesTags: (result, err, arg) => 
                        {
                            if(result?.ids)
                            {
                                return [
                                    ...result.ids.map(id => ({ type: 'User', id })),
                                    { type: 'User', id: 'LIST' }
                                ]
                            }
                            else return [{ type: 'User', id: 'LIST' }]
                        }
                    }),
                getFriends: builder.query(
                    {
                        query: ({ id }) => 
                        ({
                            url: `/users/friends/${id}`,
                            method: 'GET'
                        }),
                        transformResponse: (response) => 
                        {
                            //@ts-ignore
                            const loadedFriends = response.map(friend => 
                                {
                                    friend.id = friend._id
                                    return friend
                                })
                            return friendsAdapter.setAll(friendsInitialState, loadedFriends)
                        }
                    }),
                getMyImage: builder.query(
                    {
                        query: ({ id }) => 
                        ({
                            url: `/users/${id}/myimage`,
                            method: 'GET'
                        })
                    }),
                addUser: builder.mutation(
                    {
                        query: addedUser => 
                        ({
                            url: '/users',
                            method: 'POST',
                            body: { ...addedUser }
                        }),
                        invalidatesTags: [{ type: 'User', id: 'LIST' }]
                    }),
                addFriend: builder.mutation(
                    {
                        query: (addedFriend) => 
                        ({
                            url: '/users/friends',
                            method: 'POST',
                            body: { ...addedFriend }
                        }),
                        invalidatesTags: [{ type: 'User', id: 'LIST' }]
                    }),
                updateUser: builder.mutation(
                    {
                        query: updatedUser => 
                        ({
                            url: '/users',
                            method: 'PATCH',
                            body: { ...updatedUser }
                        }),
                        invalidatesTags: (result, err, arg) => [{ type: 'User', id: arg.id }]
                    }),
                deleteUser: builder.mutation(
                    {
                        query: ({ id }) => 
                        ({
                            url: '/users',
                            method: 'DELETE',
                            body: { id }
                        }),
                        invalidatesTags: (result, err, arg) => [{ type: 'User', id: arg.id }]
                    }),
            })
    })

export const 
{
    useGetUsersQuery,
    useGetFriendsQuery,
    useGetMyImageQuery,
    useAddUserMutation,
    useAddFriendMutation,
    useUpdateUserMutation,
    useDeleteUserMutation
} = usersApiSlice