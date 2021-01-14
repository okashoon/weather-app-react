import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import searchSlice from '../features/search/searchSlice';

export const store = configureStore({
  reducer: {
    searchOptions: searchSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
