import { api, requestConfig } from '../utils/config';

//! Publish an user photo.
const PublishPhoto = async (data, token) => {
  //   const config = { ...requestConfig(token), method: 'POST', data };
  const config = requestConfig('POST', data, token, true);

  try {
    const res = await fetch(api + '/photos', config)
      .then((res) => res.json())
      .catch((err) => err);

    return res;
  } catch (error) {
    console.log(error);
  }
};

//? Get user photos.
const getUserPhoto = async (id, token) => {
  const config = requestConfig('GET', null, token);

  try {
    //   const res = await fetch(`${api}/photos/user/${id}`, config)
    const res = await fetch(api + '/photos/user/' + id, config)
      .then((res) => res.json())
      .catch((err) => err);

    return res;
  } catch (error) {
    console.log(error);
  }
};

//? Delete a Photo.
const deletePhoto = async (id, token) => {
  const config = requestConfig('DELETE', null, token);

  try {
    const res = await fetch(api + '/photos/' + id, config)
      .then((res) => res.json())
      .catch((err) => err);

    return res;
  } catch (error) {
    console.log(error);
  }
};

//? Update a photo.
const updatePhoto = async (data, id, token) => {
  const config = requestConfig('PUT', data, token);

  try {
    const res = await fetch(api + '/photos/' + id, config)
      .then((res) => res.json())
      .catch((err) => err);

    return res;
  } catch (error) {
    console.log(error);
  }
};

//? Get a photo by id.
const getPhotoById = async (id, token) => {
  const config = requestConfig('GET', null, token);

  try {
    const res = await fetch(api + '/photos/' + id, config)
      .then((res) => res.json())
      .catch((err) => err);

    return res;
  } catch (error) {
    console.log(error);
  }
};

//? Funciton Like.
const like = async (id, token) => {
  const config = requestConfig('PUT', null, token);

  try {
    const res = await fetch(api + '/photos/like/' + id, config)
      .then((res) => res.json())
      .catch((err) => err);

    return res;
  } catch (error) {
    console.log(error);
  }
};

//? Add comments to a photo.
const comment = async (data, id, token) => {
  const config = requestConfig('PUT', data, token);

  try {
    const res = await fetch(api + '/photos/comment/' + id, config)
      .then((res) => res.json())
      .catch((err) => err);

    return res;
  } catch (error) {
    console.log(error);
  }
};

//? All photos.
const getPhotos = async (token) => {
  const config = requestConfig('GET', null, token);

  try {
    const res = await fetch(api + '/photos/', config)
      .then((res) => res.json())
      .catch((err) => err);

    return res;
  } catch (error) {
    console.log(error);
  }
};

//? Search photos.
const searchPhotos = async (query, token) => {
  const config = requestConfig('GET', null, token);

  try {
    const res = await fetch(api + '/photos/search?q=' + query, config)
      .then((res) => res.json())
      .catch((err) => err);

    return res;
  } catch (error) {
    console.log(error);
  }
};

const photoService = {
  PublishPhoto,
  getUserPhoto,
  deletePhoto,
  updatePhoto,
  getPhotoById,
  like,
  comment,
  getPhotos,
  searchPhotos,
};

export default photoService;
