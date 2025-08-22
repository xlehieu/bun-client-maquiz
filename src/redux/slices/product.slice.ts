import { createSlice } from '@reduxjs/toolkit';
const initProductList = {
    data: [],
    totalProduct: 0,
    currentPage: 0,
    totalPage: 0,
};
const productReducer = createSlice({
    name: 'product',
    initialState: initProductList,
    reducers: {
        updateProducts: (state, action) => {
            const { data, totalProduct, currentPage, totalPage } = action.payload;
            state.data = data;
            state.totalProduct = totalProduct;
            state.currentPage = currentPage;
            state.totalPage = totalPage;
        },
    },
});

export const { updateProducts } = productReducer.actions;

export default productReducer.reducer;
