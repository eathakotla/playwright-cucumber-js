import { Page } from '@playwright/test';
import { LoginPage } from './login.page';
import { NavigationBar } from './navigation.bar';

export class PolicyCenterPages {
  page: Page;
  pages = new Map<string, any>();
  private login: LoginPage;
  private navigation: NavigationBar;

  constructor(page: Page) {
    this.page = page;
    this.pages.set('Login', this.loginPage());
    this.pages.set('navigation', this.navigationBar());
  }

  loginPage(): LoginPage {
    this.login = this.login ? this.login : new LoginPage(this.page);
    return this.login;
  }

  navigationBar(): NavigationBar {
    this.navigation = this.navigation ? this.navigation : new NavigationBar(this.page);
    return this.navigation;
  }
}
