var stackTrace = require('stack-trace');
var util = require('util');
var path = require('path');
var projectName = require('../package').name;

module.exports = class Logger {
  constructor() {
    function generateLogFunction(level) {
      return function(message, meta) {
        var mes = this.module + ' -- ';
        mes += level + ' -- ';
        mes += message;
        if (meta) mes += ' ' + util.inspect(meta) + ' ';

        mes += '\n';

        this.write(mes);
      }
    };

    this.trace = stackTrace.get()[1];
    this.filename = this.trace.getFileName();

    this.module = projectName + path.sep + path.relative('.', this.filename);

    this.streams = [process.stdout];

    this.log = generateLogFunction('Log');
    this.info = generateLogFunction('Info');
    this.error = generateLogFunction('Error');
    this.warn = generateLogFunction('Warning');
  }

  write(d) {
    this.streams.forEach((stream) => {
      stream.write(d);
    });
  }
}