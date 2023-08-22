import {configureStore} from '@reduxjs/toolkit';
import recognitionsReducer from "./slices/recognitionsSlice";


export default configureStore({
  reducer: {
    recognitions: recognitionsReducer,
  },
});
