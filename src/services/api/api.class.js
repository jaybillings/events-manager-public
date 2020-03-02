const apiRunner = require('./apiRunner.class');

class Service {
  constructor(options) {
    this.options = options || {};
  }

  // noinspection JSUnusedGlobalSymbols
  setup(app) {
    this.app = app;
  }

  async get(name, params) {
    const runner = new apiRunner(this.app);
    const paramString = JSON.stringify(params.query);

    switch (name) {
    case 'selectEventsByID':
      if (!params.query.idList) throw new Error(`Missing required parameter 'idList'. Params are ${paramString}.`);
      return runner.selectEventsByID(params.query.idList);
    case 'selectEventsLive':
      return runner.selectEventsLive(params.query.lastUpdated);
    case 'selectEventsDropped':
      return runner.selectEventsDropped(params.query.lastUpdated, params.query.returnStale);
    default:
      throw new Error(`No or invalid method specified. ${name} called with params ${paramString}.`);
    }
  }
}

module.exports = options => new Service(options);

module.exports.Service = Service;
