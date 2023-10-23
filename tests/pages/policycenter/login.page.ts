import { Page } from '@playwright/test';
import { WebComponent, createComponent } from 'helpers';
import { getPage } from 'page-utils';
import { v10 } from 'templates';

export class LoginPage {
  page: Page;
  username: WebComponent;
  password: WebComponent;
  loginButton: WebComponent;

  constructor() {
    this.page = getPage();
    this.username = createComponent(this.page, 'Username', v10.input('Username'));
    this.password = createComponent(this.page, 'Password', v10.input('Password'));
    this.loginButton = createComponent(this.page, 'Log In', v10.button('Log In'));
  }

  async doLogin(usr: string, pwd: string) {
    await this.username.fill(usr);
    await this.password.fill(pwd);
    await this.loginButton.click();
  }
}
