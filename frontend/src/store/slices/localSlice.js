import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';

const initialState = {
    theme: 'dark',
    selection: {
        selectMode: '',
        selectType: '',
        selectElementPath: '',
        selectElementFolderPath: '',
        selectElementFolderKey: '',
    },
    filesFolderDir: '',
    filesDir: '',
    selectFolderPath: '',
    selectFolderKey: '0',
    selectFilePath: '',
    selectElement: '',
    directories: [],
    isConnectToServer: false
};

const localSlice = createSlice({
    name: 'local',
    initialState: initialState,
    reducers: {
        setTheme(state) {
            if(state.theme === "dark")
                state.theme = 'light'
            else
                state.theme = 'dark'
        },
        setDirectories(state, action) {
            state.directories = action.payload
        },
        setSelection(state, action) {
            state.selection = action.payload
        },
        setFilesDir(state, action) {
            state.filesDir = action.payload
        },
        setFilesFolderDir(state, action) {
            state.filesFolderDir = action.payload
        },
        setSelectFolderKey(state, action) {
            state.selectFolderKey = action.payload
        },
        setSelectElement(state, action) {
            state.selectElement = action.payload
        },
        setSelectFolderPath(state, action) {
            console.log("setSelectFolderPath", action)
            state.selectFolderPath = action.payload
        },
        setSelectFilePath(state, action) {
            state.selectFilePath = action.payload
        },
        setConnectToServer(state, action) {
            state.isConnectToServer = action.payload.isConnectToServer
        }
    },
    extraReducers: {

    },
});

export const {setFilesFolderDir, setSelection, setConnectToServer, setFilesDir, setSelectElement, setSelectFolderKey, setTheme, setDirectories, setSelectFolderPath, setSelectFilePath} = localSlice.actions;

export default localSlice.reducer;
