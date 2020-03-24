import {PluginConfig, ProtractorPlugin} from 'protractor';
import 'zone.js/dist/zone.js'
import * as clientScripts from './client-scripts.js';

export interface IgnoreTask {
  // got from angular/packages/zone.js/lib/zone-spec/fake-async-test.ts:498
  source: 'setTimeout'
    | 'setInterval'
    | 'setImmediate'
    | 'XMLHttpRequest.send'
    | 'requestAnimationFrame'
    | 'webkitRequestAnimationFrame'
    | 'mozRequestAnimationFrame';
  // maxTaskWaitTime?: number, // TODO impl
  // ignoreTaskFn?: (task: Task) => boolean, // TODO impl
}

export interface SyncOptionsConfig extends PluginConfig {
  ignoreTasks: IgnoreTask[],
  // maxTasksGlobalWaitTime?: number, // TODO impl
  // isStableWrapper?: (this: Testability, isStableOrig: Function) => boolean, // TODO impl
}

export const syncOptionsPlugin: ProtractorPlugin = { // TODO define own class
  name: 'Protractor Sync Options Plugin',
  // this will be filled by protractor
  config: {} as SyncOptionsConfig,

  async onPageLoad(browser) {
    const ignoreTasks: IgnoreTask[] = this.config.ignoreTasks;
    await browser.executeScript(clientScripts.patchTestability, ignoreTasks || []);
  },
};


// creating a "var module: any" will allow use of module.exports
declare var module: any;
module.exports = syncOptionsPlugin;
