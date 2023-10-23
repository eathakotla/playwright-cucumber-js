import { test, Page } from '@playwright/test';
import { PolicyCenterPages } from '../src/pages/policycenter/pages';
import { browser } from '../src/playwright/helpers';

test('simple browser test', async ({ page }) => {
  const myPage: Page = await browser.launchPage();
  let pc = new PolicyCenterPages(myPage);
  await myPage.goto('https://labs.zengwcloud.com/v10/pc/PolicyCenter.do');
  await pc.loginPage().doLogin('su', 'Zens@r!lab');
  await pc.navigationBar().validateTabs();
  await pc.navigationBar().startNewAccount();
  await myPage.waitForTimeout(2000);
  await browser.closePage();
});
