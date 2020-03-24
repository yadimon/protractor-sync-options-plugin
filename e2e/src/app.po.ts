import { browser, by, element, $ } from 'protractor';

export class AppPage {
  public enableTimeoutBtn = $('#enableTimeout');
  public enableIntervalBtn = $('#enableInterval');
  public runPromiseBtn = $('#runPromise');
  public runObservableBtn = $('#runObservable');
  public runRequestBtn = $('#runRequest');

  public async navigateTo(): Promise<any> {
    await browser.get(browser.baseUrl);
  }

  public async getTitleText(): Promise<string> {
    return $('span').getText();
  }
}
