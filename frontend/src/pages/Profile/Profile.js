import "./Profile.css";

import { upload } from "../../utils/config";

//components
import Message from "../../components/Message";
import { Link } from "react-router-dom";
import { BsFillEyeFill, BsPencilFill, BsXLg } from "react-icons/bs";

//hooks
import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

//redux
import { getUserDetails } from "../../slices/UserSlice";
import {
  publishPhoto,
  resetMessage,
  getUserPhotos,
  deletePhoto,
  updatePhoto,
} from "../../slices/PhotoSlice";

const Profile = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { user, loading } = useSelector((state) => state.user);
  const { user: userAuth } = useSelector((state) => state.auth);
  const {
    photos,
    loading: loadingPhoto,
    error: errorPhoto,
    message: messagePhoto,
  } = useSelector((state) => state.photo);

  //states
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");

  const [editId, setEditId] = useState("");
  const [editImage, setEditImage] = useState("");
  const [editTitle, setEditTitle] = useState("");

  // New form and edit form refs
  const newPhotoForm = useRef();
  const editPhotoForm = useRef();

  //Load user data
  useEffect(() => {
    dispatch(getUserDetails(id));
    dispatch(getUserPhotos(id));
  }, [dispatch, id]);

  if (loading) {
    return <p>Carregando...</p>;
  }

  //reset message
  const resetComponentMessage = () => {
    setTimeout(() => {
      dispatch(resetMessage());
    }, 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const photoData = {
      title,
      image,
    };

    //build form data
    const formData = new FormData();

    const photoFormData = Object.keys(photoData).forEach((key) =>
      formData.append(key, photoData[key])
    );
    formData.append("photo", photoFormData);

    dispatch(publishPhoto(formData));

    setTitle("");
    setImage({});

    resetComponentMessage();
  };

  const handleFile = (e) => {
    const image = e.target.files[0];

    setImage(image);
  };

  //delete a photo
  const handleDelete = (id) => {
    dispatch(deletePhoto(id));

    resetComponentMessage();
  };

  // Update a photo
  const handleUpdateSubmit = (e) => {
    e.preventDefault();

    const photoData = {
      title: editTitle,
      _id: editId,
    };

    dispatch(updatePhoto(photoData));

    resetComponentMessage();
  };

  //Cancel photo edit
  const handleCancelEdit = () => {
    hideOrShowForms();
  };

  //show or hide forms
  const hideOrShowForms = () => {
    newPhotoForm.current.classList.toggle("hide");
    editPhotoForm.current.classList.toggle("hide");
  };

  //open edit form
  const handleEdit = (photo) => {
    if (editPhotoForm.current.classList.contains("hide")) {
      hideOrShowForms();
    }

    setEditId(photo._id);
    setEditTitle(photo.title);
    setEditImage(photo.image);
  };
  return (
    <div id="profile">
      <div className="profile-header">
        {user.profileImage && (
          <img
            src={`${upload}/users/${user.profileImage}`}
            alt={user.name}
          />
        )}
        <div className="profile-description">
          <h2>{user.name}</h2>
          <p>{user.bio}</p>
        </div>
      </div>
      {id === userAuth._id && (
        <>
          <div
            className="new-photo"
            ref={newPhotoForm}
          >
            <h3>Compartilhe algum momento seu:</h3>
            <form onSubmit={handleSubmit}>
              <label>
                <span>T??tulo para a foto:</span>
                <input
                  type="text"
                  placeholder="Insira um t??tulo"
                  value={title || ""}
                  onChange={(e) => setTitle(e.currentTarget.value)}
                />
              </label>
              <label>
                <span>Imagem:</span>
                <input
                  type="file"
                  onChange={handleFile}
                />
              </label>
              {!loading && (
                <input
                  type="submit"
                  value="Postar"
                />
              )}
              {loading && (
                <input
                  type="submit"
                  value="Aguarde..."
                  disabled
                />
              )}
            </form>
          </div>
          <div
            className="edit-photo hide"
            ref={editPhotoForm}
          >
            <p>Editando: </p>
            {editImage && (
              <img
                src={`${upload}/photos/${editImage}`}
                alt={editTitle}
              />
            )}
            <form onSubmit={handleUpdateSubmit}>
              <input
                type="text"
                value={editTitle || ""}
                onChange={(e) => setEditTitle(e.currentTarget.value)}
              />
              <input
                type="submit"
                value="Editar"
              />
              <button
                className="cancel-btn"
                onClick={handleCancelEdit}
              >
                Cancelar edi????o
              </button>
            </form>
          </div>
          {errorPhoto && (
            <Message
              msg={errorPhoto}
              type={"error"}
            />
          )}
          {messagePhoto && (
            <Message
              msg={messagePhoto}
              type={"success"}
            />
          )}
        </>
      )}
      <div className="user-photos">
        <h2>Fotos publicadas:</h2>
        <div className="photos-container">
          {photos &&
            photos.map((photo) => (
              <div
                className="photo"
                key={photo._id}
              >
                {photo.image && (
                  <img
                    src={`${upload}/photos/${photo.image}`}
                    alt={photo.title}
                  />
                )}
                {id === userAuth._id ? (
                  <div className="actions">
                    <Link to={`/photos/${photo._id}`}>
                      <BsFillEyeFill />
                    </Link>
                    <BsPencilFill onClick={() => handleEdit(photo)} />
                    <BsXLg onClick={() => handleDelete(photo._id)} />
                  </div>
                ) : (
                  <Link
                    className="btn"
                    to={`/photos/${photo._id}`}
                  >
                    Ver
                  </Link>
                )}
              </div>
            ))}
          {photos.length === 0 && <p>Ainda n??o h?? fotos publicadas...</p>}
        </div>
      </div>
    </div>
  );
};

export default Profile;
