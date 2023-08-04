const { body } = require('express-validator');

const photoInsertValidation = () => {
  return [
    body('title')
      .not()
      .equals('undefined')
      .withMessage('Title is required')
      .isString()
      .withMessage('Title is required')
      .isLength({ min: 3 })
      .withMessage('The title must have at least 3 letters'),
    body('image').custom((value, { req }) => {
      if (!req.file) {
        throw new Error('The picture is required');
      }
      return true;
    }),
  ];
};

const photoUpdateValidation = () => {
  return [
    body('title')
      .optional()
      .isString()
      .withMessage('Title is required')
      .isLength({ min: 3 })
      .withMessage('The title must have at least 3 letters'),
  ];
};

const commentValidation = () => {
  return [
    body('comment')
      .isString()
      .withMessage('Comment is required')
      .isLength({ min: 3 })
      .withMessage('The comment must have at least 3 letters'),
  ];
};

module.exports = {
  photoInsertValidation,
  photoUpdateValidation,
  commentValidation,
};
