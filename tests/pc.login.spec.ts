import test from '@playwright/test';
import { PolicyCenterPages } from './pages/policycenter/pages';

test('user able to login into the policy center', async ({ page }) => {
  let pc = new PolicyCenterPages(page);
  await page.goto('https://labs.zengwcloud.com/v10/pc/PolicyCenter.do');
  await pc.loginPage().doLogin('su', 'Zens@r!lab');
  await pc.navigationBar().validateTabs();
  await pc.navigationBar().startNewAccount();
  await page.waitForTimeout(2000);
});
