import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authServicer from '../services/authService';

const user = JSON.parse(localStorage.getItem('user'));

const initialState = {
  user: user ? user : null,
  error: false,
  success: false,
  loading: false,
};

//* Register an user and sing in.
export const register = createAsyncThunk(
  'auth/register',
  async (user, thunkAPI) => {
    const data = await authServicer.register(user);

    //! Check for ERRORS.
    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0]);
    }
    return data;
  }
);

//* Logout an user.
export const logout = createAsyncThunk('auth/logout', async () => {
  await authServicer.logout();
});

//* Sing in an user.
export const login = createAsyncThunk('auth/login', async (user, thunkAPI) => {
  const data = await authServicer.login(user);

  //! Check for ERRORS.
  if (data.errors) {
    return thunkAPI.rejectWithValue(data.errors[0]);
  }
  return data;
});
/////////////////////////////

export const authSlice = createSlice({
  name: 'auth',
  initialState,

  //* Reducers.
  reducers: {
    reset: (state) => {
      state.loading = false;
      state.error = false;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.user = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Something went wrong!';
        state.user = null;
      })
      .addCase(logout.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.user = null;
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Something went wrong!';
        state.user = null;
      });
  },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;
