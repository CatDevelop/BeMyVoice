import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import API from '../../api/API';

export const getServicesSubtitle = createAsyncThunk(
    'recognitions/get',
    async function (_, {rejectWithValue, dispatch}) {
        try {
            let response = await fetch(API.GET_SERVICE_SUBTITLE, {
                method: 'get'
            });

            if (!response.ok) {
                throw new Error(
                    `${response.status}${
                        response.statusText ? ' ' + response.statusText : ''
                    }`
                );
            }
            response = await response.text();

            dispatch(addRecognition(JSON.parse(response)));
            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const initialState = {
    recognitions: [],
};

const recognitionsSlice = createSlice({
    name: 'recognitions',
    initialState: initialState,
    reducers: {
        setRecognitions(state, action) {
            state.recognitions = action.payload;
        },
        addRecognition(state, action) {
            console.log(action.payload)

            console.log(state.recognitions)

            if(action.payload.Text !== '')
            {
                if(state.recognitions.length === 0)
                    state.recognitions = [{
                        text: action.payload.Text,
                        emotion: action.payload.Emotion
                    }]
                else if(state.recognitions[state.recognitions.length - 1].Text !== action.payload.Text) {
                    state.recognitions = [...state.recognitions, {
                        text: action.payload.Text,
                        emotion: action.payload.Emotion
                    }]
                }
            }
        },
        removeRecognitions(state) {
            state.recognitions = [];
        },
    },
    extraReducers: {

    },
});

export const {setRecognitions, addRecognition, removeRecognitions} = recognitionsSlice.actions;

export default recognitionsSlice.reducer;
