import { createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit";

interface ProfileSlice {
    inputValues: Record<string, string>; 
}

const initialState: ProfileSlice = {
    inputValues: {}
}

const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        addInputValue(state, action: PayloadAction<{ key: string; value: string }>) {
            const { key, value } = action.payload;
            state.inputValues[key] = value; 
        }
    }
})

export const { addInputValue } = profileSlice.actions;

export default profileSlice.reducer;
