import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import API from '../../api/API';
import 'react-toastify/dist/ReactToastify.css';
import { App } from 'antd';

export const signInUser = createAsyncThunk(
    'user/signIn',
    async function (user, {rejectWithValue, dispatch}) {
        try {
            let response = await fetch(API.SIGN_IN, {
                method: 'post',
                body: JSON.stringify(user)
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

            dispatch(setUser(response.data));
            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const initialState = {
    id: null,
    login: null,
    firstName: null,
    secondName: null,
    avatar: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState: initialState,
    reducers: {
        setUser(state, action) {
            state.id = action.payload.id;
            state.login = action.payload.login;
            state.firstName = action.payload.firstName;
            state.secondName = action.payload.secondName;
            state.avatar = action.payload.avatar;


            localStorage.setItem('KnowledgeBase-userId', action.payload.id);
            localStorage.setItem('KnowledgeBase-login', action.payload.login);
            localStorage.setItem('KnowledgeBase-firstName', action.payload.firstName);
            localStorage.setItem('KnowledgeBase-secondName', action.payload.secondName);
            localStorage.setItem('KnowledgeBase-avatar', action.payload.avatar);
        },
        removeUser(state) {
            state.id = null;
            state.login = null;
            state.firstName = null;
            state.secondName = null;
            state.avatar = null;

            localStorage.removeItem('KnowledgeBase-userId');
            localStorage.removeItem('KnowledgeBase-login');
            localStorage.removeItem('KnowledgeBase-firstName');
            localStorage.removeItem('KnowledgeBase-secondName');
            localStorage.removeItem('KnowledgeBase-avatar');
        },
    },
    extraReducers: {
        [signInUser.pending]: (state, action) => {
            // const { message } = App.useApp();
            // message.loading({content: "Вхожу в аккаунт...", key: 'signIn'})
        },
        [signInUser.fulfilled]: (state, action) => {
            // const { message } = App.useApp();
            // message.destroy('signIn')
            // message.success({content: "Вы успешно авторизовались"})
        },
        [signInUser.rejected]: (state, action) => {
            // const { message } = App.useApp();
            // message.destroy('signIn')
            // message.error({content: "Неправильный логин или пароль"})
        },
    },
});

export const {setUser, removeUser} = userSlice.actions;

export default userSlice.reducer;
