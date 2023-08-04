const express = require('express');
const router = express.Router();

//* CONTROLLER
const {
  insertPhoto,
  deletePhoto,
  getAllPhotos,
  getUserPhotos,
  getPhotoById,
  updatePhoto,
  likePhoto,
  commentPhoto,
  searchPhotos,
} = require('../controllers/PhotoController');

//* MIDDLEWARES
const {
  photoInsertValidation,
  photoUpdateValidation,
  commentValidation,
} = require('../middlewares/photoValidation');
const authGuard = require('../middlewares/authGuard');
const validade = require('../middlewares/handleValidation');
const { imageUpload } = require('../middlewares/imageUpload');

//* ROUTES
router.post(
  '/',
  authGuard,
  imageUpload.single('image'),
  photoInsertValidation(),
  validade,
  insertPhoto
);

router.delete('/:id', authGuard, deletePhoto);
router.get('/', authGuard, getAllPhotos);
router.get('/user/:id', authGuard, getUserPhotos);
router.get('/search', authGuard, searchPhotos);

router.get('/:id', authGuard, getPhotoById);
router.put('/:id', authGuard, photoUpdateValidation(), validade, updatePhoto);
router.put('/like/:id', authGuard, likePhoto);
router.put(
  '/comment/:id',
  authGuard,
  commentValidation(),
  validade,
  commentPhoto
);

router.put;

module.exports = router;
