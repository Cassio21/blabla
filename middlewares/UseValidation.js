const { body } = require('express-validator');

const userCreateValidation = () => {
  return [
    body('name')
      .isString()
      .withMessage('name is required')
      .isLength({ min: 3 })
      .withMessage('The name needs for 3 letters'),
    body('email')
      .isString()
      .withMessage('The E-mail is required')
      .isEmail()
      .withMessage('enter a valid email'),
    body('password')
      .isString()
      .withMessage('password is required')
      .isLength({ min: 5 })
      .withMessage('The password needs for 5 letters'),
    body('confirmPassword')
      .isString()
      .withMessage('Password confirmation is mandatory')
      .custom((value, { req }) => {
        if (value != req.body.password) {
          throw new Error('Passwords do not match');
        }
        return true;
      }),
  ];
};

const loginValidation = () => {
  return [
    body('email')
      .isString()
      .withMessage('The email is required')
      .isEmail()
      .withMessage('enter a valid email'),
    body('password').isString().withMessage('password is required'),
  ];
};

const userUpdateValidation = () => {
  return [
    body('name')
      .optional()
      .isLength({ min: 3 })
      .withMessage('The name needs for 3 letters'),
    body('password')
      .optional()
      .isLength({ min: 5 })
      .withMessage('The password needs for 5 letters'),
  ];
};

module.exports = {
  userCreateValidation,
  loginValidation,
  userUpdateValidation,
};
