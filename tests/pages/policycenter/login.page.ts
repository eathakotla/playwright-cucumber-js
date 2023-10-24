import { WebComponent, createComponent } from 'helpers';
import { v10 } from 'templates';

export class LoginPage {
  username: WebComponent = createComponent(v10.input('Username'), { alias: 'Username' });
  password: WebComponent = createComponent(v10.input('Password'), { alias: 'Password' });
  loginButton: WebComponent = createComponent(v10.button('Log In'), { alias: 'Log In' });

  constructor() {}

  async doLogin(usr: string, pwd: string) {
    await this.username.fill(usr);
    await this.password.fill(pwd);
    await this.loginButton.click();
  }
}
