import { Page } from '@playwright/test';
import { WebComponent, createComponent } from 'helpers';
import { expect, expects } from 'expects';
import { v10 } from 'templates';
import { getPage } from 'page-utils';

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

  constructor() {
    this.page = getPage();
    this.accountTab = createComponent(this.page, 'Account tab', v10.navTab('Account'));
    this.accountTabExpand = createComponent(this.page, 'Account tab expand', v10.navTabExpand('Account'));
    this.desktopTab = createComponent(this.page, 'Desktop tab', v10.navTab('Desktop'));
    this.desktopTabExpand = createComponent(this.page, 'Desktop tab expand', v10.navTabExpand('Desktop'));
    this.policyTab = createComponent(this.page, 'Policy tab', v10.navTab('Policy'));
    this.policyTabExpand = createComponent(this.page, 'Policy tab expand', v10.navTabExpand('Policy'));
    this.contactTab = createComponent(this.page, 'Contact tab', v10.navTab('Contact'));
    this.ContactTabExpand = createComponent(this.page, 'Contact tab expand', v10.navTabExpand('Contact'));
    this.searchTab = createComponent(this.page, 'Search tab', v10.navTab('Search'));
    this.searchTabExpand = createComponent(this.page, 'Search tab expand', v10.navTabExpand('Search'));
    this.administrationTab = createComponent(this.page, 'Administration', v10.navTab('Administration'));
    this.administrationtabExpand = createComponent(this.page, 'Administration tab expand', v10.navTabExpand('Administration'));
    this.teamTab = createComponent(this.page, 'Team tab', v10.navTab('Team'));
    this.newAccountItem = createComponent(this.page, 'New Account', v10.navMenuItem(this.page, 'New Account'));
    this.searchAccountInput = createComponent(this.page, 'Search Account button', '');
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
