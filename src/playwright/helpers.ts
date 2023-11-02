import { Browser, LaunchOptions, Locator, Page, PlaywrightTestConfig, Project, chromium, firefox, expect as verify, webkit } from '@playwright/test';
import { BrowserInterface, FillOptions, SelectOptions, findOptions } from 'custom-types/types';
import { getPage, setBrowser, setPage } from 'playwright/page-utils';
import { logger } from 'src/setup/logger';
import { config } from 'test.config';
import { pageActions } from './actions';

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
    logger.info("clicked on element '%s'", this.alias);
  }

  async clickAndWait() {
    await this.get().click();
    await getPage().waitForFunction(() => {
      console.log((window as any)['processFlag']);
      let number = (window as any)['processFlag'];
      return number == '4' || number == '-1';
    });
    // await Promise.all([this.get().click(), getPage().waitForTimeout(1000), getPage().waitForRequest((request) => request.resourceType() === 'xhr')]);
    logger.info("clicked on element '%s'", this.alias);
  }

  async fill(value: string, skipIfUndefinedOrBlank?: boolean, options?: FillOptions) {
    await pageActions.fill(this.locatorString, value, skipIfUndefinedOrBlank, options);
    logger.info("entered text '%s' in field '%s'", value, this.alias);
  }

  async fillAndWait(value: string, skipIfUndefinedOrBlank?: boolean, options?: FillOptions) {
    await pageActions.fill(this.locatorString, value, skipIfUndefinedOrBlank, options);
    await getPage().locator(this.locatorString).press('Tab', options);
    await getPage().waitForFunction(() => {
      console.log((window as any)['processFlag']);
      let number = (window as any)['processFlag'];
      return number == '4' || number == '-1';
    });
    // await Promise.all([
    //   pageActions.fill(this.locatorString, value, skipIfUndefinedOrBlank, options),
    //   getPage().waitForRequest((request) => request.resourceType() === 'xhr'),
    // ]);
    logger.info("entered text '%s' in field '%s'", value, this.alias);
  }

  async fillAndPressTab(value: string, skipIfUndefinedOrBlank?: boolean, options?: FillOptions) {
    await pageActions.fill(this.locatorString, value, skipIfUndefinedOrBlank, options);
    await getPage().locator(this.locatorString).press('Tab', options);
    logger.info("entered text '%s' in field '%s'", value, this.alias);
  }

  async selectByText(text: string, skipIfUndefinedOrBlank?: boolean, options?: SelectOptions) {
    await pageActions.selectByText(this.locatorString, text, skipIfUndefinedOrBlank, options);
    logger.info("selected option '%s' in dropdown '%s'", text, this.alias);
  }

  async selectByTextAndWait(text: string, skipIfUndefinedOrBlank?: boolean, options?: SelectOptions) {
    await pageActions.selectByText(this.locatorString, text, skipIfUndefinedOrBlank, options);
    await getPage().waitForFunction(() => {
      console.log((window as any)['processFlag']);
      let number = (window as any)['processFlag'];
      return number == '4' || number == '-1';
    });
    // await Promise.all([
    //   pageActions.selectByText(this.locatorString, text, skipIfUndefinedOrBlank, options),
    //   getPage().waitForRequest((request) => {
    //     logger.info('request : %s', request.url());
    //     logger.info('request type : %s', request.resourceType());
    //     return request.resourceType() === 'xhr';
    //   }),
    // ]);
    logger.info("selected option '%s' in dropdown '%s'", text, this.alias);
  }

  async selectOptionusingIndex(index: number) {
    await this.get().selectOption({ index: index });
  }

  async selectOptionUsingValue(value: string) {
    await this.get().selectOption({ value: value });
  }

  async waitForVisible(timeout?: number) {
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
    let context = await this.browser.newContext();
    await context.addInitScript({
      path: './src/playwright/js/XHRGlobalEvents.js',
    });
    this.page = await context.newPage();
    if (config.playwrightConfig.globalTimeout !== undefined) {
      this.page.setDefaultTimeout(config.playwrightConfig.globalTimeout!);
    }
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
    const options = projectConfig.use as LaunchOptions;
    let browser: Browser;
    if (projectConfig.name?.startsWith('chromium')) {
      browser = await chromium.launch(options);
    } else if (projectConfig.name?.startsWith('firefox')) {
      browser = await firefox.launch(options);
    } else if (projectConfig.name?.startsWith('webkit')) {
      browser = await webkit.launch(options);
    } else {
      throw new Error(`Unsupported browser: ${projectConfig.name}`);
    }
    // switch (projectConfig.name) {
    //   case 'chromium':
    //     browser = await chromium.launch(options);
    //     break;
    //   case 'firefox':
    //     browser = await firefox.launch(options);
    //     break;
    //   case 'webkit':
    //     browser = await webkit.launch(options);
    //     break;
    //   default:
    //     throw new Error(`Unsupported browser: ${projectConfig.name}`);
    // }
    return browser;
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

export { browserProvider, createComponent, expect, getComponents, softExpect };
