import EnterAccountInformationPage from './account/enterAccountInformation.page';
import BasePage from './base.page';
import { DesktopPage } from './desktop.page';
import { LoginPage } from './login.page';
import { NavigationBar } from './navigation.bar';

interface MethodStore {
  [key: string]: () => void;
}

export class PolicyCenterPages {
  pages: MethodStore;
  private login: LoginPage | undefined;
  private navigation: NavigationBar | undefined;
  private basePage: BasePage | undefined;
  private desktop: DesktopPage | undefined;
  private enterAccountInformation: EnterAccountInformationPage | undefined;

  constructor() {
    this.pages = {
      Login: () => {
        return this.loginPage();
      },
      navigation: () => {
        return this.navigationBar();
      },
      base: () => {
        return this.base();
      },
      'Enter Account Information': () => {
        return this.enterAccountInformatinPage();
      },
    };
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

  desktopPage(): DesktopPage {
    this.desktop = this.desktop ? this.desktop : new DesktopPage();
    return this.desktop;
  }

  enterAccountInformatinPage(): EnterAccountInformationPage {
    this.enterAccountInformation = this.enterAccountInformation ? this.enterAccountInformation : new EnterAccountInformationPage();
    return this.enterAccountInformation;
  }
}
