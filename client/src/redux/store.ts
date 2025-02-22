import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; 

import authReducer from "./authSlice";
import employerAuthReducer from "./employerAuthSlice";
import profileReducer from "./profileSlice";
import filterReducer from "./filterSlice"

const persistConfig = {
  key: "root",
  storage,
};

const employerPersistConfig = {
  key: "employerAuth",
  storage,
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);
const persistedEmployerAuthReducer = persistReducer(employerPersistConfig, employerAuthReducer);


export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    employerAuth: persistedEmployerAuthReducer,
    profile: profileReducer,
    filter: filterReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Required for redux-persist
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const persistor = persistStore(store);
export default store;
