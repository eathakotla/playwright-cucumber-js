import { Page, test as baseTest } from '@playwright/test';
import { setPage } from 'playwright/page-utils';

/**
 * A hook that runs before each test, setting the page context.
 * @param {Page} page - The page context provided by Playwright.
 */
baseTest.beforeEach(({ page }: { page: Page }) => {
  setPage(page);
});

/**
 * A hook that runs before each test, setting the page context.
 * @param {Page} page - The page context provided by Playwright.
 */
// customPageTest.beforeEach(async () => {
//   const page: Page = await browserProvider.launchPage();
//   setPage(page);
// });

/**
 * The base test object with a beforeEach hook already set up.
 * This can be used to define tests with the page context set up.
 */
export const test = baseTest;
// export const ctest = customPageTest;
