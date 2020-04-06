// @ts-check
// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

process.env.PROTRACTOR_PLUGIN_TS_CONF_FILE = require('path').join(__dirname, './tsconfig.built.json');
exports.config = require('./protractor.conf').config;
