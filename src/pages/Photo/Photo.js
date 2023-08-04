import './Photo.css';

import { uploads } from '../../utils/config';

//* Components.
import Message from '../../components/Message';
import { Link } from 'react-router-dom';
import PhotoItem from '../../components/PhotoItem';

//* Hooks.
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useResetComponentMessage } from '../../hooks/useResetMessage';

//* Redux.
import { getPhotoById, like, comment } from '../../slices/photoSlice';
import LikeComponents from '../../components/LikeComponents';

const Photo = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  //* Reset component messages hook
  const resetMessage = useResetComponentMessage(dispatch);

  const { user } = useSelector((state) => state.auth);
  const { photo, loading, error, message } = useSelector(
    (state) => state.photo
  );

  //* Comments.
  const [commentText, setCommentText] = useState('');

  //? Load photo data.
  useEffect(() => {
    dispatch(getPhotoById(id));
  }, [dispatch, id]);

  //? HandleLike
  const handleLike = () => {
    dispatch(like(photo._id));
    resetMessage();
  };

  //? HandleComment.
  const handleComment = (e) => {
    e.preventDefault();

    const commentData = {
      comment: commentText,
      id: photo._id,
    };
    console.log(comment);
    dispatch(comment(commentData));

    setCommentText('');

    resetMessage();
  };

  //! Liked and Coments.
  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div id="photo">
      <PhotoItem photo={photo} />
      <LikeComponents photo={photo} user={user} handleLike={handleLike} />
      <div className="message-container">
        {error && <Message msg={error} type="error" />}
        {message && <Message msg={message} type="success" />}
      </div>
      <div className="comments">
        {photo.comments && (
          <>
            <h3>Comments: ({photo.comments.length})</h3>

            <form onSubmit={handleComment}>
              <input
                type="text"
                placeholder="Enter your comment"
                onChange={(e) => setCommentText(e.target.value)}
                value={commentText || ''}
              />
              <input type="submit" value="send" />
            </form>
            {photo.comments.length === 0 && <p>There are no comments...</p>}
            {photo.comments.map((comment) => (
              <div className="comment" key={comment.comment}>
                <div className="author">
                  {comment.userImage && (
                    <img
                      src={`${uploads}/users/${comment.userImage}`}
                      alt={comment.userName}
                    />
                  )}
                  <Link to={`/users/${comment.userId}`}>
                    <p>{comment.userName}</p>
                  </Link>
                </div>
                <p>{comment.comment}</p>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};
export default Photo;
