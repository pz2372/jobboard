import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Filters {
  jobType: string[];
  minWage: string;
  maxWage: string;
  location: string[];
  experience: string[];
}

interface FilterSlice {
  filters: Filters;
  isFilterOpen: boolean;
}

const initialState: FilterSlice = {
  filters: {
    jobType: [],
    minWage: "",
    maxWage: "",
    location: [],
    experience: [],
  },
  isFilterOpen: false,
};

const filterSlice = createSlice({
  name: "job-modal",
  initialState,
  reducers: {
    updateJobType: (state, action: PayloadAction<string>) => {
      const type = action.payload;
      if (state.filters.jobType.includes(type)) {
        // Remove type if it exists
        state.filters.jobType = state.filters.jobType.filter((t) => t !== type);
      } else {
        // Add type if it doesn't exist
        state.filters.jobType.push(type);
      }
    },
  },
});

export const { updateJobType } = filterSlice.actions;

export default filterSlice.reducer;
