import './Home.css';

//? Components.
import LikeComponents from '../../components/LikeComponents';
import PhotoItem from '../../components/PhotoItem';
import { Link } from 'react-router-dom';

//? Hooks.
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useResetComponentMessage } from '../../hooks/useResetMessage';

//? Redux.
import { getPhotos, like } from '../../slices/photoSlice';

const Home = () => {
  const dispatch = useDispatch();

  const resetMessage = useResetComponentMessage(dispatch);

  const { user } = useSelector((state) => state.auth);
  const { photos, loading } = useSelector((state) => state.photo);

  //* Load all photos.
  useEffect(() => {
    dispatch(getPhotos());
  }, [dispatch]);

  //* like a photo.
  const handleLike = (photo) => {
    dispatch(like(photo._id));

    resetMessage();
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div id="home">
      {photos &&
        photos.map((photo) => (
          <div key={photo._id}>
            <PhotoItem photo={photo} />
            <LikeComponents photo={photo} user={user} handleLike={handleLike} />
            <Link className="btn" to={`/photos/${photo._id}`}>
              See more
            </Link>
          </div>
        ))}
      {photos && photos.length === 0 && (
        <h2 className="no-photos">
          No photos published yet 😓 <br />{' '}
          <Link to={`/users/${user._id}`}>Click Here!</Link>
        </h2>
      )}
    </div>
  );
};

export default Home;
