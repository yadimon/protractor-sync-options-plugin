// @ts-check
// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

const tsConfigFile = process.env.PROTRACTOR_PLUGIN_TS_CONF_FILE || require('path').join(__dirname, './tsconfig.json');
require('ts-node').register({
  project: tsConfigFile,
});
require("tsconfig-paths").register({
  baseUrl: "./../",
  paths: require(tsConfigFile).compilerOptions.paths
});


const {SpecReporter} = require('jasmine-spec-reporter');

/** @type IgnoreTask[] */
const ignoreTasks = [{source: 'setTimeout'}, {source: 'setInterval'}, {source: 'XMLHttpRequest.send'}]; // TODO change dynamic by tests

/**
 * @type { import("protractor").Config }
 */
exports.config = {
  SELENIUM_PROMISE_MANAGER: false,
  plugins: [
    {
      package: 'protractor-sync-options-plugin',
      ignoreTasks: ignoreTasks,
    }
  ],
  allScriptsTimeout: 5000,
  specs: [
    './src/**/*.e2e-spec.ts'
  ],
  capabilities: {
    browserName: 'chrome'
  },
  directConnect: true,
  baseUrl: 'http://localhost:4200/',
  framework: 'jasmine',
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000,
    print: function () {
    }
  },
  onPrepare() {
    jasmine.getEnv().addReporter(new SpecReporter({spec: {displayStacktrace: true}}));
  }
};
