(<any>process).scribe = require('scribe-js')({ createDefaultConsole: false });
(<any>process).console = (<any>process).scribe.console({ console: { alwaysLocation: true, alwaysTime: true } });
module.exports = require('./Game').default;
