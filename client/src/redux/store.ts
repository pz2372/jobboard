import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; 

import authReducer from "./authSlice";
import employerAuthReducer from "./employerAuthSlice";
import profileReducer from "./profileSlice";
import filterReducer from "./filterSlice"
import historyReducer from "./historySlice";
import searchReducer from "./searchSlice";
import subscriptionReducer from "./subscriptionSlice";

const persistConfig = {
  key: "root",
  storage,
};

const historyPersistConfig = {
  key: "history",
  storage,
};

// Remove employer auth persistence since we're using httpOnly cookies
// const employerPersistConfig = {
//   key: "employerAuth",
//   storage,
// };

const persistedAuthReducer = persistReducer(persistConfig, authReducer);
const persistedHistoryReducer = persistReducer(historyPersistConfig, historyReducer);
// const persistedEmployerAuthReducer = persistReducer(employerPersistConfig, employerAuthReducer);


export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    employerAuth: employerAuthReducer, // No persistence for employer auth
    profile: profileReducer,
    filter: filterReducer,
    history: persistedHistoryReducer, // Now persisted!
    search: searchReducer, // In-memory only - clears on refresh
    subscription: subscriptionReducer, // No persistence - uses httpOnly cookies and tokens
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const persistor = persistStore(store);
export default store;
