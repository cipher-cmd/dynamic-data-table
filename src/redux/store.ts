import { configureStore } from '@reduxjs/toolkit';
import { tableReducer } from './tableSlice';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore, Persistor } from 'redux-persist';

// Configuring redux-persist for the 'table' slice
const persistConfig = {
  key: 'table',
  storage,
};

const persistedReducer = persistReducer(persistConfig, tableReducer);

// Setting up the Redux store with persisted reducer
export const store = configureStore({
  reducer: {
    table: persistedReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // This allows non-serializable actions (redux-persist)
    }),
});

// RootState inferred from the store
export type RootState = ReturnType<typeof store.getState>;
// AppDispatch type inferred from store.dispatch
export type AppDispatch = typeof store.dispatch;
// Persistor is explicitly typed as Persistor for clarity
export const persistor: Persistor = persistStore(store);
