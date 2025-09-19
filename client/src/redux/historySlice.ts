import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface HistoryState {
  appliedJobs: any[];
  savedJobs: any[];
}

const initialState: HistoryState = {
  appliedJobs: [],
  savedJobs: [],
};

const historySlice = createSlice({
  name: "history",
  initialState,
  reducers: {
    setAppliedJobs(state, action: PayloadAction<any[]>) {
      state.appliedJobs = action.payload;
    },
    setSavedJobs(state, action: PayloadAction<any[]>) {
      state.savedJobs = action.payload;
    },
  },
});

export const { setAppliedJobs, setSavedJobs } = historySlice.actions;
export default historySlice.reducer;
