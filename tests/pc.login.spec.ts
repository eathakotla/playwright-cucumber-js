import { test } from '../src/setup/custom-test';
import { PolicyCenterPages } from './pages/policycenter/pages';

test('user able to login into the policy center', async () => {
  let pc = new PolicyCenterPages();
  await pc.base().openPolicyCenter();
  await pc.loginPage().doLogin('su', 'Zens@r!lab');
  await pc.navigationBar().validateTabs();
  await pc.navigationBar().startNewAccount();
  await pc.base().page.waitForTimeout(2000);
});
