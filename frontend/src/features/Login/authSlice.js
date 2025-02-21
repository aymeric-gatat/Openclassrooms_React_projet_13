import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const URL = "http://localhost:3001/api/v1";
const storedToken = localStorage.getItem("token");

export const loginUser = createAsyncThunk("auth/loginUser", async ({ email, password }, thunkAPI) => {
  try {
    const response = await fetch(`${URL}/user/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error("Authentification échouée");
    }

    const data = await response.json();
    return data.body.token;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const fetchUser = createAsyncThunk("auth/fetchUser", async (token, thunkAPI) => {
  try {
    const response = await fetch(URL + "/user/profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des informations utilisateur");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const updateUser = createAsyncThunk("auth/updateUser", async ({ token, firstName, lastName }, thunkAPI) => {
  try {
    const response = await fetch(`${URL}/user/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ firstName, lastName }),
    });

    if (!response.ok) {
      throw new Error("Échec de la mise à jour du profil");
    }

    return { firstName, lastName };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    userId: null,
    token: storedToken || null,
    user: null,
    status: "idle",
    error: null,
  },
  reducers: {
    logout(state) {
      state.userId = null;
      state.token = null;
      state.user = null;

      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.userId = action.meta.requestId;
        state.token = action.payload;

        localStorage.setItem("token", action.payload);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = {
          ...state.user,
          body: {
            ...state.user.body,
            firstName: action.payload.firstName,
            lastName: action.payload.lastName,
          },
        };
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
