import { Page } from '@playwright/test';
import { getPage } from 'page-utils';
import { getAppDetails } from '../../../src/setup/env-utils';

export default class BasePage {
  page: Page;

  constructor() {
    this.page = getPage();
  }

  async openPolicyCenter() {
    const url: string = getAppDetails('policycenter').url;
    await this.page.goto(url);
  }
}
