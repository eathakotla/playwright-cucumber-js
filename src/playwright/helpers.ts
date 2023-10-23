import { Browser, BrowserContextOptions, Locator, Page, PlaywrightTestConfig, Project, chromium, firefox, webkit } from '@playwright/test';
import { BrowserInterface } from '../types/types';
import { config } from '../../test.config';

interface Component {
  get(): Locator;
  getAlias(): string;
  getLocatorString(): string;
  toString(): string;
}

export class WebComponent implements Component {
  page: Page;
  locatorString: string;
  alias: string;
  locator: Locator;

  constructor(page: Page, alias: string, locator: string | Locator) {
    this.page = page;
    this.locatorString = typeof locator === 'string' ? locator : locator.toString();
    this.alias = alias;
    this.locator = typeof locator === 'string' ? page.locator(locator) : locator;
  }

  get(): Locator {
    return this.locator;
  }

  getAlias(): string {
    return this.alias;
  }

  getLocatorString(): string {
    return this.locatorString;
  }

  async click() {
    await this.get().click();
  }

  async fill(value: string) {
    await this.get().fill(value);
  }

  async selectOptionUsingVisibleText(text: string) {
    await this.get().selectOption(text);
  }

  async selectOptionusingIndex(index: number) {
    await this.get().selectOption({ index: index });
  }

  async selectOptionUsingValue(value: string) {
    await this.get().selectOption({ value: value });
  }

  async waitForVisible(timeout: number) {
    await this.get().waitFor({
      state: 'visible',
      timeout: timeout,
    });
  }

  async waitForExists(timeout: number) {
    await this.get().waitFor({
      state: 'attached',
      timeout: timeout,
    });
  }

  async exists(timeout: number = 10000): Promise<boolean> {
    try {
      await this.waitForExists(timeout);
      return true;
    } catch (error) {
      console.error('unable to find element with locator %s', this.getLocatorString());
      console.error('error : ', error);
    }
    return false;
  }
}

export default class PlaywrightBrowser implements BrowserInterface {
  playwrightConfig: PlaywrightTestConfig;
  browser: Browser | undefined;
  page: Page | undefined;

  constructor() {
    this.playwrightConfig = config.playwrightConfig;
  }

  async launchPage(): Promise<Page> {
    this.browser = await this.getBrowser();
    this.page = await this.browser.newPage();
    return this.page;
  }

  getPage() {
    return this.page;
  }

  async closePage(): Promise<void> {
    if (this.browser) await this.browser.close();
  }

  async getBrowser(): Promise<Browser> {
    let projectConfig: any = config.browser_project
      ? this.playwrightConfig.projects?.find((project) => {
          return project.name === config.browser_project;
        })
      : this.playwrightConfig.projects?.at(0);
    return await this.launchBrowser(projectConfig);
  }

  async launchBrowser(projectConfig: Project): Promise<Browser> {
    const options = projectConfig.use as BrowserContextOptions;
    if (projectConfig.name === 'chromium') {
      return chromium.launch(options);
    } else if (projectConfig.name === 'firefox') {
      return firefox.launch(options);
    } else if (projectConfig.name === 'webkit') {
      return webkit.launch(options);
    } else {
      throw new Error(`Unsupported browser: ${projectConfig.name}`);
    }
  }
}

const createComponent = (page: Page, alias: string, locator: string | Locator): WebComponent => {
  return new WebComponent(page, alias, locator);
};

const getComponents = (object: any): Map<string, WebComponent> => {
  let map = new Map<string, WebComponent>();
  let keys: string[] = Object.keys(object);
  for (var key of keys) {
    let value: any = object[key];
    if (value instanceof WebComponent) {
      let component: WebComponent = value;
      let alias: string = value.getAlias();
      if (alias != undefined) {
        map.set(alias, component);
      }
    }
  }
  return map;
};

const browser = new PlaywrightBrowser();

export { createComponent, getComponents, browser };
