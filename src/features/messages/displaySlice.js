import { createSlice } from "@reduxjs/toolkit";

export const displaySlice = createSlice(
    {
        name: 'display',
        initialState: { display: null, typing: false},
        reducers:
        {
            setDisplay: (state, action) => 
            {
                const { id } = action.payload
                state.display = id
            },
            setTyping: (state, action) => 
            {
                state.typing = action.payload.typing
            }
        }
    })

export const { setDisplay, setTyping } = displaySlice.actions

export default displaySlice.reducer

export const selectDisplay = (state) => state.display.display

export const selectTyping = (state) => state.display.typing