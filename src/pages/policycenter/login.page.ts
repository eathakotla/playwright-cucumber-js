import { Page } from '@playwright/test';
import { WebComponent, createComponent } from '../../playwright/helpers';
import { v10 } from '../../locators/templates';
// import { WebComponent, createComponent } from '@playwright/helpers';
// import { v10 } from '@locator/templates';

export class LoginPage {
  page: Page;
  username: WebComponent;
  password: WebComponent;
  loginButton: WebComponent;

  constructor(page: Page) {
    this.username = createComponent(page, 'Username', v10.input('Username'));
    this.password = createComponent(page, 'Password', v10.input('Password'));
    this.loginButton = createComponent(page, 'Log In', v10.button('Log In'));
  }

  async doLogin(usr: string, pwd: string) {
    await this.username.fill(usr);
    await this.password.fill(pwd);
    await this.loginButton.click();
  }
}
