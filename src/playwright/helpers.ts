import {
  Browser,
  BrowserContextOptions,
  Locator,
  Page,
  PlaywrightTestConfig,
  Project,
  chromium,
  firefox,
  webkit,
  expect as verify,
} from '@playwright/test';
import { BrowserInterface, findOptions } from 'custom-types/types';
import { config } from 'test.config';
import { getPage, setBrowser, setPage } from 'playwright/page-utils';

let softExpect = verify.configure({ soft: true, timeout: config.playwrightConfig.expect?.timeout });
let expect = verify.configure({ timeout: config.playwrightConfig.expect?.timeout });

interface Component {
  get(): Locator;
  getAlias(): string | undefined;
  getLocatorString(): string;
  toString(): string;
}

export class WebComponent implements Component {
  locatorString: string;
  alias: string | undefined;

  constructor(locatorString: string, alias?: string) {
    this.locatorString = locatorString;
    this.alias = alias;
  }

  get(): Locator {
    return getPage().locator(this.locatorString);
  }

  find(selector: string, options?: findOptions): Locator {
    return getPage().locator(this.locatorString).locator(selector, options);
  }

  async findAll(selector: string, options?: findOptions): Promise<Locator[]> {
    return await getPage().locator(this.locatorString).locator(selector, options).all();
  }

  getAlias(): string | undefined {
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
    setPage(this.page);
    setBrowser(this.browser);
    return this.page;
  }

  getPage() {
    return this.page;
  }

  async closePage(): Promise<void> {
    if (this.browser) {
      await this.page?.close();
      await this.browser.close();
    }
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
    switch (projectConfig.name) {
      case 'chromium':
        return chromium.launch(options);
      case 'firefox':
        return firefox.launch(options);
      case 'webkit':
        return webkit.launch(options);
      default:
        throw new Error(`Unsupported browser: ${projectConfig.name}`);
    }
  }
}

const createComponent = (locator: string, options?: { alias?: string }): WebComponent => {
  let alias: string | undefined;
  if (options) {
    alias = options.alias;
  }
  return new WebComponent(locator, alias);
};

const getComponents = (object: any): Map<string, WebComponent> => {
  let map = new Map<string, WebComponent>();
  let keys: string[] = Object.keys(object);
  for (var key of keys) {
    let value: any = object[key];
    if (value instanceof WebComponent) {
      let component: WebComponent = value;
      let alias: string | undefined = value.getAlias();
      if (alias != undefined) {
        map.set(alias, component);
      }
    }
  }
  return map;
};

const browserProvider = new PlaywrightBrowser();

export { softExpect, expect, createComponent, getComponents, browserProvider };
