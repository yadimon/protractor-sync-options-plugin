import {browser, PluginConfig, ProtractorPlugin} from 'protractor';
import 'zone.js/dist/zone.js';
import * as clientScripts from './client-scripts.js';

// Angular internal, not intended for public API. But will be used by client script right now.
export interface PendingMacrotask {
  source: string;
  creationLocation: Error;
  runCount?: number;
  data?: TaskData;
}

export interface IgnoreTask {
  // got from angular/packages/zone.js/lib/zone-spec/fake-async-test.ts:498
  source?: 'setTimeout'
    | 'setInterval'
    | 'setImmediate'
    | 'XMLHttpRequest.send'
    | 'requestAnimationFrame'
    | 'webkitRequestAnimationFrame'
    | 'mozRequestAnimationFrame';
  creationLocation?: string | RegExp;
  // maxTaskWaitTime?: number, // TODO impl
  // ignoreTaskFn?: (task: Task) => boolean, // TODO impl
}

export interface SyncOptionsConfig extends PluginConfig {
  ignoreTasks: IgnoreTask[];
  // maxTasksGlobalWaitTime?: number, // TODO impl
  // isStableWrapper?: (this: Testability, isStableOrig: Function) => boolean, // TODO impl
}

export const syncOptionsPlugin: ProtractorPlugin = { // TODO define own class
  name: 'Protractor Sync Options Plugin',
  // this will be filled by protractor
  config: {} as SyncOptionsConfig,

  async onPageLoad(currBrowser) {
    const ignoreTasks: IgnoreTask[] = this.config.ignoreTasks;
    const result = await currBrowser.executeScript(clientScripts.patchTestability, ignoreTasks || []);
    console.log(`onPageLoad patch result:${result}`); // TODO logger
  },

  async setup() {
    const origFn = browser.constructor.prototype.waitForAngularEnabled;
    const thisPlugin = this;
    const newFn = async function(...args) {
      const ignoreTasks: IgnoreTask[] = thisPlugin.config.ignoreTasks;
      const result = await this.executeScript(clientScripts.patchTestability, ignoreTasks || []);
      console.log(`setup patch result: ${result}`); // TODO logger
      return origFn.apply(this, args);
    };

    if (origFn.toString() === newFn.toString()) {
      console.log('browser.waitForAngularEnabled is already patched'); // TODO logger
      return;
    }

    browser.constructor.prototype.waitForAngularEnabled = newFn;
  },

};


// creating a "var module: any" will allow use of module.exports
declare var module: any;
module.exports = syncOptionsPlugin;
