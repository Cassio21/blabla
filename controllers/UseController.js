const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const jwtSecret = process.env.JWT_SECRET;

//! GENERATE USER TOKEN
const generateToken = (id) => {
  return jwt.sign({ id }, jwtSecret, {
    expiresIn: '7d',
  });
};

//! REGISTER USER AND SING IN
const register = async (req, res) => {
  const { name, email, password } = req.body;

  //! CHECK IF USER EXIST
  const user = await User.findOne({ email });
  if (user) {
    res.status(400).json({ errors: ['Please, use another email'] });
    return;
  }

  //! GENERATE  PASSWORD HASH
  const salt = await bcrypt.genSalt();
  const passwordHash = await bcrypt.hash(password, salt);

  //! CREATE USER
  const newUser = await User.create({
    name,
    email,
    password: passwordHash,
  });

  //! IF USER  WAS CREATED SUCCESFULLY, RETURN THE TOKEN
  if (!newUser) {
    res
      .status(422)
      .json({ errors: ['there was an error, please try again later'] });
    return;
  }
  res.status(201).json({
    _id: newUser._id,
    token: generateToken(newUser._id),
  });
};

//! SING USER IN
const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  //! CHECK IF USER EXIST
  if (!user) {
    res.status(404).json({ errors: ['Please, use another email'] });
    return;
  }

  //! CHECK IF PASSWORD MATCHES
  if (!(await bcrypt.compare(password, user.password))) {
    res.status(422).json({ errors: ['invalid password'] });
    return;
  }

  //! RETURN USER WITH TOKEN
  res.status(201).json({
    _id: user._id,
    profileImage: user.profileImage,
    token: generateToken(user._id),
  });
};

//! GET CURRENT LOGGED IN USER
const getCurrentUser = async (req, res) => {
  const user = req.user;

  res.status(200).json(user);
};

//! UPDATE AN USER
const update = async (req, res) => {
  const { name, password, bio } = req.body;

  let profileImage = null;

  if (req.file) {
    profileImage = req.file.filename;
  }

  const reqUser = req.user;

  const user = await User.findById(
    new mongoose.Types.ObjectId(reqUser._id)
  ).select('-password');

  if (name) {
    user.name = name;
  }

  if (password) {
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    user.password = passwordHash;
  }

  if (profileImage) {
    user.profileImage = profileImage;
  }

  if (bio) {
    user.bio = bio;
  }

  await user.save();

  res.status(200).json(user);
};

//!GET USER BY ID
const getUserById = async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(new mongoose.Types.ObjectId(id)).select(
    '-password'
  );

  //! CHECK IF USER EXIST

  if (!user) {
    res.status(404).json({ errors: ['User not find'] });
    return;
  }
  res.status(200).json(user);
};

//!  FALAR COM ERICK
// const getUserById = async (req, res) => {
//   const { id } = req.params;
//   try {
//     const user = await User.findById(mongoose.Types.ObjectId(id)).select(
//       '-password'
//     );
//     if (!user) {
//       res.status(404).json({ errors: ['User not find 1'] });
//       return;
//     }
//     res.status(200).json(user);
//   } catch (error) {
//     res.status(404).json({ errors: ['User not find 2'] });

//     return;
//   }
// };
//! FALAR COM ERICK

module.exports = {
  register,
  login,
  getCurrentUser,
  update,
  getUserById,
};
