import { Given, Then, When } from '@cucumber/cucumber';
import { CustomWorld } from 'cucumber/steps/customWorld';
import { PolicyCenterPages } from 'pages/policycenter/pages';
import { logger } from 'src/setup/logger';

let pc = new PolicyCenterPages();

Given('user opens policycenter', async function (this: CustomWorld) {
  await this.launchPage();
  await pc.base().openPolicyCenter();
});

When('user is on {string} page in policycenter', async function (this: CustomWorld, name: string) {
  let page: any = pc.pages[name]();
  if (!page) {
    throw new Error('unable to find page with name ' + name + ', please make sure you added your page in app registry');
  }
  this.setClass(page);
});

When('user can access {string} bar in policycenter', async function (this: CustomWorld, name: string) {
  let page: any = pc.pages[name]();
  if (!page) {
    throw new Error('unable to find page with name ' + name + ', please make sure you added your page in app registry');
  }
  this.setClass(page);
});

Then('user prints all the elements of the page', async function (this: CustomWorld) {
  let page: any = this.getPageClass();
  let elements = page.elements;
  logger.info('elements : %s', elements);
});

When('user starts new Account', async function () {
  await pc.navigationBar().startNewAccount();
});
