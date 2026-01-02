import {
  getClassroomDetail,
  getUserClassrooms,
} from "@/api/classrooms.service";
import { ClassroomDetailRecord } from "@/@types/classroom.type";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "sonner";

type InitState = {
  isLoading: boolean;
  isLoadingDetail: boolean;
  myClassrooms: ClassroomDetailRecord[];
  enrolledClassrooms: ClassroomDetailRecord[];
  classroomDetail?: ClassroomDetailRecord;
};
const initialState: InitState = {
  myClassrooms: [],
  enrolledClassrooms: [],
  isLoading: false,
  isLoadingDetail: false,
};
export const fetchMyClassroom = createAsyncThunk(
  "classroom/fetchMyClassroom",
  async () => {
    try {
      const response = await getUserClassrooms();
      return response;
    } catch (err) {
      toast.error(err?.toString());
    }
  }
);
export const fetchClassroomDetail = createAsyncThunk(
  "classroom/fetchClassroomDetail",
  async (classCode: string) => {
    try {
      const response = await getClassroomDetail(classCode);
      return response;
    } catch (err) {
      toast.error("Lỗi");
    }
  }
);
const classroomSlice = createSlice({
  name: "classroom",
  initialState,
  reducers: {
    setClassroomDetail(state, action: PayloadAction<ClassroomDetailRecord>) {
      state.classroomDetail = { ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyClassroom.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchMyClassroom.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(fetchMyClassroom.fulfilled, (state, action) => {
        state.isLoading = false;
        state.enrolledClassrooms = action.payload?.enrolledClassrooms || [];
        state.myClassrooms = action.payload?.myClassrooms || [];
      })
      .addCase(fetchClassroomDetail.pending, (state) => {
        state.isLoadingDetail = true;
      })
      .addCase(fetchClassroomDetail.rejected, (state) => {
        state.isLoadingDetail = false;
      })
      .addCase(fetchClassroomDetail.fulfilled, (state, action) => {
        state.isLoadingDetail = false;
        state.classroomDetail = action.payload
          ? {
              ...action.payload,
              examAndPostList: [
                ...(action.payload.posts || []),
                ...(action.payload.classExams || []),
              ]
                .sort(
                  (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
                )
                .sort((a) => {
                  if (a.type === "classExam" && a.isOpen) {
                    return -1;
                  }
                  return 0;
                }),
            }
          : undefined;
      });
  },
});
export const { setClassroomDetail } = classroomSlice.actions;
export default classroomSlice.reducer;
