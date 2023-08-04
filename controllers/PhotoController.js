const Photo = require('../models/Photo');
const mongoose = require('mongoose');
const User = require('../models/User');

//! Insert a photo wint an user related to it
const insertPhoto = async (req, res) => {
  const { title } = req.body;
  const image = req.file.filename;

  const reqUser = req.user;

  const user = await User.findById(reqUser._id);

  //! Create a Phot
  const newPhoto = await Photo.create({
    image,
    title,
    userId: user._id,
    userName: user.name,
  });

  //! If photo was created successfully, return data.
  if (!newPhoto) {
    res.status(422).json({
      errors: ['There was a problem, please try again later.'],
    });
    return;
  }

  res.status(201).json(newPhoto);
};

//! Remove a photo db
const deletePhoto = async (req, res) => {
  const { id } = req.params;
  const reqUser = req.user;

  try {
    //? METHOD OLD.
    // const photo = await Photo.findById(mongoose.Types.ObjectId(id));

    // ? Method New.
    const photo = await Photo.findById(id);

    //! Check if photo exists
    if (!photo) {
      return res.status(404).json({ errors: ['Picture not find'] });
    }

    //! Check if photo belongs to the user
    if (!photo.userId.equals(reqUser._id)) {
      return res
        .status(422)
        .json({ errors: ['an error has occurred, please try again'] });
    }

    await Photo.findByIdAndDelete(photo._id);

    return res
      .status(200)
      .json({ id: photo._id, message: 'Picture successfully deleted' });
  } catch (error) {
    return res.status(404).json({ errors: ['Picture not find'] });
  }
};

//! Get all Photos.
const getAllPhotos = async (req, res) => {
  const photos = await Photo.find({})
    .sort([['createdAt', -1]])
    .exec();
  return res.status(200).json(photos);
};

//! Get user Photos.
const getUserPhotos = async (req, res) => {
  const { id } = req.params;

  const photos = await Photo.find({ userId: id })
    .sort([['createdAt', -1]])
    .exec();
  return res.status(200).json(photos);
};

//! Get photo by id.
const getPhotoById = async (req, res) => {
  const { id } = req.params;

  //Photo.findById(mongoose.Types.ObjectId(id)
  const photo = await Photo.findById(id);

  //!Check if photo exists
  if (!photo) {
    return res.status(404).json({ errors: ['Picture not found!'] });
  }
  res.status(200).json(photo);
};

//! Update a photo.
const updatePhoto = async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const reqUser = req.user;
  const photo = await Photo.findById(id);

  //! Check if photo exists.
  if (!photo) {
    return res.status(404).json({ errors: ['Picture not found!'] });
  }

  //! Check if photo belongs user.
  if (!photo.userId.equals(reqUser._id)) {
    return res
      .status(422)
      .json({ errors: ['An error occurred, please try again later.'] });
  }

  if (title) {
    photo.title = title;
  }

  await photo.save();

  res.status(200).json({ photo, message: 'photo updated successfully!' });
};

//! Like functionality.
const likePhoto = async (req, res) => {
  const { id } = req.params;

  const reqUser = req.user;

  const photo = await Photo.findById(id);

  //! Check if photo exists and is liked by the current user already or not.
  if (!photo) {
    return res.status(404).json({ errors: ['Picture not found!'] });
  }

  if (photo.likes.includes(reqUser._id)) {
    return res.status(422).json({ errors: `You're already liked this photo!` });
  }

  //! Put user id in likes array.
  photo.likes.push(reqUser._id);

  // ! Save changes to database.
  photo.save();
  res
    .status(200)
    .json({ photoId: id, userId: reqUser._id, message: 'Photo liked' });
};

//!Comment Functionality.
const commentPhoto = async (req, res) => {
  const { id } = req.params;
  const { comment } = req.body;

  const reqUser = req.user;

  const user = await User.findById(reqUser._id);
  const photo = await Photo.findById(id);

  //! Check if photo exists.
  if (!photo) {
    return res.status(404).json({ errors: ['Picture not found!'] });
  }

  //! Put comment in the array comments.
  const userComment = {
    comment,
    userName: user.name,
    userImage: user.profileImage,
    userId: user._id,
  };

  photo.comments.push(userComment);

  // ! Save changes to database.
  await photo.save();

  res.status(200).json({
    comment: userComment,
    message: 'Comment added',
  });
};

//! Search photos by title.
const searchPhotos = async (req, res) => {
  const { q } = req.query;

  const photos = await Photo.find({ title: new RegExp(q, 'i') }).exec();

  res.status(200).json(photos);
};

module.exports = {
  insertPhoto,
  deletePhoto,
  getAllPhotos,
  getUserPhotos,
  getPhotoById,
  updatePhoto,
  likePhoto,
  commentPhoto,
  searchPhotos,
};