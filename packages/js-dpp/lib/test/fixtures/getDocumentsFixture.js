const crypto = require('crypto');

const getDataContractFixture = require('./getDataContractFixture');

const DocumentFactory = require('../../document/DocumentFactory');

const generateRandomId = require('../utils/generateRandomId');

const ownerId = generateRandomId();

/**
 * @param {DataContract} [dataContract]
 * @return {Document[]}
 */
module.exports = function getDocumentsFixture(dataContract = getDataContractFixture()) {
  const factory = new DocumentFactory(
    () => {},
    () => {},
  );

  return [
    factory.create(dataContract, ownerId, 'niceDocument', { name: 'Cutie' }),
    factory.create(dataContract, ownerId, 'prettyDocument', { lastName: 'Shiny' }),
    factory.create(dataContract, ownerId, 'prettyDocument', { lastName: 'Sweety' }),
    factory.create(dataContract, ownerId, 'indexedDocument', { firstName: 'William', lastName: 'Birkin' }),
    factory.create(dataContract, ownerId, 'indexedDocument', { firstName: 'Leon', lastName: 'Kennedy' }),
    factory.create(dataContract, ownerId, 'noTimeDocument', { name: 'ImOutOfTime' }),
    factory.create(dataContract, ownerId, 'uniqueDates', { firstName: 'John' }),
    factory.create(dataContract, ownerId, 'indexedDocument', { firstName: 'Bill', lastName: 'Gates' }),
    factory.create(dataContract, ownerId, 'withContentEncoding', { base64Field: crypto.randomBytes(10), base58Field: crypto.randomBytes(10) }),
    factory.create(dataContract, ownerId, 'optionalUniqueIndexedDocument', { firstName: 'Jacques-Yves', lastName: 'Cousteau' }),
  ];
};

module.exports.ownerId = ownerId;
