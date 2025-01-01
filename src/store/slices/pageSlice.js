import {createSlice} from '@reduxjs/toolkit';

const loadCurrentPage = () => {
    const savedPage = localStorage.getItem('currentPage');
    return savedPage ? JSON.parse(savedPage) : 1; 
  };

const pageSlice= createSlice({
    name: 'page',
    initialState: {
        currentPage: loadCurrentPage(),
     },

     reducers:{
        setCurrentPage: (state,action)=>{
            state.currentPage= action.payload;
            localStorage.setItem('currentPage', JSON.stringify(action.payload));
        }
     }
})

export const {setCurrentPage}= pageSlice.actions;

export default pageSlice.reducer;