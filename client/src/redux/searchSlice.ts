import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SearchState {
  searchQuery: string;
  searchLocation: string;
  industry: string;
  minWage: string;
  maxWage: string;
  type: string;
  jobs: any[] | null;
  noSearchResults: boolean;
}

const initialState: SearchState = {
  searchQuery: "",
  searchLocation: "",
  industry: "",
  minWage: "",
  maxWage: "",
  type: "",
  jobs: null,
  noSearchResults: true,
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setSearchParams(state, action: PayloadAction<Partial<SearchState>>) {
      return { ...state, ...action.payload };
    },
    setJobs(state, action: PayloadAction<any[]>) {
      state.jobs = action.payload;
      state.noSearchResults = action.payload.length === 0;
    },
    clearSearch(state) {
      return initialState;
    },
    clearJobs(state) {
      state.jobs = null;
      state.noSearchResults = true;
    },
  },
});

export const { setSearchParams, setJobs, clearSearch, clearJobs } = searchSlice.actions;
export default searchSlice.reducer;
