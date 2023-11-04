import { WebComponent } from 'playwright/component';
import { createComponent, getComponents } from 'playwright/helpers';
import { v10 } from 'playwright/templates';

export class LoginPage {
  username: WebComponent = createComponent(v10.input('Username'), { alias: 'Username' });
  password: WebComponent = createComponent(v10.input('Password'), { alias: 'Password' });
  loginButton: WebComponent = createComponent(v10.button('Log In'), { alias: 'Log In' });
  elements: Map<string, WebComponent>;

  constructor() {
    this.elements = getComponents(this);
  }

  async doLogin(usr: string, pwd: string) {
    await this.username.fill(usr);
    await this.password.fill(pwd);
    await this.loginButton.click();
  }
}
