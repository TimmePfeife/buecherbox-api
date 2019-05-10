const Ajv = require('ajv');
const HttpStatus = require('http-status-codes');
const Schemes = require('../schemes');

const SchemeValidator = Ajv({ allErrors: true, removeAdditional: '' });

for (let schema in Schemes) {
  if (Schemes.hasOwnProperty(schema)) {
    SchemeValidator.addSchema(Schemes[schema], schema);
  }
}

/**
 * Validates the input data using a json scheme.
 * @param schemaName
 * @returns {Function}
 */
module.exports = (schemaName) => {
  return (req, res, next) => {
    const valid = SchemeValidator.validate(schemaName, req.body);

    if (!valid) {
      const error = SchemeValidator.errors.map((err) => {
        return {
          path: err.dataPath,
          message: err.message
        }
      });
      res.status(HttpStatus.BAD_REQUEST).json(error);
      return;
    }

    next();
  }
};
