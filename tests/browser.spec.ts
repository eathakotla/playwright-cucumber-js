import { PolicyCenterPages } from './pages/policycenter/pages';
import { test } from '../src/setup/customPageTest';

test('simple browser test', async () => {
  let pc = new PolicyCenterPages();
  await pc.base().openPolicyCenter();
  await pc.loginPage().doLogin('su', 'Zens@r!lab');
  await pc.navigationBar().validateTabs();
  await pc.navigationBar().startNewAccount();
});
