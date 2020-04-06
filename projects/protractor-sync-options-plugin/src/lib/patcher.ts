import {ProtractorBrowser} from 'protractor';
import * as clientScripts from './client-scripts';
import {SyncOptionsConfig} from './interfaces';

/**
 * makes monkey-patching for protractor and frontend angular.testability
 * @TODO find a way to use some api instead of monkey-patching
 */
export class Patcher {
  constructor(public browser?: ProtractorBrowser) {
  }

  /**
   *
   * @param config config to use
   * @returns `true` in success case, `false` otherwise (e.g. already patched)
   */
  public async patchClientTestability(config: SyncOptionsConfig): Promise<void> {
      await this.browser.executeScript(clientScripts.patchTestability, config.ignoreTasks || []);
  }

  /**
   * restores patched with {@link this#patchClientTestability} client
   */
  public async restoreClientTestability(): Promise<boolean> {
      return this.browser.executeScript(clientScripts.restoreTestability);
  }

  /**
   * patches {@link browser#waitForAngular}
   * @returns `true` in success case, `false` otherwise (e.g. already patched)
   */
  public async patchWaitForAngularEnabled(config: SyncOptionsConfig): Promise<void> {
    if (this.isWaitForAngularPatched()) {
      throw Error('browser.waitForAngularEnabled is already patched');
    }

    const origFn = this.browser.constructor.prototype.waitForAngularEnabled;
    const thisPlugin = this;

    const newFn = async function(...args) {
      // try to patch client only if waitForAngular should be enabled
      if (args[0] === true) {
        await thisPlugin.patchClientTestability(config).catch(e => {
          console.warn('patched waitForAngularEnabled => patchClientTestability error:', e); // TODO logger
        });
      }
      return origFn.apply(this, args);
    };
    newFn.orignalFn = origFn;

    this.browser.constructor.prototype.waitForAngularEnabled = newFn;
  }

  public async restoreWaitForAngularEnabled() {
    if (!this.isWaitForAngularPatched()) {
      throw Error('Cant restore. this.browser.constructor.prototype.waitForAngularEnabled is not patched');
    }

    const proto = this.browser.constructor.prototype;
    proto.waitForAngularEnabled = proto.waitForAngularEnabled.originalFn;
  }

  public isWaitForAngularPatched(): boolean {
    return !!this.browser.constructor.prototype.waitForAngularEnabled.originalFn; // better check?
  }
}
