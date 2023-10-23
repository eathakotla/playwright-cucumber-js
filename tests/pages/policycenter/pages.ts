import BasePage from './base.page';
import { LoginPage } from './login.page';
import { NavigationBar } from './navigation.bar';

export class PolicyCenterPages {
  pages = new Map<string, any>();
  private login: LoginPage | undefined;
  private navigation: NavigationBar | undefined;
  private basePage: BasePage | undefined;

  constructor() {
    this.pages.set('Login', this.loginPage());
    this.pages.set('navigation', this.navigationBar());
  }

  loginPage(): LoginPage {
    this.login = this.login ? this.login : new LoginPage();
    return this.login;
  }

  navigationBar(): NavigationBar {
    this.navigation = this.navigation ? this.navigation : new NavigationBar();
    return this.navigation;
  }

  base(): BasePage {
    this.basePage = this.basePage ? this.basePage : new BasePage();
    return this.basePage;
  }
}
