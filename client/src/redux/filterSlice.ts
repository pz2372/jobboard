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
  name: "filter",
  initialState,
  reducers: {
    updateJobType: (state, action: PayloadAction<string>) => {
      const type = action.payload;
      if (state.filters.jobType.includes(type)) {
        state.filters.jobType = state.filters.jobType.filter((t) => t !== type);
      } else {
        state.filters.jobType.push(type);
      }
    },
    updateMinWage: (state, action: PayloadAction<string>) => {
      state.filters.minWage = action.payload;
    },
    updateMaxWage: (state, action: PayloadAction<string>) => {
      state.filters.maxWage = action.payload;
    },
    updateLocation: (state, action: PayloadAction<string>) => {
      const location = action.payload;
      if (state.filters.location.includes(location)) {
        state.filters.location = state.filters.location.filter((l) => l !== location);
      } else {
        state.filters.location.push(location);
      }
    },
    updateExperience: (state, action: PayloadAction<string>) => {
      const experience = action.payload;
      if (state.filters.experience.includes(experience)) {
        state.filters.experience = state.filters.experience.filter((e) => e !== experience);
      } else {
        state.filters.experience.push(experience);
      }
    },
    clearAllFilters: (state) => {
      state.filters = {
        jobType: [],
        minWage: "",
        maxWage: "",
        location: [],
        experience: [],
      };
    },
    toggleFilterOpen: (state) => {
      state.isFilterOpen = !state.isFilterOpen;
    },
  },
});

export const { 
  updateJobType, 
  updateMinWage, 
  updateMaxWage, 
  updateLocation, 
  updateExperience,
  clearAllFilters,
  toggleFilterOpen
} = filterSlice.actions;

export default filterSlice.reducer;
