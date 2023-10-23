import { Page } from '@playwright/test';
import { WebComponent, createComponent } from '../../playwright/helpers';
import { expect, expects } from '../../playwright/expects';
import { v10 } from '../../locators/templates';

export class NavigationBar {
  page: Page;
  accountTab: WebComponent;
  accountTabExpand: WebComponent;
  desktopTab: WebComponent;
  desktopTabExpand: WebComponent;
  policyTab: WebComponent;
  policyTabExpand: WebComponent;
  contactTab: WebComponent;
  ContactTabExpand: WebComponent;
  searchTab: WebComponent;
  searchTabExpand: WebComponent;
  administrationTab: WebComponent;
  administrationtabExpand: WebComponent;
  teamTab: WebComponent;
  newAccountItem: WebComponent;
  searchAccountInput: WebComponent;

  constructor(page: Page) {
    this.page = page;
    this.accountTab = createComponent(page, 'Account tab', v10.navTab('Account'));
    this.accountTabExpand = createComponent(page, 'Account tab expand', v10.navTabExpand('Account'));
    this.desktopTab = createComponent(page, 'Desktop tab', v10.navTab('Desktop'));
    this.desktopTabExpand = createComponent(page, 'Desktop tab expand', v10.navTabExpand('Desktop'));
    this.policyTab = createComponent(page, 'Policy tab', v10.navTab('Policy'));
    this.policyTabExpand = createComponent(page, 'Policy tab expand', v10.navTabExpand('Policy'));
    this.contactTab = createComponent(page, 'Contact tab', v10.navTab('Contact'));
    this.ContactTabExpand = createComponent(page, 'Contact tab expand', v10.navTabExpand('Contact'));
    this.searchTab = createComponent(page, 'Search tab', v10.navTab('Search'));
    this.searchTabExpand = createComponent(page, 'Search tab expand', v10.navTabExpand('Search'));
    this.administrationTab = createComponent(page, 'Administration', v10.navTab('Administration'));
    this.administrationtabExpand = createComponent(page, 'Administration tab expand', v10.navTabExpand('Administration'));
    this.teamTab = createComponent(page, 'Team tab', v10.navTab('Team'));
    this.newAccountItem = createComponent(page, 'New Account', v10.navMenuItem(page, 'New Account'));
  }

  async validateTabs() {
    let elements = [
      this.desktopTab,
      this.desktopTabExpand,
      this.accountTab,
      this.accountTabExpand,
      this.policyTab,
      this.policyTabExpand,
      this.contactTab,
      this.ContactTabExpand,
      this.searchTab,
      this.searchTabExpand,
      this.teamTab,
      this.administrationTab,
      this.administrationtabExpand,
    ];
    await expects(elements).areVisible(true);
  }

  async startNewAccount() {
    await expect(this.accountTabExpand.get()).toBeVisible();
    await this.accountTabExpand.click();
    await this.newAccountItem.click();
  }
}
