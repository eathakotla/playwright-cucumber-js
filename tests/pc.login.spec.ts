import { test } from '../src/setup/custom-test';
import { PolicyCenterPages } from './pages/policycenter/pages';

test('user able to login into the policy center', async () => {
  let pc = new PolicyCenterPages();
  await pc.base().openPolicyCenter();
  await pc.loginPage().doLogin('su', 'Zens@r!lab');
  await pc.navigationBar().validateTabs();
  const expected = new Map<string, string>();
  expected.set('Due Date', '08/25/2022');
  expected.set('Priority', 'High');
  expected.set('Account Holder', '#notblank');
  expected.set('Escalation', '#notpresent');
  expected.set('column#1', '#blank');
  await pc.desktopPage().activitiesTable.checkRowData(4, expected);
  await pc.navigationBar().startNewAccount();
  await pc.base().page.waitForTimeout(2000);
});
