import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import mockData from "../../assets/stackline_frontend_assessment_data_2021.json";
import { Product } from "../../types";

interface ProductState {
  items: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchProduct = createAsyncThunk(
  "products/:productId",
  async () => {
    return mockData;
  }
);

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    resetProduct: (state) => {
      state.items = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchProduct.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchProduct.fulfilled, (state, action) => {
      state.loading = false;
      state.items = action.payload;
    });
    builder.addCase(fetchProduct.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to load products";
    });
  },
});

export const { resetProduct } = productSlice.actions;
export default productSlice.reducer;
