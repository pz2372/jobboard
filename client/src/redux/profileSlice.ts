import { createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit";

interface ProfileSlice {
    inputValues: Record<string, string>; 
    userProfile: any;
}

const initialState: ProfileSlice = {
    inputValues: {},
    userProfile: null,
}

const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        addInputValue(state, action: PayloadAction<{ key: string; value: string }>) {
            const { key, value } = action.payload;
            state.inputValues[key] = value; 
        },
        setUserProfile(state, action: PayloadAction<any>) {
            state.userProfile = action.payload;
        },
    },
})

export const { addInputValue, setUserProfile } = profileSlice.actions;

export default profileSlice.reducer;
