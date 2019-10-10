const jsonToProtobufFactory = require('./lib/client/converters/jsonToProtobufFactory');
const protobufToJsonFactory = require('./lib/client/converters/protobufToJsonFactory');
const jsonToProtobufInterceptorFactory = require(
  './lib/client/interceptors/jsonToProtobufInterceptorFactory',
);

const createServer = require('./lib/server/createServer');
const jsonToProtobufHandlerWrapper = require(
  './lib/server/jsonToProtobufHandlerWrapper',
);
const AcknowledgingWritable = require('./lib/server/stream/AcknowledgingWritable');
const wrapInErrorHandlerFactory = require('./lib/server/error/wrapInErrorHandlerFactory');

const FailedPreconditionGrpcError = require('./lib/server/error/FailedPreconditionGrpcError');
const InvalidArgumentGrpcError = require('./lib/server/error/InvalidArgumentGrpcError');
const InternalGrpcError = require('./lib/server/error/InternalGrpcError');
const GrpcError = require('./lib/server/error/GrpcError');

const isObject = require('./lib/utils/isObject');

const convertObjectToMetadata = require('./lib/convertObjectToMetadata');
const loadPackageDefinition = require('./lib/loadPackageDefinition');

module.exports = {
  loadPackageDefinition,
  convertObjectToMetadata,
  client: {
    converters: {
      jsonToProtobufFactory,
      protobufToJsonFactory,
    },
    interceptors: {
      jsonToProtobufInterceptorFactory,
    },
  },
  server: {
    createServer,
    jsonToProtobufHandlerWrapper,
    stream: {
      AcknowledgingWritable,
    },
    error: {
      wrapInErrorHandlerFactory,
      GrpcError,
      InternalGrpcError,
      InvalidArgumentGrpcError,
      FailedPreconditionGrpcError,
    },
  },
  utils: {
    isObject,
  },
};
