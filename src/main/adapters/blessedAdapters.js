const blessed = require('blessed');

class Blessed {
  static screen(...args) {
    return blessed.screen(...args);
  }

  static list(...args) {
    return blessed.list(...args);
  }

  static textarea(...args) {
    return blessed.textarea(...args);
  }

  static box(...args) {
    return blessed.box(...args);
  }

  static image(...args) {
    return blessed.image(...args);
  }

  static layout(...args) {
    return blessed.layout(...args);
  }
}

module.exports = Blessed;