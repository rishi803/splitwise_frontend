import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'

const loadGroupsFromStorage= ()=>{
    const savedGroups = localStorage.getItem('groups');
    return savedGroups ? JSON.parse(savedGroups) : [];
}

const getCurrentTimestamp = () => new Date().toISOString(); 

const groupSlice= createSlice({
    name:'groups',
    initialState:{
        groups:loadGroupsFromStorage()
    },

    reducers:{

     addGroup: (state, action)=>{

        const newGroup={
            ...action.payload,
            id: Date.now().toString(), // generate a unique id
            createdAt: getCurrentTimestamp(),
            totalExpenses: 0,
        }

        state.groups.push(newGroup);
        localStorage.setItem('groups', JSON.stringify(state.groups));
     },
   
     removeGroup: (state, action)=>{
        const updatedGroup= state.groups.filter((group)=> group.id !== action.payload);
        state.groups= updatedGroup;
     }

    }
});

export const {addGroup, removeGroup}= groupSlice.actions;

export default groupSlice.reducer;