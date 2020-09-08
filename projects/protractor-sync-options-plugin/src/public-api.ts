// workaround to export the plugin instance from package require
import {SyncOptionsPlugin} from './lib';

const initializedPlugin = new SyncOptionsPlugin();
Object.assign(exports, initializedPlugin);
exports.setup = initializedPlugin.setup;
exports.onPageLoad = initializedPlugin.onPageLoad;
exports.trySafe = initializedPlugin.trySafe;
export const plugin: SyncOptionsPlugin = exports; // need to usual 'import' initialized plugin


export * from './lib';
