import "./Search.css";

//hooks
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useResetComponentMessage } from "../../hooks/useResetComponentMessage";
import { useQuery } from "../../hooks/useQuery";

//components
import LikeContainer from "../../components/LikeContainer";
import PhotoItem from "../../components/PhotoItem";
import Message from "../../components/Message";
import { Link } from "react-router-dom";

//redux
import { searchPhoto, likePhoto } from "../../slices/PhotoSlice";
const Search = () => {
  const query = useQuery();
  const search = query.get("q");

  const dispatch = useDispatch();
  const resetMessage = useResetComponentMessage(dispatch);

  const { user } = useSelector((state) => state.auth);
  const { photos, loading, error } = useSelector((state) => state.photo);

  //Load photos
  useEffect(() => {
    dispatch(searchPhoto(search));
  }, [search, dispatch]);

  //Like a photo
  const handleLike = (photo) => {
    dispatch(likePhoto(photo._id));

    resetMessage();
  };

  if (loading) {
    return <p>Carregando...</p>;
  }

  return (
    <div id="search">
      <h2>
        Você está buscando por: {search} {photos?.length}
      </h2>
      {photos &&
        photos?.length > 0 &&
        photos.map((photo) => (
          <div key={photo._id}>
            <PhotoItem photo={photo} />
            <LikeContainer
              handleLike={handleLike}
              photo={photo}
              user={user}
            />
            <Link
              className="btn"
              to={`/photos/${photo._id}`}
            >
              Ver mais
            </Link>
          </div>
        ))}
      {error && (
        <Message
          msg={error}
          type="error"
        />
      )}
    </div>
  );
};

export default Search;
