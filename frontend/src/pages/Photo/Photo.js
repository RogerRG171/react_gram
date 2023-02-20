import "./Photo.css";

import { upload } from "../../utils/config";

//components
import Message from "../../components/Message";
import PhotoItem from "../../components/PhotoItem";
import { Link, useParams } from "react-router-dom";

//hooks
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useResetComponentMessage } from "../../hooks/useResetComponentMessage";

//Redux
import { getPhotoById, likePhoto, comment } from "../../slices/PhotoSlice";
import LikeContainer from "../../components/LikeContainer";

const Photo = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const resetMessage = useResetComponentMessage(dispatch);

  const { user } = useSelector((state) => state.auth);
  const { photo, loading, error, message } = useSelector(
    (state) => state.photo
  );

  const [commentText, setCommentText] = useState("");

  //Load photo data
  useEffect(() => {
    dispatch(getPhotoById(id));
  }, [dispatch, id]);

  //Insert a like
  const handleLike = () => {
    dispatch(likePhoto(photo._id));

    resetMessage();
  };

  //Insert a comment
  const handleCommentSubmit = (e) => {
    e.preventDefault();

    const commentData = {
      comment: commentText,
      id: photo._id,
    };

    dispatch(comment(commentData));

    setCommentText("");

    resetMessage();
  };

  if (loading) {
    return <p>Carregando...</p>;
  }

  return (
    <div id="photo">
      <PhotoItem photo={photo} />
      <LikeContainer
        photo={photo}
        user={user}
        handleLike={handleLike}
      />
      <div className="message-container">
        {message && (
          <Message
            msg={message}
            type="success"
          />
        )}
        {error && (
          <Message
            msg={message}
            type="error"
          />
        )}
      </div>
      <div className="comments">
        <h3>Comentários: ({photo.comments?.length || "0"})</h3>
        <form onSubmit={handleCommentSubmit}>
          <input
            type="text"
            placeholder="Insira seu comentário"
            value={commentText || ""}
            onChange={(e) => setCommentText(e.currentTarget.value)}
          />
          <input
            type="submit"
            value="Postar"
          />
        </form>
        {photo.comments && (
          <>
            {photo.comments.length === 0 && <p>Não há comentários...</p>}
            {photo.comments.length > 0 &&
              photo.comments.map((comment, i) => (
                <div
                  className="comment"
                  key={comment.userId + i}
                >
                  <div className="author">
                    {comment.userImage && (
                      <img
                        src={`${upload}/users/${comment.userImage}`}
                        alt={comment.userName}
                      />
                    )}
                    <Link to={`/users/${comment.userId}`}>
                      {comment.userName}
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
