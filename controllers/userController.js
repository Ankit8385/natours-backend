const multer = require('multer'); // for uploading file
const sharp = require('sharp');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');

// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/img/users');
//   },
//   filename: (req, file, cb) => {
//     const ext = file.mimetype.split('/')[1];
//     cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//   },
// });

const multerStorage = multer.memoryStorage(); // store the image in the memory buffer (temporary)

const multerFilter = (req, file, cb) => {
  // Filter the files only with images of any type
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image. Please upload only images.', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
}); // to where(dest) save the file in local disk
exports.uploadUserPhoto = upload.single('photo');

exports.resizeUserPhoto = (req, res, next) => {
  // resize the image and upload it
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  sharp(req.file.buffer)
    .resize(500, 500) // to resize the image with the shape of square of len: 500, width: 500
    .toFormat('jpeg') // format the image into jpeg
    .jpeg({ quality: 90 }) // compress the quality of image to 90%
    .toFile(`public/img/users/${req.file.filename}`); // store the file to the mentioned location

  next();
};

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not defined for password update. Please use /updateMyPassword',
        400,
      ),
    );
  }

  // 2) Filtered out the unwanted fields name that are not allowed to be updated
  const filteredUser = filterObj(req.body, 'name', 'email');
  if (req.file) filteredUser.photo = req.file.filename;

  // 3) Update user document
  const UpdatedUser = await User.findByIdAndUpdate(req.user.id, filteredUser, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: 'success',
    date: {
      user: UpdatedUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'The route is not defined. Please use /signup for this!',
  });
};

exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);
