import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import API from "../../api/API";

export const getNetworkNotesTree = createAsyncThunk(
    'networkNotes/tree/get',
    async function (_, {rejectWithValue, dispatch}) {
        try {
            let response = await fetch(API.GET_NETWORK_NOTES_TREE, {
                method: 'get'
            });

            if (!response.ok) {
                // alert("Username or password is incorrect");
                throw new Error(
                    `${response.status}${
                        response.statusText ? ' ' + response.statusText : ''
                    }`
                );
            }

            response = await response.json();

            dispatch(setDirectories(response.data));
            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const getNetworkNote = createAsyncThunk(
    'networkNote/get',
    async function (id, {rejectWithValue, dispatch}) {
        try {
            let response = await fetch(API.GET_NETWORK_NOTE+"?id="+id, {
                method: 'get'
            });

            if (!response.ok) {
                // alert("Username or password is incorrect");
                throw new Error(
                    `${response.status}${
                        response.statusText ? ' ' + response.statusText : ''
                    }`
                );
            }

            response = await response.json();

            dispatch(setNetworkNote(response.data));
            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const initialState = {
    directories: null,
    note: null,
    isLoading: true,
    isLoadingNote: true
};

const networkNotesSlice = createSlice({
    name: 'networkNotes',
    initialState: initialState,
    reducers: {
        setDirectories(state, action) {
            state.directories = action.payload
            state.isLoading = false
        },
        setNetworkNote(state, action) {
            state.note = action.payload
            state.isLoadingNote = false
        },
        removeDirectories(state) {
            state.directories = null
            state.isLoading = true
        }
    },
    extraReducers: {

    },
});

export const {setDirectories, setNetworkNote, removeDirectories} = networkNotesSlice.actions;

export default networkNotesSlice.reducer;
