// @ts-check
// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

require('ts-node').register({
  project: require('path').join(__dirname, './tsconfig.json')
});

const { SpecReporter } = require('jasmine-spec-reporter');

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
      // path: "../projects/protractor-sync-options-plugin/src/public-api.ts", //for faster dev
      ignoreTasks: ignoreTasks,
    }
  ],
  allScriptsTimeout: 11000,
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
    print: function() {}
  },
  onPrepare() {
    require('ts-node').register({
      project: require('path').join(__dirname, './tsconfig.json')
    });
    jasmine.getEnv().addReporter(new SpecReporter({ spec: { displayStacktrace: true } }));
  }
};
