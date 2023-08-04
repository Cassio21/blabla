import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import photoService from '../services/photoService';

const initialState = {
  photos: [],
  photo: {},
  error: false,
  success: false,
  loading: false,
  message: null,
};

//? publish user photo.
export const PublishPhoto = createAsyncThunk(
  'photo/publish',
  async (photo, thunckAPI) => {
    const token = thunckAPI.getState().auth.user.token;

    const data = await photoService.PublishPhoto(photo, token);

    //! Check for errors.
    if (data.errors) {
      return thunckAPI.rejectWithValue(data.errors[0]);
    }
    return data;
  }
);

//? Get user Photos.
export const getUserPhoto = createAsyncThunk(
  'photo/userphotos',
  async (id, thunckAPI) => {
    const token = thunckAPI.getState().auth.user.token;
    const data = await photoService.getUserPhoto(id, token);

    return data;
  }
);

//? Delete a Photo.
export const deletePhoto = createAsyncThunk(
  'photo/delete',
  async (id, thunckAPI) => {
    const token = thunckAPI.getState().auth.user.token;
    const data = await photoService.deletePhoto(id, token);

    if (data.errors) {
      return thunckAPI.rejectWithValue(data.errors[0]);
    }

    return data;
  }
);

export const updatePhoto = createAsyncThunk(
  'photo/update',
  async (photoData, thunckAPI) => {
    const token = thunckAPI.getState().auth.user.token;
    const data = await photoService.updatePhoto(
      { title: photoData.title },
      photoData.id,
      token
    );

    if (data.errors) {
      return thunckAPI.rejectWithValue(data.errors[0]);
    }
    return data;
  }
);

//? Get a photo by id.
export const getPhotoById = createAsyncThunk(
  'photo/getphoto',
  async (id, thunckAPI) => {
    const token = thunckAPI.getState().auth.user.token;

    const data = await photoService.getPhotoById(id, token);

    if (data.errors) {
      return thunckAPI.rejectWithValue(data.errors[0]);
    }

    console.log('photo:', data);
    return data;
  }
);

//? Like a photo.
export const like = createAsyncThunk('photo/like', async (id, thunckAPI) => {
  const token = thunckAPI.getState().auth.user.token;
  const data = await photoService.like(id, token);

  if (data.errors) {
    return thunckAPI.rejectWithValue(data.errors[0]);
  }

  console.log('liked:', data);
  return data;
});

//? Comments to a photo.
export const comment = createAsyncThunk(
  'photo/comment',
  async (commentData, thunckAPI) => {
    const token = thunckAPI.getState().auth.user.token;
    const data = await photoService.comment(
      { comment: commentData.comment },
      commentData.id,
      token
    );

    if (data.errors) {
      return thunckAPI.rejectWithValue(data.errors[0]);
    }

    console.log('Comment:', data);
  }
);

//? Get all photos.
export const getPhotos = createAsyncThunk(
  'photo/getAll',
  async (_, thunckAPI) => {
    const token = thunckAPI.getState().auth.user.token;

    const data = await photoService.getPhotos(token);

    return data;
  }
);

//? Search a photo.
export const searchPhotos = createAsyncThunk(
  'photo/search',
  async (query, thunckAPI) => {
    const token = thunckAPI.getState().auth.user.token;

    const data = await photoService.searchPhotos(query, token);

    return data;
  }
);

export const photoSlice = createSlice({
  name: 'photo',
  initialState,
  reducers: {
    resetMessage: (state) => {
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(PublishPhoto.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(PublishPhoto.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.photo = action.payload;
        state.photos.unshift(state.photo);
        state.message = 'Photo post successfully';
      })
      .addCase(PublishPhoto.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.photo = {};
      })
      .addCase(getUserPhoto.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(getUserPhoto.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.photos = action.payload;
      })
      .addCase(deletePhoto.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(deletePhoto.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.photos = state.photos.filter((photo) => {
          return photo._id !== action.payload.id;
        });

        state.message = action.payload.message;
        //   state.message ='Photo deleted successfully';
      })
      .addCase(deletePhoto.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.photo = {};
      })
      .addCase(updatePhoto.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(updatePhoto.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.photos.map((photo) => {
          if (photo._id === action.payload.photo._id) {
            return (photo.title = action.payload.photo.title);
          }
          return photo;
        });

        state.message = action.payload.message;
        //   state.message ='Photo deleted successfully';
      })
      .addCase(updatePhoto.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.photo = {};
      })
      .addCase(getPhotoById.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(getPhotoById.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.photo = action.payload;
      })
      .addCase(like.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;

        if (state.photo.likes) {
          state.photo.likes.push(action.payload.userId);
        }

        state.photos.map((photo) => {
          if (photo._id === action.payload.photoId) {
            return photo.likes.push(action.payload.userId);
          }
          return photo;
        });

        state.message = action.payload.message;
      })
      .addCase(like.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(comment.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;

        state.photo.comments.push(action.payload.comments);

        state.message = action.payload.message;
      })
      .addCase(comment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getPhotos.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(getPhotos.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.photos = action.payload;
      })
      .addCase(searchPhotos.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(searchPhotos.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.photos = action.payload;
      });
  },
});

export const { resetMessage } = photoSlice.actions;
export default photoSlice.reducer;
