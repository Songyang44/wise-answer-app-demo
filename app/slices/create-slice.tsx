import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface UploadState{
    fileUrl:string | null,
    uploading:boolean,
    error:string|null

};

const initialState : UploadState={
    fileUrl:null,
    uploading:false,
    error:null
};

const uploadSlice=createSlice({
    name:'create',
    initialState,
    reducers:{
         // start upload file
         StartUpload(state){
            state.uploading = true;
            state.error = null;
        },
        // upload success
        UploadSuccess(state, action:PayloadAction<string>){
            state.uploading = false;
            state.fileUrl = action.payload;
        },
        // upload failure
        UploadFailure(state, action: PayloadAction<string>){
            state.uploading = false;
            state.error = action.payload;

        }
    }
});
export const {StartUpload,UploadSuccess,UploadFailure}=uploadSlice.actions;
export default uploadSlice.reducer;