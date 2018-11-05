const SchemaValidator = require('../validation/SchemaValidator');
const InvalidDapObjectTypeError = require('../dapContract/errors/InvalidDapObjectTypeError');

/**
 * @param {SchemaValidator} validator
 * @return {validateDapObject}
 */
module.exports = function validateDapObjectFactory(validator) {
  /**
   * @typedef validateDapObject
   * @param {DapObject} dapObject
   * @param {DapContract} dapContract
   * @return {Object[]}
   */
  function validateDapObject(dapObject, dapContract) {
    let errors;

    // TODO validate once
    errors = validator.validate(
      SchemaValidator.SCHEMAS.BASE.DAP_OBJECT,
      dapObject.toJSON(),
    );

    if (errors.length) {
      return errors;
    }

    try {
      errors = validator.validate(
        dapContract.getDapObjectSchemaRef(dapObject.getType()),
        dapObject.toJSON(),
        { [dapContract.getSchemaId()]: dapContract.toJSON() },
      );
    } catch (e) {
      if (e instanceof InvalidDapObjectTypeError) {
        return [e];
      }

      throw e;
    }

    return errors;
  }

  return validateDapObject;
};