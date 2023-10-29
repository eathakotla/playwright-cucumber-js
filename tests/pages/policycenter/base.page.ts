import { getPage } from 'playwright/page-utils';
import { getAppDetails } from 'src/setup/env-utils';

export default class BasePage {
  constructor() {}

  async openPolicyCenter() {
    const url: string = getAppDetails('policycenter').url;
    await getPage().goto(url);
  }
}
