import { When, Then } from '@cucumber/cucumber';
import { getAppDetails } from 'src/setup/env-utils';
import { PolicyCenterPages } from 'pages/policycenter/pages';
import { user } from 'src/types/types';
import { getPage } from 'playwright/page-utils';

let pc = new PolicyCenterPages();

When('user logins into application as {string}', async function (name) {
  let user: user = getAppDetails('policycenter').users.find((user) => user.name === name)!;
  await pc.loginPage().doLogin(user?.username, user?.password);
});

Then('user successfully logins', async function () {
  await pc.navigationBar().validateTabs();
  await getPage().waitForTimeout(5000);
});
