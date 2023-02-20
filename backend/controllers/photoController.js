const Photo = require("../models/Photo");

const mongoose = require("mongoose");
const User = require("../models/User");

//Insert a photo, with a user releted to it
const insertPhoto = async (req, res) => {
  const { title } = req.body;
  const image = req.file.filename;

  const reqUser = req.user;

  const user = await User.findById(mongoose.Types.ObjectId(reqUser._id));

  //Create photo
  const newPhoto = await Photo.create({
    image,
    title,
    userId: user._id,
    userName: user.name,
  });

  //if photo was created successfully, return data
  if (!newPhoto) {
    res.status(422).json({
      errors: ["Houve um problema, por favor tente novamente mais tarde."],
    });
    return;
  }

  res.status(201).json(newPhoto);
  return;
};

//remove a photo from DB
const deletePhoto = async (req, res) => {
  const { id } = req.params;

  const reqUser = req.user;

  try {
    const photo = await Photo.findById(mongoose.Types.ObjectId(id));

    //check if photo exist
    if (!photo) {
      res.status(422).json({ errors: ["Foto não encontrada"] });
      return;
    }

    //check if photo belongs to user
    if (!photo.userId.equals(reqUser._id)) {
      res.status(404).json({ errors: ["Permissão negada!"] });
      return;
    }

    await Photo.findByIdAndDelete(photo._id);

    res
      .status(200)
      .json({ id: photo._id, message: "Foto removida com sucesso!" });
  } catch (error) {
    res.status(422).json({ errors: ["Id da photo inválido"] });
    return;
  }
};

//Get all photos
const getAllPhotos = async (req, res) => {
  const photos = await Photo.find({})
    .sort([["createdAt", -1]])
    .exec();

  if (!photos.length === 0) {
    res.status(404).json({ errors: ["Não existem fotos."] });
    return;
  }

  res.status(200).json(photos);
  return;
};

//Get user photos
const getUserPhotos = async (req, res) => {
  const { id } = req.params;

  try {
    const photos = await Photo.find({ userId: id })
      .sort([["createdAt", -1]])
      .exec();
    if (photos.length === 0) {
      res.status(404).json({ errors: ["Foto não encontrada"] });
      return;
    }
    res.status(200).json(photos);
    return;
  } catch (error) {
    res.status(422).json({ errors: ["Id inválido"] });
    return;
  }
};

//Get photo by id
const getPhotoById = async (req, res) => {
  const { id } = req.params;

  try {
    const photo = await Photo.findById(mongoose.Types.ObjectId(id));
    if (!photo) {
      res.status(404).json({ errors: ["Foto não encontrada"] });
      return;
    }

    res.status(200).json(photo);
    return;
  } catch (error) {
    res.status(422).json({ errors: ["Id inválido"] });
    return;
  }
};

//Update a photo
const updatePhoto = async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const reqUser = req.user;

  try {
    const photo = await Photo.findById(mongoose.Types.ObjectId(id));

    //check if photo exist
    if (!photo) {
      res.status(404).json({ errors: ["Foto não encontrada."] });
      return;
    }

    //check if photo belongs to the user request
    if (!reqUser._id.equals(photo.userId)) {
      res.status(403).json({ errors: ["Permissão negada!"] });
      return;
    }

    if (title) {
      photo.title = title;
    }

    await photo.save();

    res.status(200).json({ photo, message: "Foto editada com sucesso!" });
    return;
  } catch (error) {
    res.status(422).json({ errors: ["Id inválido"] });
    return;
  }
};

//Like functionality
const likePhoto = async (req, res) => {
  const { id } = req.params;
  const reqUser = req.user;

  try {
    const photo = await Photo.findById(mongoose.Types.ObjectId(id));

    //check if photo exist
    if (!photo) {
      res.status(404).json({ errors: ["Foto não encontrada."] });
      return;
    }

    //check if user already gave like
    if (photo.likes.includes(reqUser._id)) {
      res.status(422).json({ errors: ["Você já curtiu a foto."] });
      return;
    }

    //Put user id in likes array
    photo.likes.push(reqUser._id);

    await photo.save();

    res.status(200).json({
      photoId: id,
      userId: reqUser._id,
      message: "Foto curtida com sucesso!",
    });
    return;
  } catch (error) {
    res.status(422).json({ errors: ["Id inválido"] });
    return;
  }
};

//Comment functionality
const commentPhoto = async (req, res) => {
  const { id } = req.params;
  const { comment } = req.body;
  const reqUser = req.user;

  try {
    const photo = await Photo.findById(mongoose.Types.ObjectId(id));
    const user = await User.findById(mongoose.Types.ObjectId(reqUser._id));

    //check if photo exist
    if (!photo) {
      res.status(404).json({ errors: ["Foto não encontrada."] });
      return;
    }

    if (!user) {
      res.status(404).json({ errors: ["Usuário não encontrado."] });
      return;
    }

    if (comment) {
      userComment = {
        comment,
        userName: user.name,
        userImage: user.profileImage,
        userId: user._id,
      };

      photo.comments.push(userComment);

      await photo.save();

      res.status(200).json({
        comment: userComment,
        message: "Foto comentada com sucesso!",
      });
      return;
    }
    return;
  } catch (error) {
    res.status(422).json({ errors: ["Id inválido"] });
    return;
  }
};

//Search photo by title
const searchPhotos = async (req, res) => {
  const { q } = req.query;

  try {
    const photos = await Photo.find({ title: new RegExp(q, "i") }).exec();

    if (photos.length === 0) {
      res.status(404).json({ errors: ["Foto não encontrada."] });
      return;
    }

    res.status(200).json(photos);
    return;
  } catch (error) {
    res.status(422).json({ errors: ["Titulo inválido"] });
    return;
  }
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
