const Ajv = require('ajv');

const DapObject = require('./dapObject/DapObject');
const DapContract = require('./dapContract/DapContract');
const STPacket = require('./stPacket/STPacket');

const SchemaValidator = require('./validation/SchemaValidator');

const validateDapObjectFactory = require('./dapObject/validateDapObjectFactory');
const validateStPacketFactory = require('./stPacket/validation/validateSTPacketFactory');

const validateDapObjectStructureFactory = require('./dapObject/validateDapObjectStructureFactory');
const validateDapContractStructureFactory = require('./dapContract/validateDapContractStructureFactory');
const validateStPacketStructureFactory = require('./stPacket/validation/validateSTPacketStructureFactory');

const serializer = require('../../dash-schema/lib/serializer');

const validator = new SchemaValidator(new Ajv());

const validateDapObjectStructure = validateDapObjectStructureFactory(validator);
const validateDapContractStructure = validateDapContractStructureFactory(validator);
const validateSTPacketStructure = validateStPacketStructureFactory(validator);

const validateDapObject = validateDapObjectFactory(validator);
const validateSTPacket = validateStPacketFactory(
  validator,
  validateDapObject,
  validateDapContractStructure,
);

DapObject.setSerializer(serializer);
DapObject.setStructureValidator(validateDapObjectStructure);

DapContract.setSerializer(serializer);
DapContract.setStructureValidator(validateDapContractStructure);

STPacket.setSerializer(serializer);
STPacket.setStructureValidator(validateSTPacketStructure);

module.exports = {
  DapObject,
  DapContract,
  STPacket,
  validateDapObject,
  validateSTPacket,
};
