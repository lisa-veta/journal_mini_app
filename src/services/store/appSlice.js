import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {authTeacher, getUserRole} from "../api/send";

export const fetchUserRole = createAsyncThunk(
    'app/fetchUserRole',
    async (telegramId, { rejectWithValue }) => {
        try {
            const userRole = await getUserRole(telegramId);
            return userRole[0].check_role;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchTeacherId = createAsyncThunk(
    'app/fetchTeacherId',
    async (telegramId, { rejectWithValue }) => {
        try {
            return await authTeacher(telegramId);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const initialState = {
    userRole: null,
    teacherId: null,
    groupId: null,
    isHeadman: null,
};

const appSlice = createSlice({
    name: 'app',
    initialState: initialState,
    reducers: {
        setGroupId: (state, action) => {
            state.groupId = action.payload;
        },
        setIsHeadman: (state, action) => {
            state.isHeadman = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserRole.fulfilled, (state, action) => {
                state.userRole = action.payload;
            })
            .addCase(fetchUserRole.rejected, (state, action) => {
                console.log('ошибка в определении роли: ', action.payload);
            })
            .addCase(fetchTeacherId.fulfilled, (state, action) => {
                state.teacherId = action.payload;
            })
            .addCase(fetchTeacherId.rejected, (state, action) => {
                console.log('ошибка в определении teacherId: ', action.payload);
            });
    }
});

export const {setGroupId, setIsHeadman} = appSlice.actions;
export default appSlice.reducer;