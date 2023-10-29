import { WebComponent, createComponent, getComponents } from 'playwright/helpers';
import { expects } from 'playwright/expects';
import { v10 } from 'playwright/templates';
import { expect } from 'playwright/helpers';

export class NavigationBar {
  accountTab: WebComponent = createComponent(v10.navTab('Account'), { alias: 'Account tab' });
  accountTabExpand: WebComponent = createComponent(v10.navTabExpand('Account'), { alias: 'Account tab expand' });
  desktopTab: WebComponent = createComponent(v10.navTab('Desktop'), { alias: 'Desktop tab' });
  desktopTabExpand: WebComponent = createComponent(v10.navTabExpand('Desktop'), { alias: 'Desktop tab expand' });
  policyTab: WebComponent = createComponent(v10.navTab('Policy'), { alias: 'Policy tab' });
  policyTabExpand: WebComponent = createComponent(v10.navTabExpand('Policy'), { alias: 'Policy tab expand' });
  contactTab: WebComponent = createComponent(v10.navTab('Contact'), { alias: 'Contact tab' });
  ContactTabExpand: WebComponent = createComponent(v10.navTabExpand('Contact'), { alias: 'Contact tab expand' });
  searchTab: WebComponent = createComponent(v10.navTab('Search'), { alias: 'Search tab' });
  searchTabExpand: WebComponent = createComponent(v10.navTabExpand('Search'), { alias: 'Search tab expand' });
  administrationTab: WebComponent = createComponent(v10.navTab('Administration'), { alias: 'Administration' });
  administrationtabExpand: WebComponent = createComponent(v10.navTabExpand('Administration'), { alias: 'Administration tab expand' });
  teamTab: WebComponent = createComponent(v10.navTab('Team'), { alias: 'Team tab' });
  newAccountItem: WebComponent = createComponent("//div[contains(@id,'AccountTab_NewAccount')]/div[@role='menuitem']", { alias: 'New Account' });
  searchAccountInput: WebComponent = createComponent('//input[contains(@name,"AccountNumberSearchItem")]', { alias: 'Search Account button' });
  elements: Map<string, WebComponent>;

  constructor() {
    this.elements = getComponents(this);
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
    await expect(this.searchAccountInput.get()).toBeVisible();
    await this.newAccountItem.click();
  }
}
