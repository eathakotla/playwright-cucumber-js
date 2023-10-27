import { AfterAll, BeforeAll } from '@cucumber/cucumber';
import { Page } from '@playwright/test';
import { browserProvider } from 'helpers';
import { setPage } from 'page-utils';

BeforeAll(async function () {
  let page: Page = await browserProvider.launchPage();
  setPage(page);
});

AfterAll(async function () {
  await browserProvider.closePage();
});
