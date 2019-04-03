// This file is used for compiling tests with webpack into one file for using with karma
require('./bootstrap');

const testsContext = require.context('../../../test', true, /^(?!.*e2e).*\.js$/);

testsContext.keys().forEach(testsContext);
