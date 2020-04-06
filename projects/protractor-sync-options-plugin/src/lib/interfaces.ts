// Angular internal, not intended for public API. But will be used by client script right now.
import {PluginConfig} from 'protractor';

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
