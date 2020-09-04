import {browser, ProtractorBrowser, ProtractorPlugin} from 'protractor';
import {Patcher} from './patcher';
import {SyncOptionsConfig} from './interfaces';


export class SyncOptionsPlugin implements ProtractorPlugin {
  public name = 'Protractor Sync Options Plugin';
  // this will be filled by protractor
  public config: SyncOptionsConfig;
  public patcher: Patcher;

  public constructor() {
    this.patcher = new Patcher(browser);
  }

  async onPageLoad(currBrowser: ProtractorBrowser): Promise<void> {
    await this.trySafe(() => this.patcher.patchClientTestability(this.config));
  }

  async setup(): Promise<void> {
    this.patcher.browser = browser;
    await this.trySafe(() => this.patcher.patchWaitForAngularEnabled(this.config));
  }

  /**
   * safe function call
   * shows only warning in function error case
   * @returns `false` if `funcToCall` throws an error, `true` otherwise
   */
  public async trySafe(funcToCall: () => any): Promise<boolean> {
    try {
      await funcToCall();
      return true;
    } catch (e) {
      console.warn('function call failed', e); // TODO logger;
      return false;
    }
  }
}
