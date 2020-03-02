/* eslint-disable no-unused-vars */

class Service {
  constructor(options) {
    this.options = options || {};
    this.events = ['status', 'error'];
  }

  async create(data, params) {
    if (Array.isArray(data)) {
      return await Promise.all(data.map(current => this.create(current)));
    }

    return {status: 'success'};
  }
}

module.exports = options => new Service(options);

module.exports.Service = Service;
