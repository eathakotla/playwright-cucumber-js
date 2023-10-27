import { Given, When } from '@cucumber/cucumber';
import { PolicyCenterPages } from '../../pages/policycenter/pages';

let pc = new PolicyCenterPages();

Given('user opens policycenter', async function () {
  await pc.base().openPolicyCenter();
});

When('user is on {string} page in policycenter', async function (name) {
  console.log('current page is : ', name);
});
