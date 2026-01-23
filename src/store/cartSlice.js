import { createSlice } from "@reduxjs/toolkit";

const cartSlice=createSlice({
    name:"cart",
    initialState:{
        cartCount:0,
    },
    reducers:{
        setCartCount:(state,action)=>{
            state.cartCount=action.payload;
        },
        resetCart:(state)=>{
            state.cartCount=0;
        }
    }
})

export const { setCartCount, resetCart } = cartSlice.actions;
export default cartSlice.reducer;