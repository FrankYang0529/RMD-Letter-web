const path = require('path'),
      rootPath = path.normalize(`${__dirname}/..`);

const Controllers = function(filePath) {
  return path.normalize(`${rootPath}/api/controllers/${filePath}`);
};

const Models = function(filePath) {
  return path.normalize(`${rootPath}/api/models/${filePath}`);
};

module.exports = {
  // database
  mongo: 'mongodb://localhost/rmd-letter',
  redis: {
    host: '127.0.0.1',
    port: 6379,
  },

  // path
  Controllers: Controllers,
  Models: Models,

  // aws s3
  AWS: {
    accessKeyId: 'YourAcessKey',
    secretAccessKey: 'YourSecretAccessKey',
  },
};
