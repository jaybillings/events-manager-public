const exportRunner = require('./exportRunner.class');

class Service {
  constructor(options) {
    this.options = options || {};
  }

  // noinspection JSUnusedGlobalSymbols
  setup(app) {
    this.app = app;
  }

  async find(params) {
    const lastUpdated = params.query.lastUpdated || '';
    const runner = new exportRunner(this.app, lastUpdated);

    if (params.query.collateResults && params.query.collateResults.toString().toLowerCase() !== 'false') {
      return runner.exportAndCollate(lastUpdated);
    } else {
      return runner.exportAllData(lastUpdated);
    }
  }
}

module.exports = options => new Service(options);

module.exports.Service = Service;
