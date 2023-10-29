import { After, Before, setDefaultTimeout } from '@cucumber/cucumber';
import { Page } from '@playwright/test';
import { browserProvider } from 'playwright/helpers';
import { setPage } from 'playwright/page-utils';

setDefaultTimeout(600 * 1000 * 2);
Before(async function () {
  let page: Page = await browserProvider.launchPage();
  setPage(page);
});

After(async function () {
  await browserProvider.closePage();
});
