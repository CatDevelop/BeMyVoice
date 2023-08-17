import { configureStore } from '@reduxjs/toolkit';
import localReducer from './slices/localSlice';
import notesReducer from './slices/noteSlice';
import userReducer from './slices/userSlice';
import networkNotesReducer from './slices/networkNotesSlice';


export default configureStore({
  reducer: {
    user: userReducer,
    local: localReducer,
    localNotes: notesReducer,
    networkNotes: networkNotesReducer,
  },
});
