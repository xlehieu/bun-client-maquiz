import { getListCollectionByName } from '@/api/collection.service';
import { CollectionDefault } from '@/types/common.type';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { toast } from 'sonner';
type QuestionTypeState = {
    isFetching: boolean;
    listQuestionType: CollectionDefault[];
};
const initialState: QuestionTypeState = {
    isFetching: false,
    listQuestionType: [],
};
export const fetchListQuestionType = createAsyncThunk('questionType/fetchListQuestionType', async () => {
    try {
        const response = await getListCollectionByName('questionType');
        return response.data;
    } catch (err) {
        toast.error('Lỗi');
    }
});
export const questionTypeSlice = createSlice({
    name: 'questionType',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchListQuestionType.pending, (state, action) => {
                state.isFetching = true;
            })
            .addCase(fetchListQuestionType.rejected, (state, action) => {
                state.isFetching = false;
            })
            .addCase(fetchListQuestionType.fulfilled, (state, action) => {
                // state.isFetching=false
                state.listQuestionType = action.payload?.data || [];
            });
    },
});

export default questionTypeSlice.reducer;
