import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface WorkSpaceState {
  salary: string | null;
  jobDescription: string | null;
  companyDescription: string | null;
  level: string | null;
  fileName: string;
  fileUrl: string;
  uploading: boolean;
  error: string | null;
}

const initialState: WorkSpaceState = {
  salary: "",
  companyDescription: "",
  jobDescription: "",
  level: null,
  fileName: "",
  fileUrl: "",
  uploading: false,
  error: null,
};

const workSpaceSlice = createSlice({
  name: "workspace",
  initialState,
  reducers: {
    SetField: <K extends keyof WorkSpaceState>(
      state: WorkSpaceState,
      action: PayloadAction<{ key: K; value: WorkSpaceState[K] }>
    ) => {
      state[action.payload.key] = action.payload.value;
    },
    SetFileName: (state, action: PayloadAction<string>) => {
      state.fileName = action.payload;
    },
    StartUpload: (state) => {
      state.uploading = true;
      state.error = null;
    },
    UploadSuccess: (state, action: PayloadAction<string>) => {
      state.uploading = false;
      state.fileUrl = action.payload;
    },
    UploadFailure: (state, action: PayloadAction<string>) => {
      state.uploading = false;
      state.error = action.payload;
    },
    ResetForm: () => initialState,
  },
});

export const {
  SetField,
  SetFileName,
  StartUpload,
  UploadSuccess,
  UploadFailure,
  ResetForm,
} = workSpaceSlice.actions;

export default workSpaceSlice.reducer;
