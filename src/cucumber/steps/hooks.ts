import { After, Before, ITestCaseHookParameter, Status, TestCaseHookDefinition, setDefaultTimeout } from '@cucumber/cucumber';
import { Page } from '@playwright/test';
import { browserProvider } from 'playwright/helpers';
import { getPage, setPage } from 'playwright/page-utils';
import { CustomWorld } from './customWorld';

setDefaultTimeout(600 * 1000 * 2);

Before(async function () {
  let page: Page = await browserProvider.launchPage();
  setPage(page);
});

After(async function (this: CustomWorld, { result }: ITestCaseHookParameter) {
  if (result) {
    if (result.status === Status.FAILED) {
      const image = await getPage().screenshot();
      image && this.attach(image, 'image/png');
    }
  }
  await browserProvider.closePage();
});
