import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';

const initialState = {
    noteBlocks: null,
    isLoading: true
};

const localNotesSlice = createSlice({
    name: 'localNotes',
    initialState: initialState,
    reducers: {
        setLocalNotes(state, action) {
            state.noteBlocks = action.payload
            state.isLoading = false
        }
    },
    extraReducers: {

    },
});

export const {setLocalNotes} = localNotesSlice.actions;

export default localNotesSlice.reducer;
