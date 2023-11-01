import { PolicyCenterPages } from 'pages/policycenter/pages';
import { Given, When, Then } from '@cucumber/cucumber';
import { getAddressByState } from 'tests/data/data-utils';
import { getPage } from 'playwright/page-utils';

let pc = new PolicyCenterPages();

When('user creates account with {string} state address', async function (state: string) {
  let address = getAddressByState(state);
  await pc.enterAccountInformatinPage().createNewPerson(address!);
});
