import { userApi, type User } from "@/services/users";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GET_USERS } from "../actionType/userActionType";

interface UsersState {
  users: User[];
  selectedUser: User | null;
  loading: boolean;
}

const initialState: UsersState = {
  users: [],
  selectedUser: null,
  loading: false,
};

export const getUsers = createAsyncThunk(
  GET_USERS,
  async (_, { rejectWithValue }) => {
    try {
      const res = await userApi.getUsers();

      const data = res.data.map((el) => ({
        ...el,
        profilePicture:
          el.profilePicture || `https://picsum.photos/id/${el.id + 10}/100`,
      }));

      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to get Users"
      );
    }
  }
);

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    getDataById(state, action) {
      state.selectedUser = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    updateUser(state, action) {
      const idx = state.users.findIndex((el) => el.id == action.payload.id);

      if (idx != -1) {
        state.users[idx] = action.payload;
        if (state.selectedUser?.id === action.payload.id) {
          state.selectedUser = action.payload;
        }
      }
    },
    createUser(state, action) {
      state.users.push({
        ...action.payload,
        profilePicture: `https://picsum.photos/id/${
          Math.floor(Math.random() * 100) + 10
        }/100`,
      });
    },
    deleteUser(state, action) {
      state.users = state.users.filter((user) => user.id !== action.payload.id);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(getUsers.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { getDataById, updateUser, setLoading, deleteUser, createUser } =
  userSlice.actions;
export default userSlice.reducer;
