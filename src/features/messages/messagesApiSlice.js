import { createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

export const messagesAdapter = createEntityAdapter({
    sortComparer: (a,b) => a.createdAt.localeCompare(b.createdAt)
})

const initialState = messagesAdapter.getInitialState()

export const messagesApiSlice = apiSlice.injectEndpoints(
    {
        endpoints: builder => (
            {
                getMessages: builder.query(
                    {
                        query: (username) => 
                        ({
                            url: '/messages',
                            validateStatus: (response, result) => 
                            {
                                return response.status === 200 && !result.isError
                            }
                        }),
                        transformResponse: (response, meta, arg) => 
                        {
                            //@ts-ignore
                            const loadedMessages = response.map(message => 
                                {
                                    message.id = message._id
                                    return message
                                })
                            const messages = loadedMessages.filter(message => message.senderUsername === arg.username || message.receiverUsername === arg.username)
                            return messagesAdapter.setAll(initialState, messages)
                        },
                        //@ts-ignore
                        providesTags: (result, err, arg) => 
                        {
                            if(result?.ids)
                            {
                                return [
                                    ...result.ids.map(id => ({ type: 'Message', id })),
                                    { type: 'Message', id: 'LIST' }
                                ]
                            }
                            else return [{ type: 'Message', id: 'LIST' }]
                        }
                    }),
                addMessage: builder.mutation(
                    {
                        query: addedMessage => 
                        ({
                            url: '/messages',
                            method: 'POST',
                            body: { ...addedMessage }
                        }),
                        invalidatesTags: [{ type: 'Message', id: 'LIST' }]
                    }),
                deleteMessage: builder.mutation(
                    {
                        query: ({ id }) => 
                        ({
                            url: '/messages',
                            method: 'DELETE',
                            body: { id }
                        }),
                        invalidatesTags: (result, err, arg) => [{ type: 'Message', id: arg.id }]
                    }),
            })
    })

// //@ts-ignore
// export const selectMessagesResult = messagesApiSlice.endpoints.getMessages.select()

// // creates memoized selector
// const selectMessagesData = createSelector(
//     selectMessagesResult,
//     messagesResult => messagesResult.data // normalized state object with ids & entities
// )

// //getSelectors creates these selectors and we rename them with aliases using destructuring
// export const {
//     selectAll: selectAllMessages,
//     selectById: selectMessageById,
//     selectIds: selectMessageIds
//     // Pass in a selector that returns the messages slice of state
// } = messagesAdapter.getSelectors(state => selectMessagesData(state) ?? initialState)

export const 
{
    useGetMessagesQuery,
    useAddMessageMutation,
    useDeleteMessageMutation
} = messagesApiSlice