const { validationResult } = require("express-validator");

const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }

  const extractedError = [];

  errors.array().map((err) => extractedError.push(err.msg));

  return res.status(422).json({
    errors: extractedError,
  });
};

module.exports = validate;
