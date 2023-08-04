import './Search.css';

//? Hooks.
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useResetComponentMessage } from '../../hooks/useResetMessage';
import { useQuery } from '../../hooks/useQuery';

//? Components.
import LikeComponents from '../../components/LikeComponents';
import PhotoItem from '../../components/PhotoItem';
import { Link } from 'react-router-dom';

//? Redux.
import { searchPhotos, like } from '../../slices/photoSlice';

const Search = () => {
  const query = useQuery();
  const search = query.get('q');

  const dispatch = useDispatch();

  const resetMessage = useResetComponentMessage(dispatch);

  const { user } = useSelector((state) => state.auth);
  const { photos, loading } = useSelector((state) => state.photo);

  //! Load photos.
  useEffect(() => {
    dispatch(searchPhotos(search));
  }, [dispatch, search]);

  //! Like a photo
  const handleLike = (photo) => {
    dispatch(like(photo._id));

    resetMessage();
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div id="search">
      <h2>You searching for: {search} </h2>
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
          No No results were found for your search 😓 <br />{' '}
          <Link to={`/users/${user._id}`}>Click Here!</Link>
        </h2>
      )}
    </div>
  );
};
export default Search; // export the component
