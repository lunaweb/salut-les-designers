const browserSync                                          = require('browser-sync');
const { browsersyncName: serverName, browsersync: config } = require('./config');

// Create server
const bs = browserSync.create(serverName);

// Init server with wanted config
const serve = (cb) => {
  bs.init(config);
  cb();
};

// Reload task
const reload = (cb) => {
  bs.reload();
  cb();
};

module.exports.default = bs;
module.exports.server  = browserSync.get(serverName);
module.exports.serve   = serve;
module.exports.reload  = reload;
