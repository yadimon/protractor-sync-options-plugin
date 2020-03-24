import { AppPage } from './app.po';
import { browser, logging } from 'protractor';

describe('workspace-project App', () => {
  let page: AppPage;

  beforeEach(async () => {
    page = new AppPage();
    await page.navigateTo();
  });

  it('should ignore running setTimeout', async (done) => {
    await page.enableTimeoutBtn.click();
    await simpleTest();
    done();
  });

  it('should ignore running setInterval', async () => {
    await page.enableIntervalBtn.click();
    await simpleTest();
  });

  it('should ignore running promise', async () => {
    await page.runPromiseBtn.click();
    await simpleTest();
  });

  it('should ignore running observable', async () => {
    await page.runObservableBtn.click();
    await simpleTest();
  });

  it('should ignore xhr request', async () => { // TODO simulate pending xhr
    await page.runRequestBtn.click();
    await simpleTest();
  });

  xit('should wait max time for pending tasks then ignore', async () => {
    // TODO implement feature + test
  });

  xit('should ignore pending tasks from special files', async () => {
    // TODO implement feature + test
  });

  xit('should ignore pending tasks from special npm package', async () => {
    // TODO implement feature + test
  });

  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({
      level: logging.Level.SEVERE,
    } as logging.Entry));
  });


  // -----------------------------------------------------
  //       helpers
  // -----------------------------------------------------
  function simpleTest() {
    return expect(page.getTitleText()).toEqual('protractor-sync-options-plugin-app app is running!');
  }
});
