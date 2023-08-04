import './EditProfile.css';
import { uploads } from '../../utils/config';

//! Hooks.
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

//! Redux.
import { profile, resetMessage, updateProfile } from '../../slices/userSlice';

//! Components.
import Message from '../../components/Message';

const EditProfile = () => {
  const dispatch = useDispatch();
  const { user, message, error, loading } = useSelector((state) => state.user);

  //! States.
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profileImage, setImageProfile] = useState('');
  const [bio, setBio] = useState('');
  const [previewImage, setPreviewImage] = useState('');

  //! Load user data.
  useEffect(() => {
    dispatch(profile());
  }, [dispatch]);

  //! fill form with users data.
  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setBio(user.bio);
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    //! Gether user data from states.
    const userData = {
      name,
    };

    if (profileImage) {
      userData.profileImage = profileImage;
    }

    if (bio) {
      userData.bio = bio;
    }

    if (password) {
      userData.password = password;
    }

    //! Build form data.
    const formData = new FormData();

    const userFormData = Object.keys(userData).forEach((key) =>
      formData.append(key, userData[key])
    );

    formData.append('user', userFormData);

    await dispatch(updateProfile(userFormData));
    setTimeout(() => {
      dispatch(resetMessage());
    }, 2000);
  };

  const handleFile = (e) => {
    //! Image Preview.
    const image = e.target.files[0];

    setPreviewImage(image);

    //! Update image state.
    setImageProfile(image);
  };

  return (
    <div id="edit-profile">
      <h2>Edit Profile</h2>
      <p className="subtitle">add a profile picture 📸 </p>

      {/* preview of picture */}
      {(user.profileImage || previewImage) && (
        <img
          className="profile-image"
          src={
            previewImage
              ? URL.createObjectURL(previewImage)
              : `${uploads}/users/${user.profileImage}`
          }
          alt={user.name}
        />
      )}
      {/* */}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
          value={name || ''}
        />
        <input type="email" placeholder="E-mail" disabled value={email || ''} />

        <label>
          <span>Profile Image: </span>
          <input type="file" onChange={handleFile} />
        </label>

        <label>
          <span>Bio:</span>
          <input
            type="text"
            placeholder="Profile description"
            onChange={(e) => setBio(e.target.value)}
            value={bio || ''}
          />
        </label>

        <label>
          <span>Want to change your password?</span>
          <input
            type="password"
            placeholder="Enter your new password"
            onChange={(e) => setPassword(e.target.value)}
            value={password || ''}
          />
        </label>

        {!loading && <input type="submit" value="Updated" />}
        {loading && <input type="submit" value="loading..." disabled />}

        {/* Error message */}
        {error && <Message msg={error} type="error" />}

        {/* Message */}
        {message && <Message msg={message} type="success" />}
      </form>
    </div>
  );
};
export default EditProfile;
