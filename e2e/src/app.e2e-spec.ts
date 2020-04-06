import {AppPage} from './app.po';
import {$, browser, logging} from 'protractor';
import {IgnoreTask, plugin} from 'protractor-sync-options-plugin';

// TODO find a way to test fails without waiting for timeout

describe('Protractor Sync Options Plugin', () => {
  let page: AppPage;

  beforeEach(async () => {
    page = new AppPage();
    await page.navigateTo();
  });

  it('should ignore running setTimeout', async () => {
    await setTasks([{source: 'setTimeout'}]);
    await page.enableTimeoutBtn.click();
    await simpleTest();
  });

  it('should ignore running setInterval', async () => {
    await setTasks([{source: 'setInterval'}]);
    await page.enableIntervalBtn.click();
    await simpleTest();
  });

  it('should ignore running promise (setTimeout)', async () => {
    await setTasks([{source: 'setTimeout'}]);
    await page.runPromiseBtn.click();
    await simpleTest();
  });

  it('should ignore running observable (setInterval)', async () => {
    await setTasks([{source: 'setInterval'}]);
    await page.runObservableBtn.click();
    await simpleTest();
  });

  it('should ignore xhr request', async () => { // TODO simulate pending xhr
    await setTasks([{source: 'XMLHttpRequest.send'}]);
    await page.runRequestBtn.click();
    await simpleTest();
  });

  xit('should wait max time for pending tasks then ignore', async () => {
    // TODO implement feature + test
  });

  xit('should ignore pending tasks from special files', async () => {
    // TODO implement feature + test
  });

  it('should ignore 3rd party lodash setTimeout if only .creationLocation set to "lodash"', async () => {
    await setTasks([{creationLocation: 'lodash'}]);
    await page.run3rdPartySetTimeoutBtn.click();
    await simpleTest();
  });

  describe('waitForAngularEnabled patch', () => {
    beforeEach(async () => {
      await setTasks([{source: 'setTimeout'}]);
    });

    it('should ignore setTimeout after disable and enable .waitForAngularEnabled()', async () => {
      await browser.waitForAngularEnabled(false);
      await page.navigateTo();
      await browser.waitForAngularEnabled(true);
      await page.enableTimeoutBtn.click();
      await simpleTest();
    });

    it('should ignore setTimeout after redirect to non-angular page and back', async () => {
      await page.redirectBtn.click();
      await browser.waitForAngularEnabled(false);
      const goBackBtn = $('#go-back');
      await browser.driver.wait(goBackBtn.isDisplayed());
      await goBackBtn.click();
      await browser.waitForAngularEnabled(true);

      await page.enableTimeoutBtn.click();
      await simpleTest();
    });
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

  async function setTasks(tasks: IgnoreTask[]) {
    plugin.config.ignoreTasks = tasks;
    await plugin.patcher.restoreClientTestability();
    await plugin.patcher.patchClientTestability(plugin.config);
  }
});
