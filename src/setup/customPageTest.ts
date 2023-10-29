import { Page, test as baseTest } from '@playwright/test';
import { setPage } from 'playwright/page-utils';
import { browserProvider } from 'playwright/helpers';

/**
 * A hook that runs before each test, setting the page context.
 * @param {Page} page - The page context provided by Playwright.
 */
baseTest.beforeEach(async () => {
  const page: Page = await browserProvider.launchPage();
  setPage(page);
});

/**
 * A hook that runs before each test, setting the page context.
 * @param {Page} page - The page context provided by Playwright.
 */
baseTest.afterEach(async () => {
  await browserProvider.closePage();
});

/**
 * The base test object with a beforeEach hook already set up.
 * This can be used to define tests with the page context set up.
 */
export const test = baseTest;
